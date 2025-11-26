import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
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

interface LoginFormProps {
  onLoginSuccess: (email?: string) => void;
}

type LoginFormNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const navigation = useNavigation<LoginFormNavProp>();
  const { login, register, verifyCode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Registration states
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertTitle('Campos incompletos');
      setAlertMessage('Por favor completa todos los campos');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      // 🔹 Llamada al backend usando tu AuthContext
      const result = await login({ email, password });

      if (result.requiresVerification) {
        // Navigate to verification screen
        onLoginSuccess(email);
        return;
      }

      setAlertTitle('¡Bienvenido!');
      setAlertMessage('Login exitoso');
      setAlertVisible(true);

      // 🔹 Redirigir a Schedules después de un pequeño delay
      setTimeout(() => {
        setAlertVisible(false);
        onLoginSuccess();
      }, 1200);
    } catch (error: any) {
      setAlertTitle('Error de autenticación');
      setAlertMessage(error.message || 'Credenciales inválidas');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !fullName || !selectedRole) {
      setAlertTitle('Campos incompletos');
      setAlertMessage('Por favor completa todos los campos obligatorios');
      setAlertVisible(true);
      return;
    }

    // Validar campos adicionales según el rol
    if (selectedRole === 'MAESTRO' && !selectedSubject) {
      setAlertTitle('Campo requerido');
      setAlertMessage('Por favor selecciona una materia');
      setAlertVisible(true);
      return;
    }

    if (selectedRole === 'ESTUDIANTE' && !selectedCourse) {
      setAlertTitle('Campo requerido');
      setAlertMessage('Por favor selecciona un curso');
      setAlertVisible(true);
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

      setAlertTitle('¡Solicitud enviada!');
      setAlertMessage('Tu solicitud de registro ha sido enviada al coordinador para aprobación. Recibirás una notificación cuando sea revisada.');
      setAlertVisible(true);

      // Reset form and switch to login mode after success
      setTimeout(() => {
        setAlertVisible(false);
        setIsRegistering(false);
        // Reset registration form fields
        setRegisterEmail('');
        setRegisterPassword('');
        setFullName('');
        setSelectedRole('');
        setSelectedSubject('');
        setSelectedCourse('');
      }, 2000);
    } catch (error: any) {
      setAlertTitle('Error de registro');
      setAlertMessage(error.message || 'Error al registrar usuario');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Reset form fields when switching modes
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
    <ScrollView contentContainerStyle={styles.formContainer} key={isRegistering ? 'register' : 'login'}>
      {!isRegistering ? (
        <>
          {/* Login Form */}
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Image
              source={userIcon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Contraseña */}
          <PasswordInput
            value={password}
            onChange={setPassword}
            isVisible={isPasswordVisible}
            onToggle={togglePasswordVisibility}
          />

          {/* Botón login */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Cargando...' : 'Ingresar'}
            </Text>
          </TouchableOpacity>

          {/* Enlace para recuperar contraseña */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => navigation.navigate('ForgotPassword')}
            activeOpacity={0.8}
          >
            <Text style={styles.switchButtonText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* Botón para cambiar a registro */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleMode}
            activeOpacity={0.8}
          >
            <Text style={styles.switchButtonText}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Registration Form */}
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Image
              source={userIcon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={registerEmail}
              onChangeText={setRegisterEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Nombre completo */}
          <View style={styles.inputWrapper}>
            <Image
              source={userIcon}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Contraseña */}
          <PasswordInput
            value={registerPassword}
            onChange={setRegisterPassword}
            isVisible={isPasswordVisible}
            onToggle={togglePasswordVisibility}
          />

          {/* Selector de rol */}
          <View style={styles.inputWrapper}>
            <Picker
              selectedValue={selectedRole}
              onValueChange={(itemValue) => {
                setSelectedRole(itemValue);
                // Reset conditional fields when role changes
                setSelectedSubject('');
                setSelectedCourse('');
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un rol" value="" />
              {availableRoles.map((role) => (
                <Picker.Item key={role.value} label={role.label} value={role.value} />
              ))}
            </Picker>
          </View>

          {/* Selector de materia (solo para profesores) */}
          {selectedRole === 'MAESTRO' && (
            <View style={styles.inputWrapper}>
              <Picker
                selectedValue={selectedSubject}
                onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una materia" value="" />
                {availableSubjects.map((subject) => (
                  <Picker.Item key={subject.subjectId} label={subject.subjectName} value={subject.subjectId.toString()} />
                ))}
              </Picker>
            </View>
          )}

          {/* Selector de curso (solo para estudiantes) */}
          {selectedRole === 'ESTUDIANTE' && (
            <View style={styles.inputWrapper}>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un curso" value="" />
                {availableCourses.map((course) => (
                  <Picker.Item key={course.courseId} label={course.courseName} value={course.courseId.toString()} />
                ))}
              </Picker>
            </View>
          )}


          {/* Botón registro */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Text>
          </TouchableOpacity>

          {/* Botón para cambiar a login */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleMode}
            activeOpacity={0.8}
          >
            <Text style={styles.switchButtonText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal de alerta */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
}
