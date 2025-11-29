import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const styles = StyleSheet.create({
  // Tarjeta principal del horario
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },

  // Header con día y hora
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayContainer: {
    flex: 1,
  },
  day: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: -0.2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  time: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 6,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Contenido principal
  content: {
    marginBottom: 16,
  },
  subjectName: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 22,
  },
  teacherName: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
    fontWeight: '500',
  },
  courseName: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },

  // Footer con estado y acciones
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Badge para el día (estilo moderno)
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Información adicional para coordinadores
  coordinatorInfo: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    minWidth: 80,
  },
  infoValue: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '400',
    flex: 1,
  },

  // Efectos visuales
  cardGlow: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },

  // Estados de interacción
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.05,
    elevation: 2,
  },

  // Filas de información con iconos
  infoRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
});