import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/Login/CustomAlert';
import { styles } from '../styles/loginStyles';
import { RootStackParamList } from '../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const userIcon = require('../assets/images/user.png');

type ForgotPasswordNavProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavProp>();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleRequestReset = async () => {
    if (!email.trim()) {
      setAlertTitle('Email requerido');
      setAlertMessage('Por favor ingresa tu correo electrónico');
      setAlertVisible(true);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertTitle('Email inválido');
      setAlertMessage('Por favor ingresa un correo electrónico válido');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const result = await requestPasswordReset({ email });

      setAlertTitle('Código enviado');
      setAlertMessage(result.message);
      setAlertVisible(true);

      // Navigate to verification code screen after success
      setTimeout(() => {
        setAlertVisible(false);
        navigation.navigate('VerificationCodeReset', { email });
      }, 2000);
    } catch (error: any) {
      setAlertTitle('Error');
      setAlertMessage(error.message || 'Error al enviar el código de verificación');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../assets/images/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay} pointerEvents="none" />

        <ScrollView
          contentContainerStyle={styles.mainContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../assets/images/contrasena.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.loginTitle}>Recuperar Contraseña</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              Ingresa tu correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña.
            </Text>

            <View style={styles.inputWrapper}>
              <Image source={userIcon} style={styles.inputIcon} />
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

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleRequestReset}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Enviando...' : 'Enviar código'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.switchButtonText}>
                Volver al inicio de sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}