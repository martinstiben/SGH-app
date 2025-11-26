export interface InAppNotification {
  notificationId: number;
  userId: number;
  userEmail: string;
  userName: string;
  userRole: string;
  notificationType: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
  priority: string;
  isRead: boolean;
  isArchived: boolean;
  category?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string;
  updatedAt?: string;
  priorityDisplayName?: string;
  priorityColor?: string;
  priorityIcon?: string;
  age?: string;
  isRecent?: boolean;
  isActive?: boolean;
  requiresImmediateAttention?: boolean;
}

export interface NotificationFilters {
  page?: number;
  size?: number;
  type?: string;
  priority?: string;
  category?: string;
  isRead?: boolean;
}

export interface NotificationResponse {
  content: InAppNotification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}