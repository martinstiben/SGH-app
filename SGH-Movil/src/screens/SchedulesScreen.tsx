import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { getProfileService } from '../api/services/authService';
import { getUserSchedules } from '../api/services/scheduleService';
import { UserProfile } from '../api/types/auth';
import { ScheduleDTO } from '../api/types/schedules';
import SearchBar from '../components/Schedules/SearchBar';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/schedulesStyles';

export default function SchedulesScreen() {
  const { token, loading: authLoading } = useAuth();
  const [userSchedules, setUserSchedules] = useState<ScheduleDTO[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [groupedByCourse, setGroupedByCourse] = useState<Record<string, ScheduleDTO[]>>({});

  // Cargar perfil y horarios del usuario
  useEffect(() => {
    if (authLoading || !token) return;
    loadUserData();
  }, [token, authLoading]);

  const loadUserData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Obtener perfil del usuario
      const currentProfile = await getProfileService(token);
      setUserProfile(currentProfile);

      // Obtener horarios del usuario
      const schedules = await getUserSchedules(token, currentProfile);
      setUserSchedules(schedules);

      // Agrupar horarios por curso
      processSchedulesByCourse(schedules);

      // Expandir solo los primeros 2 cursos inicialmente
      const initialExpanded = new Set<string>();
      const courseKeys = [...new Set(schedules.map(s => s.courseId.toString()))].slice(0, 2);
      courseKeys.forEach(key => initialExpanded.add(key));
      setExpandedCourses(initialExpanded);

    } catch (error) {
      console.error('Error loading user data:', error);
      setUserSchedules([]);
      setGroupedByCourse({});
    } finally {
      setLoading(false);
    }
  };

  const processSchedulesByCourse = (schedules: ScheduleDTO[]) => {
    const grouped: Record<string, ScheduleDTO[]> = {};
    const uniqueSchedules = new Set(); // Para evitar duplicados

    schedules.forEach(schedule => {
      // Crear un identificador único para cada horario
      const scheduleId = `${schedule.id}-${schedule.day}-${schedule.startTime}-${schedule.endTime}`;

      // Solo agregar si no está duplicado
      if (!uniqueSchedules.has(scheduleId)) {
        uniqueSchedules.add(scheduleId);
        const courseKey = schedule.courseId.toString();
        if (!grouped[courseKey]) {
          grouped[courseKey] = [];
        }
        grouped[courseKey].push(schedule);
      }
    });

    // Ordenar horarios dentro de cada curso por día y hora
    Object.keys(grouped).forEach(courseKey => {
      grouped[courseKey].sort((a, b) => {
        // Primero por día (orden correcto: Lunes a Domingo)
        const dayOrder = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
        const dayComparison = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayComparison !== 0) return dayComparison;

        // Luego por hora de inicio
        return a.startTime.localeCompare(b.startTime);
      });
    });

    setGroupedByCourse(grouped);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  // Filtrar horarios según el término de búsqueda
  const filteredSchedules = Object.keys(groupedByCourse).reduce((acc, courseKey) => {
    const filtered = groupedByCourse[courseKey].filter(schedule =>
      schedule.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule.courseName && schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filtered.length > 0) {
      acc[courseKey] = filtered;
    }

    return acc;
  }, {} as Record<string, ScheduleDTO[]>);

  // Función para obtener los horarios organizados por curso (limitado a 2 cursos)
  const getOrganizedSchedules = () => {
    const organized: { courseId: string; courseName: string; schedules: ScheduleDTO[] }[] = [];

    // Obtener solo los primeros 2 cursos
    const courseKeys = Object.keys(filteredSchedules).slice(0, 2);

    courseKeys.forEach(courseKey => {
      const courseName = userSchedules.find(s => s.courseId.toString() === courseKey)?.courseName || `Curso ${courseKey}`;
      organized.push({
        courseId: courseKey,
        courseName,
        schedules: filteredSchedules[courseKey]
      });
    });

    return organized.sort((a, b) => a.courseName.localeCompare(b.courseName));
  };

  // Función para togglear la expansión de un curso
  const toggleCourseExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  // Función para renderizar cada grupo de curso
  const renderCourseGroup = ({ item }: { item: { courseId: string; courseName: string; schedules: ScheduleDTO[] } }) => {
    const isExpanded = expandedCourses.has(item.courseId);

    // Asignar color por curso para consistencia visual
    const courseColors = [
      '#3b82f6', // Azul
      '#10b981', // Verde
      '#f59e0b', // Naranja
      '#ef4444', // Rojo
      '#8b5cf6', // Morado
      '#06b6d4', // Cian
    ];

    const colorIndex = parseInt(item.courseId) % courseColors.length;
    const courseColor = courseColors[colorIndex];

    return (
      <View style={styles.newCourseCard}>
        {/* Header del curso (clickable para expandir/colapsar) */}
        <TouchableOpacity
          style={styles.newCourseHeader}
          onPress={() => toggleCourseExpansion(item.courseId)}
          activeOpacity={0.8}
        >
          <View style={styles.newCourseHeaderContent}>
            <View style={[styles.newCourseBadge, { backgroundColor: courseColor }]}>
              <Text style={styles.newCourseBadgeText}>
                {item.courseName.split(' ').map(word => word[0]).join('').substring(0, 2)}
              </Text>
            </View>
            <View style={styles.newCourseInfo}>
              <Text style={styles.newCourseName}>{item.courseName}</Text>
              <Text style={styles.newCourseScheduleCount}>
                {item.schedules.length} horario{item.schedules.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View style={styles.newCourseChevron}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#64748b"
            />
          </View>
        </TouchableOpacity>
  
        {/* Contenido del curso (solo visible cuando está expandido) */}
        {isExpanded && (
          <View style={styles.newCourseContent}>
            {item.schedules.map((schedule) => (
              <View
                key={`${schedule.id}-${schedule.day}-${schedule.startTime}`}
                style={[styles.newScheduleItem, { borderLeftColor: courseColor }]}
              >
                <View style={styles.newScheduleHeader}>
                  <View style={[styles.newScheduleDayBadge, { backgroundColor: `${courseColor}20` }]}>
                    <Text style={[styles.newScheduleDayText, { color: courseColor }]}>
                      {schedule.day.substring(0, 3)}
                    </Text>
                  </View>
                  <Text style={styles.newScheduleTime}>
                    {schedule.startTime} - {schedule.endTime}
                  </Text>
                </View>
                <Text style={styles.newScheduleSubject}>{schedule.subjectName}</Text>
                <Text style={styles.newScheduleTeacher}>{schedule.teacherName}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.newLoadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Cargando horarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con título */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {userProfile?.role === 'COORDINADOR'
            ? 'Gestión de Horarios'
            : userProfile?.role === 'MAESTRO'
            ? 'Mis Horarios de Clase'
            : 'Mi Horario Académico'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {userProfile?.role === 'COORDINADOR'
            ? `Horarios organizados por cursos`
            : 'Mis horarios académicos'}
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Buscar horarios por materia, profesor o curso..."
        />
      </View>

      {/* Lista de horarios organizada por curso */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={getOrganizedSchedules()}
          keyExtractor={(item) => item.courseId}
          renderItem={renderCourseGroup}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                {userProfile?.role === 'COORDINADOR'
                  ? 'No hay horarios registrados'
                  : 'No tienes horarios asignados'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {userProfile?.role === 'COORDINADOR'
                  ? 'Los horarios aparecerán aquí cuando sean creados.'
                  : userProfile?.role === 'MAESTRO'
                  ? 'Cuando se te asignen clases, aparecerán aquí.'
                  : 'Cuando se genere tu horario académico, aparecerá aquí.'}
              </Text>
            </View>
          }
          contentContainerStyle={userSchedules.length === 0 ? styles.emptyContainer : { paddingHorizontal: 20, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
