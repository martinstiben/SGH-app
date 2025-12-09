import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { getProfileService } from '../api/services/authService';
import { getUserSchedules } from '../api/services/scheduleService';
import { UserProfile } from '../api/types/auth';
import { ScheduleDTO } from '../api/types/schedules';
import Pagination from '../components/Schedules/Pagination';
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
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 3;

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

      // Inicialmente no expandir ningún curso
      setExpandedCourses(new Set());

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

  // Filtrado mejorado por cualquier término de búsqueda
  const filteredSchedules = React.useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return groupedByCourse;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const result: Record<string, ScheduleDTO[]> = {};

    Object.keys(groupedByCourse).forEach(courseKey => {
      const courseSchedules = groupedByCourse[courseKey];

      if (courseSchedules.length === 0) return;

      // Obtener información del curso - manejar el caso cuando courseName es undefined
      const courseName = courseSchedules[0]?.courseName || `Curso ${courseKey}`;
      const normalizedCourseName = courseName.toLowerCase();
      const courseId = courseKey.toLowerCase();

      // Buscar coincidencias en el nombre del curso (normalizado)
      const nameMatches = normalizedCourseName.includes(normalizedSearchTerm);

      // Buscar coincidencias en el ID del curso (para búsquedas numéricas)
      const idMatches = courseId.includes(normalizedSearchTerm);

      // Buscar coincidencias sin espacios (para "Curso1" cuando se busca "curso 1")
      const noSpacesCourseName = normalizedCourseName.replace(/\s+/g, '');
      const noSpacesSearchTerm = normalizedSearchTerm.replace(/\s+/g, '');
      const noSpacesMatches = noSpacesCourseName.includes(noSpacesSearchTerm);

      // Buscar coincidencias con espacios (para "Curso 1" cuando se busca "Curso1")
      const withSpacesCourseName = normalizedCourseName.replace(/(\d+)/g, ' $1').replace(/\s+/g, ' ').trim();
      const withSpacesMatches = withSpacesCourseName.includes(normalizedSearchTerm);

      // Si hay alguna coincidencia, incluir el curso en los resultados
      if (nameMatches || idMatches || noSpacesMatches || withSpacesMatches) {
        result[courseKey] = courseSchedules;
      }
    });

    return result;
  }, [groupedByCourse, searchTerm]);

  // Función para obtener los horarios organizados por curso con paginación
  const getOrganizedSchedules = () => {
    const organized: { courseId: string; courseName: string; schedules: ScheduleDTO[] }[] = [];

    // Obtener todos los cursos
    const courseKeys = Object.keys(filteredSchedules);

    courseKeys.forEach(courseKey => {
      const courseName = userSchedules.find(s => s.courseId.toString() === courseKey)?.courseName || `Curso ${courseKey}`;
      organized.push({
        courseId: courseKey,
        courseName,
        schedules: filteredSchedules[courseKey]
      });
    });

    // Ordenar primero por nombre de curso
    const sortedCourses = organized.sort((a, b) => a.courseName.localeCompare(b.courseName));

    // Aplicar paginación
    const startIndex = currentPage * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const paginatedCourses = sortedCourses.slice(startIndex, endIndex);

    return paginatedCourses;
  };

  // Función para cambiar de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(Object.keys(filteredSchedules).length / coursesPerPage);

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
                  <Text style={[styles.newScheduleDayText, { color: courseColor }]}>
                    {schedule.day} - {schedule.startTime} a {schedule.endTime}
                  </Text>
                </View>
                <Text style={styles.newScheduleSubject}>Materia: {schedule.subjectName}</Text>
                <Text style={styles.newScheduleTeacher}>Profesor: {schedule.teacherName}</Text>
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
      {/* Header con título y mensaje dinámico */}
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
        {searchTerm && (
          <Text style={[styles.headerSubtitle, { color: '#3b82f6', marginTop: 4, fontWeight: '500' }]}>
            Mostrando resultados para: "{searchTerm}"
          </Text>
        )}
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Filtrar por cursos..."
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
          ListFooterComponent={
            totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            ) : null
          }
        />
      </View>
    </View>
  );
}
