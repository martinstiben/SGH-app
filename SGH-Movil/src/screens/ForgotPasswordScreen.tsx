import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/Login/CustomAlert';
import { styles } from '../styles/loginStyles';
import { RootStackParamList } from '../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const userIcon = require('../assets/images/user.png');
const resetIcon = require('../assets/images/contrasena.png');

const { width, height } = Dimensions.get('window');

type ForgotPasswordNavProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavProp>();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleRequestReset = async () => {
    if (!email.trim()) {
      showAlert('Email requerido', 'Por favor ingresa tu correo electrónico', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Email inválido', 'Por favor ingresa un correo electrónico válido', 'error');
      return;
    }

    setLoading(true);

    // Mostrar pantalla de carga durante el envío
    try {
      const result = await requestPasswordReset({ email });

      // Mantener la alerta visible hasta que el usuario la cierre
      showAlert('¡Código enviado exitosamente!', `Se ha enviado un código de verificación a ${email}. Revisa tu bandeja de entrada y carpeta de spam.`, 'success');

      // No navegar automáticamente - esperar a que el usuario cierre la alerta
    } catch (error: any) {
      showAlert('Error al enviar código', error.message || 'No se pudo enviar el código de verificación. Inténtalo de nuevo.', 'error');
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
                    source={resetIcon}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Título de recuperación */}
              <View style={styles.titleContainer}>
                <Text style={styles.loginTitle}>Recuperar Contraseña</Text>
                <Text style={styles.loginSubtitle}>
                  Te ayudaremos a recuperar tu acceso
                </Text>
              </View>

              {/* Formulario de recuperación */}
              <View style={styles.formCard}>
                <Text style={styles.instructionText}>
                  Ingresa tu correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña.
                </Text>

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
                    returnKeyType="send"
                  />
                </View>

                {/* Send Code Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleRequestReset}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={styles.loginButtonText}>Enviando código...</Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Enviar código</Text>
                  )}
                </TouchableOpacity>

                {/* Back to Login Link */}
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleGoBack}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkButtonText}>
                    ¿Recordaste tu contraseña? <Text style={styles.linkText}>Inicia sesión</Text>
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
          // Navegar solo si el envío fue exitoso
          if (alertType === 'success') {
            navigation.navigate('VerificationCodeReset', { email });
          }
        }}
      />
    </SafeAreaView>
  );
}