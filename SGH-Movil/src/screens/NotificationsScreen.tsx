import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getActiveNotifications, markNotificationAsRead } from '../api/services/notificationService';
import { InAppNotification } from '../api/types/notifications';
import { styles } from '../styles/notificationsStyles';

export default function NotificationsScreen() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <View style={styles.notificationFooter}>
        <Text style={[styles.notificationType, getTypeStyle(item.notificationType)]}>
          {item.notificationType}
        </Text>
        <Text style={[styles.notificationPriority, getPriorityStyle(item.priority)]}>
          {item.priority}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'SCHEDULE': return styles.typeSchedule;
      case 'REMINDER': return styles.typeReminder;
      default: return styles.typeDefault;
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Notificaciones</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificationId.toString()}
        renderItem={renderNotification}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes notificaciones</Text>
          </View>
        }
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
}