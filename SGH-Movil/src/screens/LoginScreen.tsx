import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from '../styles/loginStyles';
import LoginForm from '../components/Login/LoginForm';
import { RootStackParamList } from '../navigation/AppNavigation';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Configurar status bar con letras oscuras para fondo blanco
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setTranslucent(false);

    return () => {
      // Restaurar status bar por defecto al salir
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#ffffff');
      StatusBar.setTranslucent(false);
    };
  }, []);

  // Este useEffect se removió para mantener el flujo normal de login

  const handleLoginSuccess = (email?: string) => {
    if (email) {
      // Navigate to verification screen after successful login
      navigation.navigate('VerificationCode', { email });
    } else {
      // Navigate directly to main tabs
      navigation.replace('MainTabs');
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
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Título de bienvenida */}
              <View style={styles.titleContainer}>
                <Text style={styles.loginTitle}>
                  {isRegistering ? '📋 Solicitar Acceso' : '¡Bienvenido!'}
                </Text>
                <Text style={styles.loginSubtitle}>
                  {isRegistering
                    ? 'Envía tu solicitud de registro para ser aprobado por el coordinador'
                    : 'Inicia sesión para acceder a tu cuenta'
                  }
                </Text>
              </View>

              {/* Formulario de login */}
              <View style={styles.formCard}>
                <LoginForm
                  onLoginSuccess={handleLoginSuccess}
                  isRegistering={isRegistering}
                  onToggleMode={() => setIsRegistering(!isRegistering)}
                />
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
    </SafeAreaView>
  );
}
