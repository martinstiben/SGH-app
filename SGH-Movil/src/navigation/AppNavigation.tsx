import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerificationCodeResetScreen from '../screens/VerificationCodeResetScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  Login: undefined;
  VerificationCode: { email: string };
  ForgotPassword: undefined;
  VerificationCodeReset: { email: string };
  ChangePassword: { email: string; verificationCode: string };
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  const { token, loading } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return null; // O un componente de loading
  }

  return (
    <Stack.Navigator
      initialRouteName={token ? "MainTabs" : "Splash"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerificationCodeReset" component={VerificationCodeResetScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
