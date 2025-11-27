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
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomAlert from '../components/Login/CustomAlert';
import { styles } from '../styles/loginStyles';
import { RootStackParamList } from '../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const lockIcon = require('../assets/images/contrasena.png');

const { width, height } = Dimensions.get('window');

type VerificationCodeResetRouteProp = RouteProp<RootStackParamList, 'VerificationCodeReset'>;
type VerificationCodeResetNavProp = NativeStackNavigationProp<RootStackParamList, 'VerificationCodeReset'>;

export default function VerificationCodeResetScreen() {
  const navigation = useNavigation<VerificationCodeResetNavProp>();
  const route = useRoute<VerificationCodeResetRouteProp>();
  const { email } = route.params;

  const [verificationCode, setVerificationCode] = useState('');
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
      // Aquí iría la verificación del código con el backend
      // Por ahora, asumimos que es válido y pasamos al siguiente paso
      navigation.navigate('ChangePassword', { email, verificationCode });
    } catch (error: any) {
      showAlert('Código incorrecto', 'El código de verificación es incorrecto. Inténtalo de nuevo.', 'error');
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

              {/* Título de verificación de código */}
              <View style={styles.titleContainer}>
                <Text style={styles.loginTitle}>Verificar Código</Text>
                <Text style={styles.loginSubtitle}>
                  Confirma tu identidad para continuar
                </Text>
              </View>

              {/* Formulario de verificación */}
              <View style={styles.formCard}>
                <Text style={styles.instructionText}>
                  Hemos enviado un código de verificación de 6 dígitos a tu correo electrónico para restablecer tu contraseña.
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
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Verificando...' : 'Verificar código'}
                  </Text>
                </TouchableOpacity>

                {/* Back to Forgot Password Link */}
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