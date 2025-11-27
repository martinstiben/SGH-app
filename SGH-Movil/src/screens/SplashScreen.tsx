import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Animated, StyleSheet, Dimensions, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, validateSession } = useAuth();

  // Animaciones múltiples
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;

  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Secuencia completa de animaciones
    const animationSequence = Animated.sequence([
      // Primera fase: Logo con entrada dramática
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.2,
          tension: 15,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]),

      // Pequeña pausa
      Animated.delay(200),

      // Logo vuelve a tamaño normal
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 5,
        useNativeDriver: true,
      }),

      // Segunda fase: Título principal aparece
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 8,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          tension: 10,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),

      // Tercera fase: Subtítulo aparece
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          tension: 12,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),

      // Cuarta fase: Barra de progreso aparece y se llena
      Animated.parallel([
        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(progressWidth, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]);

    // Iniciar animaciones
    animationSequence.start(async () => {
      // Después de las animaciones, decidir dónde navegar basado en el estado de autenticación
      setTimeout(async () => {
        try {
          // Si hay token, validar si es válido
          if (token) {
            const isValidSession = await validateSession();
            if (isValidSession) {
              // Token válido, ir directamente a MainTabs
              navigation.replace('MainTabs');
              return;
            }
          }

          // No hay token válido, ir al flujo normal: Landing -> Login
          navigation.replace('Landing');
        } catch (error) {
          console.error('Error durante validación de sesión en Splash:', error);
          // En caso de error, ir al flujo normal
          navigation.replace('Landing');
        }
      }, 2200);
    });
  }, [navigation, token, validateSession]);

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Elementos decorativos de fondo */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <View style={styles.content}>
        {/* Logo con animación compleja */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoScale },
                { rotate: logoRotation }
              ],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoGlow}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Título con animación */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [
                { translateY: titleTranslateY },
                { scale: titleScale }
              ],
            },
          ]}
        >
          <Text style={styles.title}>SGH</Text>
        </Animated.View>

        {/* Subtítulo con animación */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          <Text style={styles.subtitle}>Sistema Inteligente de</Text>
          <Text style={styles.subtitleBold}>Gestión de Horarios</Text>
        </Animated.View>

        {/* Barra de progreso profesional */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: loadingOpacity,
            },
          ]}
        >
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Descubriendo el futuro académico</Text>
        </Animated.View>
      </View>

      {/* Footer con información inspiradora */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Innovando la educación del futuro</Text>
        <Text style={styles.footerSubtext}>Sistema Inteligente • Gestión Eficiente • Resultados Excepcionales</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff', // Azul muy claro de la landing
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#3b82f6',
    top: height * 0.1,
    left: -width * 0.2,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#1e40af',
    top: height * 0.3,
    right: -width * 0.15,
  },
  circle3: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#dbeafe',
    bottom: height * 0.2,
    left: width * 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 160,
    height: 160,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1e40af', // Azul oscuro
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#3b82f6', // Azul principal
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
  },
  subtitleBold: {
    fontSize: 18,
    color: '#1e40af',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 26,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginHorizontal: 4,
  },
  dot1: {
    backgroundColor: '#3b82f6',
  },
  dot2: {
    backgroundColor: '#1e40af',
  },
  dot3: {
    backgroundColor: '#dbeafe',
  },
  loadingText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  progressBarContainer: {
    width: 220,
    height: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 6,
    lineHeight: 18,
  },
  footerSubtext: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: 14,
  },
});