import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Contenedor centrado para loading
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },

  // Texto de carga
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },

  // Header mejorado
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  headerTitle: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '400',
  },

  // Contenedor de búsqueda
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#ffffff',
  },

  // Contenido principal
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Estilos para organización por día
  dayGroup: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
  },

  dayHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'capitalize',
    flex: 1,
    textAlign: 'center',
  },

  dayCountText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  daySchedules: {
    flexDirection: 'column',
    gap: 8,
  },

  // Estilos para el badge de día
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  dayBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
  },

  // Estados vacíos
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});