import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getProfileService } from '../api/services/authService';
import { styles } from '../styles/profileStyles';

interface UserProfile {
  userId: number;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}

export default function ProfileScreen() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [token]);

  const loadProfile = async () => {
    if (!token) return;

    try {
      setLoading(true);
      // Llamar a la API de perfil
      const profileData = await getProfileService(token);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhoto = () => {
    // TODO: Implementar selección de imagen
    Alert.alert('Editar Foto', 'Funcionalidad de edición de foto próximamente');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Perfil</Text>

      <View style={styles.profileCard}>
        {/* Foto de perfil */}
        <View style={styles.photoContainer}>
          <Image
            source={
              profile.photoUrl
                ? { uri: profile.photoUrl }
                : require('../assets/images/user.png')
            }
            style={styles.profilePhoto}
          />
          <TouchableOpacity style={styles.editPhotoButton} onPress={handleEditPhoto}>
            <Text style={styles.editPhotoText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Información del usuario */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{profile.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rol:</Text>
            <Text style={styles.infoValue}>
              {profile.role === 'MAESTRO' ? 'Profesor' :
               profile.role === 'ESTUDIANTE' ? 'Estudiante' :
               profile.role}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID Usuario:</Text>
            <Text style={styles.infoValue}>{profile.userId}</Text>
          </View>
        </View>
      </View>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}