import React, { useEffect } from 'react';
import {
  ImageBackground,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from '../styles/loginStyles';
import LoginHeader from '../components/Login/LoginHeader';
import LoginForm from '../components/Login/LoginForm';
import { RootStackParamList } from '../navigation/AppNavigation';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();

  useEffect(() => {
    // Configurar status bar transparente para login
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);

    return () => {
      // Restaurar status bar por defecto al salir
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#3b82f6');
      StatusBar.setTranslucent(false);
    };
  }, []);

  const handleLoginSuccess = (email?: string) => {
    if (email) {
      // Navigate to verification screen after successful login
      navigation.navigate('VerificationCode', { email });
    } else {
      // Navigate directly to main tabs
      navigation.replace('MainTabs');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <LoginHeader />

          <View style={styles.mainContent}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.loginTitle}>Inicio de sesión</Text>
            </View>

            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
