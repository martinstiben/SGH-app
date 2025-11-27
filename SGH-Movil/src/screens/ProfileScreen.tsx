import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getProfileService, uploadProfileImageService } from '../api/services/authService';
import { UserProfile } from '../api/types/auth';
import { styles } from '../styles/profileStyles';
import CustomAlert from '../components/Genericos/CustomAlert';
import { RootStackParamList } from '../navigation/AppNavigation';

const { width } = Dimensions.get('window');

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function ProfileScreen() {
  const { token, logout } = useAuth();
  const navigation = useNavigation<ProfileNavProp>();
  const insets = useSafeAreaInsets();
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
      // El logout fue exitoso - mostrar mensaje y redirigir
      setAlertTitle('Sesión cerrada');
      setAlertMessage('Has cerrado sesión exitosamente.');
      setAlertType('success');
      setAlertVisible(true);

      // Redirigir a la landing page después del logout
      setTimeout(() => {
        setAlertVisible(false);
        // Reset navigation stack and go to landing page
        navigation.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        });
      }, 1500);
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
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header elegante */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="person-circle-outline" size={32} color="#3b82f6" />
            <Text style={styles.headerTitle}>Mi Perfil</Text>
          </View>
          <Text style={styles.headerSubtitle}>Gestiona tu información personal</Text>
        </View>

        {/* Tarjeta principal del perfil */}
        <View style={styles.profileCard}>
          {/* Sección de foto de perfil */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              <Image
                source={
                  profile.photoUrl
                    ? { uri: profile.photoUrl }
                    : require('../assets/images/user.png')
                }
                style={styles.profilePhoto}
              />
              <View style={styles.photoOverlay}>
                <TouchableOpacity
                  style={[styles.editPhotoButton, uploadingImage && styles.editPhotoButtonDisabled]}
                  onPress={handleEditPhoto}
                  disabled={uploadingImage}
                  activeOpacity={0.8}
                >
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <Ionicons name="camera" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.photoLabel}>
              {uploadingImage ? 'Subiendo...' : 'Toca para cambiar'}
            </Text>
          </View>

          {/* Información del usuario */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="person-outline" size={20} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nombre completo</Text>
                  <Text style={styles.infoValue}>{profile.name}</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="mail-outline" size={20} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Correo electrónico</Text>
                  <Text style={styles.infoValue}>{profile.email}</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="school-outline" size={20} color="#3b82f6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Tipo de usuario</Text>
                  <Text style={styles.infoValue}>
                    {profile.role === 'MAESTRO' ? 'Profesor' :
                     profile.role === 'ESTUDIANTE' ? 'Estudiante' :
                     profile.role}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Espacio para el botón de logout */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón de cerrar sesión - fixed al bottom */}
      <View style={[styles.logoutContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#6b7280" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

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
    </SafeAreaView>
  );
}