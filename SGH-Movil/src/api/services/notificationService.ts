import { API_URL } from '../constant/api';
import { InAppNotification, NotificationFilters, NotificationResponse } from '../types/notifications';

export async function getActiveNotifications(token: string, page: number = 0, size: number = 20): Promise<NotificationResponse> {
  // Por ahora, devolver datos de ejemplo ya que el backend no tiene este endpoint
  const mockNotifications: InAppNotification[] = [
    {
      notificationId: 1,
      userId: 1,
      userEmail: 'usuario@ejemplo.com',
      userName: 'Usuario Ejemplo',
      userRole: 'ESTUDIANTE',
      notificationType: 'GENERAL_SYSTEM_NOTIFICATION',
      title: '¡Bienvenido al Sistema!',
      message: 'Tu cuenta ha sido activada correctamente. Ya puedes acceder a todas las funcionalidades.',
      priority: 'MEDIUM',
      isRead: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return {
    content: mockNotifications,
    totalElements: mockNotifications.length,
    totalPages: 1,
    size: size,
    number: page,
    first: true,
    last: true,
  };
}

export async function getUnreadNotifications(token: string): Promise<InAppNotification[]> {
  // Por ahora, devolver datos de ejemplo
  return [];
}

export async function markNotificationAsRead(token: string, notificationId: number): Promise<void> {
  // Simular éxito por ahora
  return Promise.resolve();
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