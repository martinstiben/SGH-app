import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/Login/CustomAlert';
import { PasswordInput } from '../components/Login/PasswordInput';
import { styles } from '../styles/loginStyles';
import { RootStackParamList } from '../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const lockIcon = require('../assets/images/contrasena.png');

const { width, height } = Dimensions.get('window');

type ChangePasswordRouteProp = RouteProp<RootStackParamList, 'ChangePassword'>;
type ChangePasswordNavProp = NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen() {
  const navigation = useNavigation<ChangePasswordNavProp>();
  const route = useRoute<ChangePasswordRouteProp>();
  const { email, verificationCode } = route.params;
  const { verifyPasswordReset } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeUsed, setCodeUsed] = useState(false); // Seguridad: prevenir reutilización de códigos

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    // Configurar status bar azul para combinar con la landing
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#3b82f6');
    StatusBar.setTranslucent(false);

    return () => {
      // Restaurar status bar por defecto al salir
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#3b82f6');
      StatusBar.setTranslucent(false);
    };
  }, []);

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  // Función de validación de contraseña segura
  const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
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

  const handleChangePassword = async () => {
    // Seguridad: Verificar si el código ya fue usado
    if (codeUsed) {
      showAlert('Código ya utilizado', 'Este código de verificación ya ha sido utilizado. Solicita un nuevo código para restablecer tu contraseña.', 'error');
      return;
    }

    if (!newPassword.trim()) {
      showAlert('Contraseña requerida', 'Por favor ingresa la nueva contraseña', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showAlert('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    // Validación de seguridad de contraseña
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      showAlert('Contraseña insegura', passwordValidation.message, 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('Contraseñas no coinciden', 'La nueva contraseña y la confirmación deben ser iguales', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyPasswordReset({
        email,
        verificationCode,
        newPassword
      });

      // Seguridad: Marcar el código como usado para prevenir reutilización
      setCodeUsed(true);

      showAlert('¡Contraseña cambiada exitosamente!', 'Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.', 'success');

      // Redirigir después de cerrar la alerta
    } catch (error: any) {
      showAlert('Error', error.message || 'Error al cambiar la contraseña', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SGH</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        enabled={true}
      >
        {/* Fondo con elementos decorativos */}
        <View style={styles.backgroundGradient}>
          <View style={styles.backgroundDecoration}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={false}
          >
            <View style={styles.mainContent}>
              {/* Logo con estilo elegante */}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Image
                    source={lockIcon}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Título de cambio de contraseña */}
              <View style={styles.titleContainer}>
                <Text style={styles.loginTitle}>Nueva Contraseña</Text>
                <Text style={styles.loginSubtitle}>
                  Establece una contraseña segura para tu cuenta
                </Text>
              </View>

              {/* Formulario de cambio de contraseña */}
              <View style={styles.formCard}>
                <Text style={styles.instructionText}>
                  Crea una contraseña segura con al menos 8 caracteres.
                </Text>

                <Text style={styles.emailText}>
                  Correo: {email}
                </Text>

                {/* New Password Input */}
                <Text style={styles.inputLabel}>Nueva contraseña</Text>
                <PasswordInput
                  value={newPassword}
                  onChange={setNewPassword}
                  isVisible={isPasswordVisible}
                  onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
                  placeholder="Nueva contraseña"
                />

                {/* Confirm Password Input */}
                <Text style={[styles.inputLabel, { fontSize: 14, fontWeight: '600', marginBottom: 6 }]}>Confirmar contraseña</Text>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  isVisible={isConfirmPasswordVisible}
                  onToggle={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  placeholder="Confirmar contraseña"
                />

                {/* Change Password Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleChangePassword}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
                  </Text>
                </TouchableOpacity>

                {/* Back to Login Link */}
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleGoBack}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkButtonText}>
                    ¿Cambiaste de opinión? <Text style={styles.linkText}>Volver atrás</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Sistema Inteligente de Gestión de Horarios
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => {
          setAlertVisible(false);
          if (alertTitle === '¡Contraseña cambiada exitosamente!') {
            navigation.replace('Login');
          }
        }}
      />
    </SafeAreaView>
  );
}