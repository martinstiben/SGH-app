import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    // Configurar status bar azul para las tabs principales
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#3b82f6');
    StatusBar.setTranslucent(false);
  }, []);

  useEffect(() => {
    loadUnreadCount();
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

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 80 }} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
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

            // Animación suave al cambiar de tab
            Animated.spring(scaleAnim, {
              toValue: focused ? 1.1 : 1,
              useNativeDriver: true,
              tension: 300,
              friction: 3,
            }).start();

            return (
              <Animated.View style={[
                styles.tabItem,
                focused ? styles.activeTabItem : styles.inactiveTabItem,
                { transform: [{ scale: scaleAnim }] }
              ]}>
                <Ionicons
                  name={iconName}
                  size={focused ? 26 : 22}
                  color={focused ? '#2563eb' : '#9ca3af'}
                />
              </Animated.View>
            );
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarLabel: ({ focused, children }) => (
            <Text style={[
              styles.tabBarLabel,
              focused ? styles.activeLabel : styles.inactiveLabel
            ]}>
              {children}
            </Text>
          ),
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
    </SafeAreaView>
  );
}