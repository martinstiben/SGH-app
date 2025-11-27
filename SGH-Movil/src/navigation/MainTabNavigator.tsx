import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getUnreadNotifications } from '../api/services/notificationService';

// Screens
import SchedulesScreen from '../screens/SchedulesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Styles
import { styles } from '../styles/tabNavigatorStyles';

export type MainTabParamList = {
  Schedules: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { token, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Configurar status bar con colores oscuros para fondo blanco
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setTranslucent(false);
  }, []);

  useEffect(() => {
    loadUnreadCount();
  }, [token]);

  // Optimizar carga de notificaciones - reducir frecuencia para mejor rendimiento
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        loadUnreadCount();
      }
    }, 60000); // Cada 60 segundos para mejor rendimiento

    return () => clearInterval(interval);
  }, [token]);

  const loadUnreadCount = async () => {
    if (!token) return;

    try {
      const unreadNotifications = await getUnreadNotifications(token);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error loading unread notifications count:', error);
      setUnreadCount(0);
    }
  };

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Si no hay token, no debería llegar aquí, pero por seguridad
  if (!token) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Text style={{ fontSize: 16, color: '#64748b' }}>Sesión expirada</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Schedules') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Notifications') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-circle-outline';
            }

            return (
              <Ionicons
                name={iconName}
                size={focused ? 24 : 20}
                color={focused ? '#3b82f6' : '#6b7280'}
              />
            );
          },
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            height: 65 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Schedules"
          component={SchedulesScreen}
          options={{
            tabBarLabel: 'Horarios',
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            tabBarLabel: 'Notificaciones',
            tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
            tabBarBadgeStyle: unreadCount > 0 ? {
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: '700',
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 2,
              borderColor: '#ffffff',
            } : undefined,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Perfil',
          }}
        />
      </Tab.Navigator>
    </View>
  );
}