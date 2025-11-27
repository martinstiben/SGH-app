import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Hook personalizado para validación periódica de sesión
function useSessionValidation() {
  const { token, validateSession } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Validar sesión inmediatamente al montar
    validateSession();

    // Configurar validación periódica cada 5 minutos
    const interval = setInterval(() => {
      validateSession();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [token, validateSession]);
}

import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerificationCodeResetScreen from '../screens/VerificationCodeResetScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  Login: undefined;
  VerificationCode: { email: string };
  ForgotPassword: undefined;
  VerificationCodeReset: { email: string };
  ChangePassword: { email: string; verificationCode: string };
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  const { token, loading, validateSession } = useAuth();

  // Validación periódica de sesión para usuarios autenticados
  useSessionValidation();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Text style={{ fontSize: 16, color: '#64748b' }}>Cargando...</Text>
      </View>
    );
  }


  return (
    <Stack.Navigator
      initialRouteName="Splash" // Siempre iniciar desde Splash para flujo consistente
      screenOptions={{
        headerShown: false,
        gestureEnabled: false // Deshabilitar swipe gestures para mayor seguridad
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerificationCodeReset" component={VerificationCodeResetScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
