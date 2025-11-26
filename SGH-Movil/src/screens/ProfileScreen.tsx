import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getProfileService, uploadProfileImageService } from '../api/services/authService';
import { UserProfile } from '../api/types/auth';
import { styles } from '../styles/profileStyles';
import CustomAlert from '../components/Genericos/CustomAlert';

export default function ProfileScreen() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados para alertas personalizadas
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

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
      setAlertTitle('Error');
      setAlertMessage('No se pudo cargar el perfil');
      setAlertType('error');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhoto = async () => {
    try {
      // Solicitar permisos para acceder a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        setAlertTitle('Permisos requeridos');
        setAlertMessage('Necesitamos acceso a tu galería para seleccionar una foto de perfil.');
        setAlertType('warning');
        setAlertVisible(true);
        return;
      }

      // Abrir selector de imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Imagen cuadrada
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        // Subir la imagen al backend PRIMERO
        setUploadingImage(true);
        try {
          if (token) {
            await uploadProfileImageService(token, imageUri);

            // Solo si la subida es exitosa, recargar el perfil para obtener la nueva imagen del servidor
            await loadProfile();

            setAlertTitle('¡Foto actualizada!');
            setAlertMessage('Tu foto de perfil se ha actualizado correctamente.');
            setAlertType('success');
            setAlertVisible(true);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          setAlertTitle('Error al subir imagen');
          setAlertMessage('No se pudo subir la imagen al servidor. Inténtalo de nuevo.');
          setAlertType('error');
          setAlertVisible(true);
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      setAlertTitle('Error');
      setAlertMessage('No se pudo seleccionar la imagen. Inténtalo de nuevo.');
      setAlertType('error');
      setAlertVisible(true);
    }
  };

  const handleLogout = () => {
    setAlertTitle('Cerrar Sesión');
    setAlertMessage('¿Estás seguro de que quieres cerrar sesión?');
    setAlertType('warning');
    setAlertVisible(true);
  };

  const confirmLogout = async () => {
    setAlertVisible(false);
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      setAlertTitle('Error');
      setAlertMessage('No se pudo cerrar la sesión correctamente.');
      setAlertType('error');
      setAlertVisible(true);
    }
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
          <TouchableOpacity
            style={[styles.editPhotoButton, uploadingImage && styles.editPhotoButtonDisabled]}
            onPress={handleEditPhoto}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.editPhotoText}>Editar</Text>
            )}
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
        </View>
      </View>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertType === 'warning' ? confirmLogout : undefined}
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        autoClose={alertType === 'success'}
        autoCloseDelay={2000}
      />
    </View>
  );
}