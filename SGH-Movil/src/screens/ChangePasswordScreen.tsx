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
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/Login/CustomAlert';
import { PasswordInput } from '../components/Login/PasswordInput';
import { styles } from '../styles/loginStyles';
import { RootStackParamList } from '../navigation/AppNavigation';

// Preload images to ensure they appear immediately
const lockIcon = require('../assets/images/contrasena.png');

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

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      setAlertTitle('Contraseña requerida');
      setAlertMessage('Por favor ingresa la nueva contraseña');
      setAlertVisible(true);
      return;
    }

    if (newPassword.length < 8) {
      setAlertTitle('Contraseña muy corta');
      setAlertMessage('La contraseña debe tener al menos 8 caracteres');
      setAlertVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertTitle('Contraseñas no coinciden');
      setAlertMessage('La nueva contraseña y la confirmación deben ser iguales');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const result = await verifyPasswordReset({
        email,
        verificationCode,
        newPassword
      });

      setAlertTitle('¡Contraseña cambiada exitosamente!');
      setAlertMessage('Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.');
      setAlertVisible(true);

      // No redirigir automáticamente, dejar que el usuario cierre la alerta manualmente
    } catch (error: any) {
      setAlertTitle('Error');
      setAlertMessage(error.message || 'Error al cambiar la contraseña');
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
                source={require('../assets/images/lock.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.loginTitle}>Nueva Contraseña</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              Establece tu nueva contraseña segura.
            </Text>

            <Text style={styles.emailText}>
              Correo: {email}
            </Text>

            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
              isVisible={isPasswordVisible}
              onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
            />

            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              isVisible={isConfirmPasswordVisible}
              onToggle={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            />

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleChangePassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
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
          onClose={() => {
            setAlertVisible(false);
            if (alertTitle === '¡Contraseña cambiada exitosamente!') {
              navigation.replace('Login');
            }
          }}
        />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}