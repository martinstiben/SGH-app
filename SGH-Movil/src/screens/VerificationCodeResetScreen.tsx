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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomAlert from '../components/Login/CustomAlert';
import { styles } from '../styles/loginStyles';
import { RootStackParamList } from '../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const lockIcon = require('../assets/images/contrasena.png');

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

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setAlertTitle('Código requerido');
      setAlertMessage('Por favor ingresa el código de verificación');
      setAlertVisible(true);
      return;
    }

    if (verificationCode.length !== 6) {
      setAlertTitle('Código inválido');
      setAlertMessage('El código debe tener 6 dígitos');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la verificación del código con el backend
      // Por ahora, asumimos que es válido y pasamos al siguiente paso
      navigation.navigate('ChangePassword', { email, verificationCode });
    } catch (error: any) {
      setAlertTitle('Código incorrecto');
      setAlertMessage('El código de verificación es incorrecto. Inténtalo de nuevo.');
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
                source={lockIcon}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.loginTitle}>Verificar Código</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              Hemos enviado un código de verificación a tu correo electrónico para restablecer tu contraseña.
            </Text>

            <Text style={styles.emailText}>
              Código enviado a: {email}
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#999"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                maxLength={6}
                textAlign="center"
              />
            </View>

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

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.switchButtonText}>
                Volver
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