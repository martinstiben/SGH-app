import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Animated, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserSchedules } from '../api/services/scheduleService';
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
  const fadeAnim = new Animated.Value(0);

  // Cargar perfil y horarios del usuario
  useEffect(() => {
    if (authLoading || !token) return;
    loadUserData();
  }, [token, authLoading]);

  const loadUserData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Obtener perfil del usuario
      const profile = await getProfileService(token);
      setUserProfile(profile);

      // Obtener horarios del usuario
      const schedules = await getUserSchedules(token, profile);
      setUserSchedules(schedules);

      // Animación de entrada
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const renderScheduleItem = ({ item, index }: { item: ScheduleDTO; index: number }) => (
    <Animated.View
      style={[
        styles.scheduleItem,
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
      <ScheduleItem schedule={item} />
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Cargando tus horarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        {userProfile?.role === 'MAESTRO' ? 'Mis Horarios de Clase' : 'Mi Horario Académico'}
      </Text>

      <FlatList
        data={userSchedules}
        keyExtractor={(item) => `${item.id}-${item.day}-${item.startTime}`}
        renderItem={renderScheduleItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No tienes horarios asignados</Text>
            <Text style={styles.emptySubtitle}>
              {userProfile?.role === 'MAESTRO'
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
  );
}
