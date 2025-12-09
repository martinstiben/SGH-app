import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;
const isLargeScreen = width >= 1024;

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
  headerTitleNew: {
    fontSize: isSmallDevice ? 24 : 28,
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

  // Estadísticas para coordinadores
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Contenido principal
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Items de horario
  scheduleItem: {
    marginBottom: 16,
  },
  gridItem: {
    flex: isLargeScreen ? 0.32 : isTablet ? 0.48 : 0.49,
    marginHorizontal: isLargeScreen ? 6 : isTablet ? 4 : 2,
    marginVertical: 6,
    minWidth: isLargeScreen ? 180 : isTablet ? 160 : 140,
    maxWidth: isLargeScreen ? '32%' : isTablet ? '48%' : '49%',
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

  // Loading more indicator
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },

  // Filtros y búsqueda (para futuras mejoras)
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 6,
    fontWeight: '500',
  },

  // Estilos para organización por día
  dayGroup: {
    marginBottom: 24,
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
  },
  dayCountText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  daySchedules: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Estilos para el badge de día
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
  },

  // Estilos legacy para compatibilidad
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 20,
    textAlign: 'left',
  },

  // Estilos para el nuevo diseño minimalista
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  courseGroup: {
    marginBottom: 24,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    paddingLeft: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  // Estilos para SearchBar (movidos desde searchBarStyles.ts)
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },

  searchBarContainerFocused: {
    borderColor: '#3b82f6',
    backgroundColor: '#ffffff',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  searchBarIconContainer: {
    marginRight: 8,
    padding: 4,
  },

  searchBarInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    paddingVertical: 0,
    height: '100%',
  },

  searchBarClearButton: {
    marginLeft: 8,
    padding: 4,
  },
  // Estilos para ScheduleItemNew (movidos desde scheduleItemNewStyles.ts)
  scheduleItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  scheduleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  scheduleItemDayBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  scheduleItemDayBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  scheduleItemTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  scheduleItemTime: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  scheduleItemContent: {
    marginBottom: 12,
  },

  scheduleItemSubjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 20,
  },

  scheduleItemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  scheduleItemTeacherName: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 6,
    fontWeight: '500',
  },

  scheduleItemCourseName: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '400',
  },

  scheduleItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  scheduleItemStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleItemStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  scheduleItemStatusText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  scheduleItemId: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Estilos para el nuevo diseño de cursos expandibles
  newCourseCard: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  newCourseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  newCourseHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  newCourseBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  newCourseBadgeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  newCourseInfo: {
    flex: 1,
  },

  newCourseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },

  newCourseScheduleCount: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '400',
  },

  newCourseChevron: {
    padding: 8,
  },

  newCourseContent: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },

  newScheduleItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomWidth: 3,
    borderBottomColor: '#cbd5e1',
  },

  newScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  newScheduleDayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    minWidth: 80,
  },

  newScheduleDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'none',
    letterSpacing: 0,
    textAlign: 'left',
    marginBottom: 4,
  },

  newScheduleTime: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  newScheduleSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },

  newScheduleTeacher: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '400',
  },

  // Loading container para el nuevo diseño
  newLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});
