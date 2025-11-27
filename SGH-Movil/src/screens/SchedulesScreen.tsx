import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Animated, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserSchedules, getAllSchedules } from '../api/services/scheduleService';
import { getProfileService } from '../api/services/authService';
import { UserProfile } from '../api/types/auth';
import { ScheduleDTO } from '../api/types/schedules';
import ScheduleItem from '../components/Schedules/ScheduleItem';
import { styles } from '../styles/schedulesStyles';

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
        // Para coordinadores, obtener todos los horarios con paginación
        const result = await getAllSchedules(token, page, 20);
        if (result && result.content) {
          schedules = append ? [...userSchedules, ...result.content] : result.content;
          totalElements = result.totalElements || 0;
          setHasMoreData(result.content.length === 20 && schedules.length < totalElements);
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

  const renderScheduleItem = ({ item, index }: { item: ScheduleDTO; index: number }) => {
    const isCoordinatorView = userProfile?.role === 'COORDINADOR';

    return (
      <Animated.View
        style={[
          isCoordinatorView ? styles.gridItem : styles.scheduleItem,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * (index + 1), 0],
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
              {userSchedules.filter(s => s.day === 'MONDAY' || s.day === 'LUNES').length}
            </Text>
            <Text style={styles.statLabel}>Lunes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {userSchedules.filter(s => s.day === 'TUESDAY' || s.day === 'MARTES').length}
            </Text>
            <Text style={styles.statLabel}>Martes</Text>
          </View>
        </View>
      )}

      {/* Lista de horarios */}
      <View style={styles.content}>
        <FlatList
          data={userSchedules}
          keyExtractor={(item) => `${item.id}-${item.day}-${item.startTime}`}
          renderItem={renderScheduleItem}
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
          numColumns={userProfile?.role === 'COORDINADOR' ? 2 : 1}
          columnWrapperStyle={userProfile?.role === 'COORDINADOR' ? { justifyContent: 'space-between' } : undefined}
        />
      </View>
    </View>
  );
}
