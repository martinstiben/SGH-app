import { API_URL } from '../constant/api';
import { InAppNotification, NotificationFilters, NotificationResponse } from '../types/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función helper para manejar errores 401 (token expirado)
const handleAuthError = async (status: number): Promise<boolean> => {
  if (status === 401) {
    console.log('Token expirado detectado en notificaciones, haciendo logout automático...');
    try {
      await AsyncStorage.removeItem('token');
      // Retornar true para indicar que se manejó el error 401
      return true;
    } catch (error) {
      console.error('Error limpiando token expirado:', error);
      return false;
    }
  }
  return false;
};

export async function getActiveNotifications(token: string, page: number = 0, size: number = 20): Promise<NotificationResponse> {
  try {
    const response = await fetch(`${API_URL}/api/in-app-notifications/active?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const wasAuthError = await handleAuthError(response.status);
      if (wasAuthError) {
        // Si fue un error de autenticación, retornar datos vacíos silenciosamente
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: size,
          number: page,
          first: true,
          last: true,
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching active notifications:', error);
    // Devolver respuesta vacía en caso de error
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: size,
      number: page,
      first: true,
      last: true,
    };
  }
}

export async function getUnreadNotifications(token: string): Promise<InAppNotification[]> {
  try {
    const response = await fetch(`${API_URL}/api/in-app-notifications/unread`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const wasAuthError = await handleAuthError(response.status);
      if (wasAuthError) {
        // Si fue un error de autenticación, retornar array vacío silenciosamente
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(token: string, notificationId: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/in-app-notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const wasAuthError = await handleAuthError(response.status);
      if (wasAuthError) {
        // Si fue un error de autenticación, no hacer nada (logout automático ya se hizo)
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function getNotificationsWithFilters(token: string, filters: NotificationFilters): Promise<NotificationResponse> {
  // Por ahora, devolver datos de ejemplo filtrados
  const mockNotifications: InAppNotification[] = [
    {
      notificationId: 1,
      userId: 1,
      userEmail: 'usuario@ejemplo.com',
      userName: 'Usuario Ejemplo',
      userRole: 'ESTUDIANTE',
      notificationType: filters.type || 'GENERAL_SYSTEM_NOTIFICATION',
      title: 'Notificación de ejemplo',
      message: 'Esta es una notificación de ejemplo para testing.',
      priority: filters.priority || 'MEDIUM',
      isRead: filters.isRead !== undefined ? filters.isRead : false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return {
    content: mockNotifications,
    totalElements: mockNotifications.length,
    totalPages: 1,
    size: filters.size || 20,
    number: filters.page || 0,
    first: true,
    last: true,
  };
}