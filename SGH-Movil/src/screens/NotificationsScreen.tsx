import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/notificationsStyles';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsScreen() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      // TODO: Implementar llamada a API de notificaciones InApp cuando esté disponible
      // const data = await getInAppNotifications(token);
      // setNotifications(data);

      // Datos de ejemplo por ahora - simulando notificaciones del backend
      const mockNotifications: Notification[] = [
        {
          id: 1,
          title: 'Nuevo horario asignado',
          message: 'Se te ha asignado un nuevo horario para Matemáticas III el lunes de 8:00 a 10:00',
          type: 'SCHEDULE',
          priority: 'HIGH',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Recordatorio de clase',
          message: 'Tu clase de Física II comienza en 30 minutos en el aula A-101',
          type: 'REMINDER',
          priority: 'MEDIUM',
          isRead: false,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 3,
          title: 'Cambio de horario',
          message: 'El horario de Programación I ha sido modificado. Nueva hora: 14:00 - 16:00',
          type: 'SCHEDULE',
          priority: 'HIGH',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 4,
          title: 'Bienvenido al sistema',
          message: 'Tu cuenta ha sido activada exitosamente. Ya puedes acceder a tus horarios.',
          type: 'SYSTEM',
          priority: 'LOW',
          isRead: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    // TODO: Llamar API para marcar como leída
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <View style={styles.notificationFooter}>
        <Text style={[styles.notificationType, getTypeStyle(item.type)]}>
          {item.type}
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
        keyExtractor={(item) => item.id.toString()}
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