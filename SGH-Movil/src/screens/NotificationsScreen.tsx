import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getActiveNotifications, markNotificationAsRead } from '../api/services/notificationService';
import { InAppNotification } from '../api/types/notifications';
import { styles } from '../styles/notificationsStyles';

export default function NotificationsScreen() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estadísticas de notificaciones
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  // Cargar notificaciones del usuario
  useEffect(() => {
    loadNotifications();
  }, [token]);

  const loadNotifications = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getActiveNotifications(token);
      setNotifications(response.content);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // En caso de error, mostrar lista vacía
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: number) => {
    try {
      // Marcar como leída localmente primero
      setNotifications(prev =>
        prev.map(notif =>
          notif.notificationId === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      // Llamar API para marcar como leída en el backend
      await markNotificationAsRead(token!, notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revertir el cambio local en caso de error
      setNotifications(prev =>
        prev.map(notif =>
          notif.notificationId === notificationId ? { ...notif, isRead: false } : notif
        )
      );
    }
  };

  const renderNotification = ({ item }: { item: InAppNotification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => markAsRead(item.notificationId)}
      activeOpacity={0.7}
    >
      {!item.isRead && <View style={styles.unreadIndicator} />}

      <View style={styles.notificationHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.notificationTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>
            {new Date(item.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>

      <Text style={styles.notificationMessage} numberOfLines={3}>
        {item.message}
      </Text>

      <View style={styles.notificationFooter}>
        <View style={styles.tagsContainer}>
          <Text style={[styles.notificationType, getTypeStyle(item.notificationType)]}>
            {getTypeLabel(item.notificationType)}
          </Text>
          <Text style={[styles.notificationPriority, getPriorityStyle(item.priority)]}>
            {getPriorityLabel(item.priority)}
          </Text>
        </View>
        {!item.isRead && (
          <Text style={{ fontSize: 12, color: '#3b82f6', fontWeight: '600' }}>
            Nuevo
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'SCHEDULE': return styles.typeSchedule;
      case 'REMINDER': return styles.typeReminder;
      case 'GENERAL_SYSTEM_NOTIFICATION': return styles.typeSystem;
      default: return styles.typeDefault;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SCHEDULE': return 'HORARIO';
      case 'REMINDER': return 'RECORDATORIO';
      case 'GENERAL_SYSTEM_NOTIFICATION': return 'SISTEMA';
      default: return type;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH': return styles.priorityHigh;
      case 'MEDIUM': return styles.priorityMedium;
      case 'LOW': return styles.priorityLow;
      default: return styles.priorityDefault;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'ALTA';
      case 'MEDIUM': return 'MEDIA';
      case 'LOW': return 'BAJA';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Text style={styles.headerSubtitle}>
          Mantente al día con tus actividades académicas
        </Text>
      </View>

      {/* Estadísticas */}
      {totalCount > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Sin leer</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCount - unreadCount}</Text>
            <Text style={styles.statLabel}>Leídas</Text>
          </View>
        </View>
      )}

      {/* Lista de notificaciones */}
      <View style={styles.content}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.notificationId.toString()}
          renderItem={renderNotification}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>¡Todo al día!</Text>
              <Text style={styles.emptyText}>
                No tienes notificaciones pendientes.{'\n'}
                Cuando tengas nuevas actividades,{'\n'}
                aparecerán aquí.
              </Text>
            </View>
          }
          contentContainerStyle={notifications.length === 0 ? styles.emptyList : undefined}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}