import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Breakpoints para responsive design
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = width >= 768;

export const styles = StyleSheet.create({
  // Contenedor principal con fondo claro como la landing
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  
  // Fondo con gradiente visual
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  
  // Elementos decorativos de fondo
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.08,
    pointerEvents: 'none',
  },
  circle1: {
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#3b82f6',
    top: -width * 0.3,
    right: -width * 0.3,
  },
  circle2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#1e40af',
    bottom: -width * 0.2,
    left: -width * 0.2,
  },
  circle3: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#dbeafe',
    top: height * 0.4,
    right: -width * 0.1,
  },

  // Header con botón de regreso
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#3b82f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  // Contenedor del scroll
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },

  // Contenido principal centrado
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // Logo container con estilo elegante
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#dbeafe',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },

  // Título de la sección
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Contenedor del formulario
  formContainer: {
    width: '100%',
    maxWidth: isSmallDevice ? 320 : isMediumDevice ? 360 : 400,
    paddingHorizontal: isSmallDevice ? 4 : 8,
  },

  // Card del formulario con estilo elegante
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  // Wrapper de inputs mejorado
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: isSmallDevice ? 12 : 14,
    paddingHorizontal: isSmallDevice ? 14 : 16,
    height: isSmallDevice ? 52 : 56,
    marginBottom: isSmallDevice ? 12 : 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    pointerEvents: 'auto',
  },
  inputWrapperFocused: {
    borderColor: '#3b82f6',
    backgroundColor: '#ffffff',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 14,
    tintColor: '#94a3b8',
    resizeMode: 'contain',
  },
  inputIconFocused: {
    tintColor: '#3b82f6',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    paddingVertical: 0,
    fontWeight: '400',
    pointerEvents: 'auto',
    includeFontPadding: false,
    textAlignVertical: 'center',
    minHeight: 24,
  },
  eyeButton: {
    padding: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#94a3b8',
    resizeMode: 'contain',
  },

  // Label de input
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },

  // Botón principal de login
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 12 : 14,
    alignItems: 'center',
    marginTop: isSmallDevice ? 6 : 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#93c5fd',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Botón secundario (olvidé contraseña, registro)
  switchButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '500',
  },

  // Enlace de texto
  linkText: {
    color: '#1e40af',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Botón de enlace
  linkButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },

  // Separador
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },

  // Picker mejorado
  pickerWrapper: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    pointerEvents: 'auto',
  },
  picker: {
    height: 56,
    color: '#1e293b',
  },
  pickerItem: {
    fontSize: 16,
  },

  // Estilos para verificación de código
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emailText: {
    fontSize: 15,
    color: '#3b82f6',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  verificationLogo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    tintColor: '#3b82f6',
  },
  verificationInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    color: '#1e40af',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  instructionText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '400',
    lineHeight: 20,
  },

  // Footer informativo
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Estilos legacy para compatibilidad
  backgroundImage: {
    flex: 1,
  },
  darkOverlay: {
    display: 'none',
  },
});
