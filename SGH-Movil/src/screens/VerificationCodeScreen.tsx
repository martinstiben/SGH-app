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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/Login/CustomAlert';
import { styles } from '../styles/loginStyles';
import { RootStackParamList } from '../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const lockIcon = require('../assets/images/contrasena.png');

const { width, height } = Dimensions.get('window');

type VerificationCodeRouteProp = RouteProp<RootStackParamList, 'VerificationCode'>;
type VerificationCodeNavProp = NativeStackNavigationProp<RootStackParamList, 'VerificationCode'>;

export default function VerificationCodeScreen() {
  const navigation = useNavigation<VerificationCodeNavProp>();
  const route = useRoute<VerificationCodeRouteProp>();
  const { email } = route.params;
  const { verifyCode } = useAuth();

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

  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showAlert('Código requerido', 'Por favor ingresa el código de verificación', 'error');
      return;
    }

    if (verificationCode.length !== 6) {
      showAlert('Código incompleto', 'El código debe tener 6 dígitos', 'error');
      return;
    }

    setLoading(true);
    try {
      await verifyCode({ email, code: verificationCode });

      // Navigate directly to main tabs without showing alert
      navigation.replace('MainTabs');
    } catch (error: any) {
      const errorMessage = error.message || 'Error de verificación';

      // Manejar errores específicos de estado de cuenta
      if (errorMessage.includes('no activada') || errorMessage.includes('pendiente')) {
        showAlert(
          'Cuenta no activada',
          'Tu cuenta aún no ha sido activada por el coordinador. No puedes acceder al sistema hasta que sea aprobada.',
          'error'
        );
        // Redirigir al login después de un tiempo
        setTimeout(() => {
          navigation.replace('Login');
        }, 3000);
      } else if (errorMessage.includes('inactiva') || errorMessage.includes('desactivada')) {
        showAlert(
          'Cuenta desactivada',
          'Tu cuenta ha sido desactivada. Contacta al coordinador para más información.',
          'error'
        );
        setTimeout(() => {
          navigation.replace('Login');
        }, 3000);
      } else {
        showAlert('Código incorrecto', 'El código de verificación es incorrecto o ha expirado. Inténtalo de nuevo.', 'error');
      }
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

              {/* Título de verificación */}
              <View style={styles.titleContainer}>
                <Text style={styles.loginTitle}>Verificar Código</Text>
                <Text style={styles.loginSubtitle}>
                  Confirma tu identidad para continuar
                </Text>
              </View>

              {/* Formulario de verificación */}
              <View style={styles.formCard}>
                <Text style={styles.instructionText}>
                  Hemos enviado un código de verificación de 6 dígitos a tu correo electrónico.
                </Text>

                <Text style={styles.emailText}>
                  Código enviado a: {email}
                </Text>

                {/* Code Input */}
                <Text style={styles.inputLabel}>Código de verificación</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.verificationInput]}
                    placeholder="000000"
                    placeholderTextColor="#94a3b8"
                    value={verificationCode}
                    onChangeText={(text) => {
                      // Only allow numeric characters
                      const numericText = text.replace(/[^0-9]/g, '');
                      setVerificationCode(numericText);
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                    textAlign="center"
                    autoFocus={false}
                    autoCorrect={false}
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                    returnKeyType="done"
                  />
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleVerifyCode}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                      <Text style={styles.loginButtonText}>Verificando...</Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Verificar código</Text>
                  )}
                </TouchableOpacity>

                {/* Back to Login Link */}
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleGoBack}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkButtonText}>
                    ¿No recibiste el código? <Text style={styles.linkText}>Reenviar código</Text>
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
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}