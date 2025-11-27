import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../../styles/loginStyles';
import { useAuth } from '../../context/AuthContext';
import CustomAlert from './CustomAlert';
import { PasswordInput } from './PasswordInput';
import { getRolesService } from '../../api/services/authService';
import { getAllSubjects, SubjectDTO } from '../../api/services/subjectService';
import { getAllCourses, CourseDTO } from '../../api/services/courseService';
import { Role, RegisterRequest } from '../../api/types/auth';
import { RootStackParamList } from '../../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const userIcon = require('../../assets/images/user.png');
const lockIcon = require('../../assets/images/lock.png');

interface LoginFormProps {
  onLoginSuccess: (email?: string) => void;
  isRegistering?: boolean;
  onToggleMode?: () => void;
}

type LoginFormNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginForm({ onLoginSuccess, isRegistering = false, onToggleMode }: LoginFormProps) {
  const navigation = useNavigation<LoginFormNavProp>();
  const { login, register, verifyCode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  // Registration states
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<SubjectDTO[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseDTO[]>([]);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  // Load roles on component mount
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await getRolesService();
        setAvailableRoles(response.roles);
      } catch (error) {
        console.error('Error loading roles:', error);
      }
    };
    loadRoles();
  }, []);

  // Load subjects and courses when entering registration mode
  useEffect(() => {
    if (isRegistering) {
      const loadData = async () => {
        try {
          const [subjectsData, coursesData] = await Promise.all([
            getAllSubjects(),
            getAllCourses(),
          ]);
          setAvailableSubjects(subjectsData);
          setAvailableCourses(coursesData);
        } catch (error) {
          console.error('Error loading subjects/courses:', error);
        }
      };
      loadData();
    }
  }, [isRegistering]);

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  // Función de validación de contraseña segura
  const validatePasswordStrength = (password: string, email: string): { isValid: boolean; message: string } => {
    // Contraseñas comunes que no se permiten
    const commonPasswords = [
      '123456', 'password', '123456789', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
      'qwerty123', 'admin123', 'root', 'user', 'guest'
    ];

    // Verificar si es una contraseña común
    if (commonPasswords.includes(password.toLowerCase())) {
      return { isValid: false, message: 'Esta contraseña es muy común. Elige una más segura.' };
    }

    // Verificar si es igual al email (sin dominio)
    const emailPrefix = email.split('@')[0].toLowerCase();
    if (password.toLowerCase().includes(emailPrefix) && emailPrefix.length > 3) {
      return { isValid: false, message: 'La contraseña no puede contener partes de tu email.' };
    }

    // Verificar secuencias comunes
    const sequences = ['123456', 'abcdef', 'qwerty', 'asdfgh', 'zxcvbn'];
    if (sequences.some(seq => password.toLowerCase().includes(seq))) {
      return { isValid: false, message: 'Evita secuencias de caracteres consecutivos.' };
    }

    // Verificar que tenga al menos una mayúscula, una minúscula y un número
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.'
      };
    }

    // Bonus por caracteres especiales
    if (!hasSpecialChar) {
      return {
        isValid: true,
        message: 'Contraseña aceptable, pero considera agregar un carácter especial (!@#$%^&*) para mayor seguridad.'
      };
    }

    return { isValid: true, message: 'Contraseña segura.' };
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Campos incompletos', 'Por favor completa todos los campos', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await login({ email, password });

      if (result.requiresVerification) {
        onLoginSuccess(email);
        return;
      }

      showAlert('¡Bienvenido!', 'Login exitoso', 'success');

      setTimeout(() => {
        setAlertVisible(false);
        onLoginSuccess();
      }, 1200);
    } catch (error: any) {
      const errorMessage = error.message || 'Credenciales inválidas';

      // Manejar errores específicos de cuenta
      if (errorMessage.includes('no existe') || errorMessage.includes('no encontrada')) {
        showAlert(
          'Cuenta no registrada',
          'Este correo electrónico no está registrado en el sistema. Si deseas acceder, solicita tu registro al coordinador.',
          'error'
        );
      } else if (errorMessage.includes('no activada') || errorMessage.includes('pendiente') || errorMessage.includes('aprobación')) {
        showAlert(
          '⏳ Cuenta pendiente de aprobación',
          'Tu solicitud de registro está siendo revisada por el coordinador. No podrás acceder hasta que sea aprobada. Recibirás una notificación cuando sea activada.',
          'info'
        );
      } else if (errorMessage.includes('rechazada') || errorMessage.includes('denegada')) {
        showAlert(
          '❌ Solicitud rechazada',
          'Tu solicitud de registro fue rechazada. Contacta al coordinador para más información.',
          'error'
        );
      } else if (errorMessage.includes('inactiva') || errorMessage.includes('desactivada')) {
        showAlert(
          '🚫 Cuenta desactivada',
          'Tu cuenta ha sido desactivada temporalmente. Contacta al coordinador para reactivarla.',
          'error'
        );
      } else {
        showAlert('Error de autenticación', 'Credenciales incorrectas. Verifica tu email y contraseña.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !fullName || !selectedRole) {
      showAlert('Campos incompletos', 'Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    if (registerPassword.length < 8) {
      showAlert('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    // Validación de seguridad de contraseña
    const passwordValidation = validatePasswordStrength(registerPassword, registerEmail);
    if (!passwordValidation.isValid) {
      showAlert('Contraseña insegura', passwordValidation.message, 'error');
      return;
    }

    if (selectedRole === 'MAESTRO' && !selectedSubject) {
      showAlert('Campo requerido', 'Por favor selecciona una materia', 'error');
      return;
    }

    if (selectedRole === 'ESTUDIANTE' && !selectedCourse) {
      showAlert('Campo requerido', 'Por favor selecciona un curso', 'error');
      return;
    }

    setLoading(true);
    try {
      const registerRequest: RegisterRequest = {
        name: fullName,
        email: registerEmail,
        password: registerPassword,
        role: selectedRole,
        subjectId: selectedRole === 'MAESTRO' ? parseInt(selectedSubject) : undefined,
        courseId: selectedRole === 'ESTUDIANTE' ? parseInt(selectedCourse) : undefined,
      };

      const result = await register(registerRequest);

      // Marcar que el registro fue exitoso para cambiar el comportamiento del CustomAlert
      setIsRegistrationSuccess(true);

      showAlert(
        '📋 Solicitud de Registro Enviada',
        'Tu solicitud ha sido enviada al coordinador/administrador para revisión y aprobación. No podrás acceder al sistema hasta que tu cuenta sea activada. Recibirás una notificación por email cuando sea revisada.',
        'info'
      );
    } catch (error: any) {
      showAlert('Error de registro', error.message || 'Error al registrar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Callback para cuando el usuario confirma el registro exitoso
  const handleRegistrationSuccess = () => {
    setAlertVisible(false);
    setIsRegistrationSuccess(false); // Resetear el estado
    if (onToggleMode) onToggleMode();
    // Limpiar formulario
    setRegisterEmail('');
    setRegisterPassword('');
    setFullName('');
    setSelectedRole('');
    setSelectedSubject('');
    setSelectedCourse('');
  };

  const toggleMode = () => {
    if (onToggleMode) onToggleMode();
    if (!isRegistering) {
      setRegisterEmail('');
      setRegisterPassword('');
      setFullName('');
      setSelectedRole('');
      setSelectedSubject('');
      setSelectedCourse('');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <View style={styles.formContainer}>
      {!isRegistering ? (
        <>
          {/* Login Form */}
          {/* Email Input */}
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={userIcon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Contraseña</Text>
          <PasswordInput
            value={password}
            onChange={setPassword}
            isVisible={isPasswordVisible}
            onToggle={togglePasswordVisibility}
          />

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('ForgotPassword')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkButtonText}>
              ¿Olvidaste tu contraseña? <Text style={styles.linkText}>Recupérala aquí</Text>
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={toggleMode}
            activeOpacity={0.7}
          >
            <Text style={styles.linkButtonText}>
              ¿No tienes cuenta? <Text style={styles.linkText}>Regístrate ahora</Text>
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Registration Form */}
          {/* Email Input */}
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={userIcon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#94a3b8"
              value={registerEmail}
              onChangeText={setRegisterEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          {/* Full Name Input */}
          <Text style={styles.inputLabel}>Nombre completo</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={userIcon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              placeholderTextColor="#94a3b8"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.inputLabel}>Contraseña</Text>
          <PasswordInput
            value={registerPassword}
            onChange={setRegisterPassword}
            isVisible={isPasswordVisible}
            onToggle={togglePasswordVisibility}
          />

          {/* Role Picker */}
          <Text style={styles.inputLabel}>Rol</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedRole}
              onValueChange={(itemValue) => {
                setSelectedRole(itemValue);
                setSelectedSubject('');
                setSelectedCourse('');
              }}
              style={styles.picker}
              dropdownIconColor="#3b82f6"
            >
              <Picker.Item label="Selecciona un rol" value="" color="#94a3b8" />
              {availableRoles.map((role) => (
                <Picker.Item label={role.label} value={role.value} color="#1e293b" />
              ))}
            </Picker>
          </View>

          {/* Subject Picker (for teachers) */}
          {selectedRole === 'MAESTRO' && (
            <>
              <Text style={styles.inputLabel}>Materia</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedSubject}
                  onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#3b82f6"
                >
                  <Picker.Item label="Selecciona una materia" value="" color="#94a3b8" />
                  {availableSubjects.map((subject) => (
                    <Picker.Item
                      label={subject.subjectName}
                      value={subject.subjectId.toString()}
                      color="#1e293b"
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Course Picker (for students) */}
          {selectedRole === 'ESTUDIANTE' && (
            <>
              <Text style={styles.inputLabel}>Curso</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedCourse}
                  onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#3b82f6"
                >
                  <Picker.Item label="Selecciona un curso" value="" color="#94a3b8" />
                  {availableCourses.map((course) => (
                    <Picker.Item
                      label={course.courseName}
                      value={course.courseId.toString()}
                      color="#1e293b"
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Enviando solicitud...' : '📋 Solicitar Registro'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={toggleMode}
            activeOpacity={0.7}
          >
            <Text style={styles.linkButtonText}>
              ¿Ya tienes cuenta? <Text style={styles.linkText}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => {
          setAlertVisible(false);
          setIsRegistrationSuccess(false); // Resetear el estado
        }}
        onRegistrationSuccess={handleRegistrationSuccess}
        isRegistrationSuccess={isRegistrationSuccess}
      />
    </View>
  );
}
