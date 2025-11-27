import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginService, registerService, verifyCodeService, requestPasswordResetService, verifyPasswordResetService } from '../api/services/authService';
import { LoginRequest, RegisterRequest, VerifyCodeRequest, PasswordResetRequest, PasswordResetVerifyRequest } from '../api/types/auth';

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<{ requiresVerification: boolean; message?: string }>;
  verifyCode: (request: VerifyCodeRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  requestPasswordReset: (request: PasswordResetRequest) => Promise<{ success: boolean; message: string }>;
  verifyPasswordReset: (request: PasswordResetVerifyRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  validateSession: () => Promise<boolean>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar token desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          // Validar que el token no haya expirado
          if (isTokenExpired(storedToken)) {
            console.log('Token expirado, eliminando...');
            await AsyncStorage.removeItem('token');
          } else {
            setToken(storedToken);
          }
        }
      } catch (err) {
        console.error('Error loading token from storage', err);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  // 🔹 Función para verificar si un token JWT ha expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      // Decodificar el payload del JWT (sin verificar firma)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Verificar si el token ha expirado
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return true; // Si no se puede decodificar, considerarlo expirado
    }
  };

  // 🔹 Función para validar sesión activa
  const validateSession = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      // Verificar si el token ha expirado
      if (isTokenExpired(token)) {
        console.log('Sesión expirada, cerrando sesión...');
        await logout();
        return false;
      }

      // Aquí podrías hacer una llamada al backend para validar el token
      // Por ahora, solo verificamos la expiración local
      return true;
    } catch (error) {
      console.error('Error validando sesión:', error);
      await logout();
      return false;
    }
  };

  // 🔹 Función para hacer llamadas API con validación automática de token
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Verificar si el token está expirado antes de hacer la llamada
    if (isTokenExpired(token)) {
      console.log('Token expirado detectado en llamada API, cerrando sesión...');
      await logout();
      throw new Error('Sesión expirada');
    }

    // Agregar el token a los headers
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    };

    const response = await fetch(url, authOptions);

    // Si el servidor responde con 401 (Unauthorized), el token podría ser inválido
    if (response.status === 401) {
      console.log('Token rechazado por el servidor, cerrando sesión...');
      await logout();
      throw new Error('Sesión inválida');
    }

    return response;
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await loginService(credentials);

      // Always require verification for security (2FA)
      return { requiresVerification: true, message: response.message };
    } catch (error: any) {
      // Re-throw the error with more specific handling
      throw error;
    }
  };

  const verifyCode = async (request: VerifyCodeRequest) => {
    const response = await verifyCodeService(request);
    const receivedToken = response.token;

    if (!receivedToken) {
      throw new Error('No token received from backend');
    }

    setToken(receivedToken);
    await AsyncStorage.setItem('token', receivedToken);
  };

  const register = async (request: RegisterRequest) => {
    await registerService(request);
    // Registration successful - return to login mode
    return { success: true, message: 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.' };
  };

  const requestPasswordReset = async (request: PasswordResetRequest) => {
    const response = await requestPasswordResetService(request);
    return { success: true, message: response.message };
  };

  const verifyPasswordReset = async (request: PasswordResetVerifyRequest) => {
    const response = await verifyPasswordResetService(request);
    return { success: true, message: response.message };
  };

  const logout = async () => {
    try {
      setToken(null);
      await AsyncStorage.removeItem('token');
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, verifyCode, register, requestPasswordReset, verifyPasswordReset, logout, validateSession, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
