import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, RefreshControl, Text, View } from 'react-native';
import { getProfileService } from '../api/services/authService';
import { getAllSchedules, getUserSchedules } from '../api/services/scheduleService';
import { UserProfile } from '../api/types/auth';
import { DAYS_ORDER, DAY_TRANSLATIONS } from '../api/types/days';
import { ScheduleDTO } from '../api/types/schedules';
import ScheduleItem from '../components/Schedules/ScheduleItem';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/schedulesStyles';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isLargeScreen = width >= 1024;

export default function SchedulesScreen() {
  const { token, loading: authLoading } = useAuth();
  const [userSchedules, setUserSchedules] = useState<ScheduleDTO[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [groupedSchedules, setGroupedSchedules] = useState<Record<string, ScheduleDTO[]>>({});
  const fadeAnim = new Animated.Value(0);

  // Cargar perfil y horarios del usuario
  useEffect(() => {
    if (authLoading || !token) return;
    loadUserData();
  }, [token, authLoading]);

  const loadUserData = async (page: number = 0, append: boolean = false) => {
    if (!token) return;

    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Obtener perfil del usuario (solo en la primera carga)
      let currentProfile = userProfile;
      if (!append) {
        currentProfile = await getProfileService(token);
        setUserProfile(currentProfile);
      }

      // Si aún no tenemos perfil, no podemos continuar
      if (!currentProfile) {
        setUserSchedules([]);
        setTotalSchedules(0);
        setHasMoreData(false);
        return;
      }

      let schedules: ScheduleDTO[] = [];
      let totalElements = 0;

      if (currentProfile.role === 'COORDINADOR') {
        // Para coordinadores, obtener todos los horarios con paginación optimizada
        // Usar menos elementos por página en dispositivos móviles para mejor rendimiento
        const pageSize = isLargeScreen ? 30 : isTablet ? 24 : 15;
        const result = await getAllSchedules(token, page, pageSize);
        if (result && result.content) {
          schedules = append ? [...userSchedules, ...result.content] : result.content;
          totalElements = result.totalElements || 0;
          setHasMoreData(result.content.length === pageSize && schedules.length < totalElements);
        } else {
          schedules = append ? userSchedules : [];
          totalElements = 0;
          setHasMoreData(false);
        }
      } else {
        // Para profesores y estudiantes, obtener sus horarios específicos
        schedules = await getUserSchedules(token, currentProfile);
        totalElements = schedules.length;
        setHasMoreData(false);
      }

      setUserSchedules(schedules);
      setTotalSchedules(totalElements);
      setCurrentPage(page);

      // Log de depuración para verificar los horarios recibidos
      console.log('Horarios recibidos:', schedules.length);
      console.log('Total de horarios:', totalElements);
      console.log('Perfil de usuario:', currentProfile?.role);

      // Agrupar horarios por día para vista organizada
      const grouped: Record<string, ScheduleDTO[]> = {};
      schedules.forEach(schedule => {
        // Traducir el día a español para consistencia
        const day = DAY_TRANSLATIONS[schedule.day] || schedule.day;
        if (!grouped[day]) {
          grouped[day] = [];
        }
        grouped[day].push(schedule);
      });

      // Ordenar horarios dentro de cada día por hora de inicio
      Object.keys(grouped).forEach(day => {
        grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });

      setGroupedSchedules(grouped);

      // Animación de entrada (solo en la primera carga)
      if (!append) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      // En caso de error, mostrar estado vacío
      setUserSchedules([]);
      setTotalSchedules(0);
      setHasMoreData(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(0);
    setHasMoreData(true);
    await loadUserData(0, false);
    setRefreshing(false);
  };

  // Función para obtener los horarios organizados por día
  const getOrganizedSchedules = () => {
    const sortedDays = Object.keys(groupedSchedules).sort(
      (a, b) => {
        const translatedA = DAY_TRANSLATIONS[a] || a;
        const translatedB = DAY_TRANSLATIONS[b] || b;
        return DAYS_ORDER.indexOf(translatedA) - DAYS_ORDER.indexOf(translatedB);
      }
    );

    const organized: { day: string; schedules: ScheduleDTO[] }[] = [];
    sortedDays.forEach(day => {
      organized.push({
        day,
        schedules: groupedSchedules[day]
      });
    });

    return organized;
  };

  // Función para renderizar cada grupo de día
  const renderDayGroup = ({ item }: { item: { day: string; schedules: ScheduleDTO[] } }) => {
    const { day, schedules } = item;
    const getDayInfo = (day: string) => {
      const dayData = {
        'LUNES': { color: '#3b82f6', short: 'Lun', full: 'Lunes' },
        'MARTES': { color: '#10b981', short: 'Mar', full: 'Martes' },
        'MIÉRCOLES': { color: '#f59e0b', short: 'Mié', full: 'Miércoles' },
        'JUEVES': { color: '#ef4444', short: 'Jue', full: 'Jueves' },
        'VIERNES': { color: '#8b5cf6', short: 'Vie', full: 'Viernes' },
        'SÁBADO': { color: '#06b6d4', short: 'Sáb', full: 'Sábado' },
        'DOMINGO': { color: '#ec4899', short: 'Dom', full: 'Domingo' },
      };
      return dayData[day as keyof typeof dayData] || { color: '#6b7280', short: day, full: day };
    };

    // Traducir el día si es necesario
    const translatedDay = DAY_TRANSLATIONS[day] || day;
    const dayInfo = getDayInfo(translatedDay);

    return (
      <View style={styles.dayGroup}>
        <View style={styles.dayHeader}>
          <View style={[styles.dayBadge, { backgroundColor: dayInfo.color }]}>
            <Text style={styles.dayBadgeText}>
              {dayInfo.short}
            </Text>
          </View>
          <Text style={styles.dayHeaderText}>{dayInfo.full}</Text>
          <Text style={styles.dayCountText}>{schedules.length} horario{schedules.length !== 1 ? 's' : ''}</Text>
        </View>

        <View style={styles.daySchedules}>
          {schedules.map((schedule) => (
            <ScheduleItem
              key={`${schedule.id}-${schedule.day}-${schedule.startTime}`}
              schedule={schedule}
              isCoordinatorView={userProfile?.role === 'COORDINADOR'}
              onPress={() => handleSchedulePress(schedule)}
            />
          ))}
        </View>
      </View>
    );
  };

  const loadMoreData = async () => {
    if (!loadingMore && hasMoreData && userProfile?.role === 'COORDINADOR') {
      const nextPage = currentPage + 1;
      await loadUserData(nextPage, true);
    }
  };

  const handleSchedulePress = (schedule: ScheduleDTO) => {
    // Aquí se puede implementar navegación a detalles del horario
    console.log('Schedule pressed:', schedule);
  };

  const getNumColumns = () => {
    if (userProfile?.role !== 'COORDINADOR') return 1;
    if (isLargeScreen) return 3;
    if (isTablet) return 2;
    return 2; // Móviles también usan 2 columnas para mejor uso del espacio
  };

  const renderScheduleItem = ({ item, index }: { item: ScheduleDTO; index: number }) => {
    const isCoordinatorView = userProfile?.role === 'COORDINADOR';
    const numColumns = getNumColumns();

    return (
      <Animated.View
        style={[
          isCoordinatorView ? styles.gridItem : styles.scheduleItem,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30 * (Math.floor(index / numColumns) + 1), 0],
              }),
            }],
          },
        ]}
      >
        <ScheduleItem
          schedule={item}
          isCoordinatorView={isCoordinatorView}
          onPress={() => handleSchedulePress(item)}
        />
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Cargando tus horarios...</Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text style={styles.loadingMoreText}>Cargando más horarios...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleNew}>
          {userProfile?.role === 'COORDINADOR'
            ? 'Gestión de Horarios'
            : userProfile?.role === 'MAESTRO'
            ? 'Mis Horarios de Clase'
            : 'Mi Horario Académico'
          }
        </Text>
        <Text style={styles.headerSubtitle}>
          {userProfile?.role === 'COORDINADOR'
            ? `${totalSchedules} horarios gestionados`
            : 'Mantén tu horario académico al día'
          }
        </Text>
      </View>

      {/* Estadísticas para coordinadores */}
      {userProfile?.role === 'COORDINADOR' && totalSchedules > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalSchedules}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {userSchedules.filter(s => s.day === 'LUNES' || s.day === 'Monday').length}
            </Text>
            <Text style={styles.statLabel}>Lunes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {userSchedules.filter(s => s.day === 'MARTES' || s.day === 'Tuesday').length}
            </Text>
            <Text style={styles.statLabel}>Martes</Text>
          </View>
        </View>
      )}

      {/* Lista de horarios organizada por día */}
      <View style={styles.content}>
        <FlatList
          data={getOrganizedSchedules()}
          keyExtractor={(item) => item.day}
          renderItem={renderDayGroup}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                {userProfile?.role === 'COORDINADOR'
                  ? 'No hay horarios registrados'
                  : 'No tienes horarios asignados'
                }
              </Text>
              <Text style={styles.emptySubtitle}>
                {userProfile?.role === 'COORDINADOR'
                  ? 'Los horarios aparecerán aquí cuando sean creados.'
                  : userProfile?.role === 'MAESTRO'
                  ? 'Cuando se te asignen clases, aparecerán aquí.'
                  : 'Cuando se genere tu horario académico, aparecerá aquí.'
                }
              </Text>
            </View>
          }
          contentContainerStyle={userSchedules.length === 0 ? styles.emptyList : undefined}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
