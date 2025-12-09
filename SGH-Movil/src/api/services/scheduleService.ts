import { SCHEDULE_CRUD_END_POINTS } from '../constant/Endpoint';
import { ScheduleDTO } from '../types/schedules';

export async function getSchedulesByTeacher(token: string, teacherId: number): Promise<ScheduleDTO[]> {
  try {
    const response = await fetch(`${SCHEDULE_CRUD_END_POINTS}/by-teacher/${teacherId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Error al obtener horarios por profesor:", errorData || `HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener horarios por profesor:", error);
    return [];
  }
}

export async function getSchedulesByCourse(token: string, courseId: number): Promise<ScheduleDTO[]> {
  try {
    const response = await fetch(`${SCHEDULE_CRUD_END_POINTS}/by-course/${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Error al obtener horarios por curso:", errorData || `HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener horarios por curso:", error);
    return [];
  }
}

// Función para obtener todos los horarios (para coordinadores)
export async function getAllSchedules(token: string, page: number = 0, size: number = 50): Promise<{ content: ScheduleDTO[]; totalElements: number; totalPages: number }> {
  try {
    const response = await fetch(`${SCHEDULE_CRUD_END_POINTS}?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}`);
    }

    const data = await response.json();

    // Asegurarse de que los datos tienen la estructura esperada
    if (Array.isArray(data)) {
      // Si el backend devuelve directamente un array, lo adaptamos
      return {
        content: data,
        totalElements: data.length,
        totalPages: 1
      };
    } else if (data.content !== undefined) {
      // Si el backend devuelve la estructura paginada esperada
      return {
        content: data.content,
        totalElements: data.totalElements || data.content.length,
        totalPages: data.totalPages || 1
      };
    } else {
      // Estructura desconocida, intentar adaptar
      return {
        content: Object.values(data),
        totalElements: Object.values(data).length,
        totalPages: 1
      };
    }
  } catch (error) {
    console.error('Error al obtener todos los horarios:', error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
}

// Función para obtener horarios del usuario actual basado en su rol
export async function getUserSchedules(token: string, userProfile: { role: string; userId: number }): Promise<ScheduleDTO[]> {
  try {
    if (userProfile.role === 'MAESTRO') {
      // Para profesores, usar teacherId (asumiendo que es igual al userId por simplicidad)
      return await getSchedulesByTeacher(token, userProfile.userId);
    } else if (userProfile.role === 'ESTUDIANTE') {
      // Para estudiantes, necesitaríamos el courseId. Por ahora, devolver vacío o mock
      // TODO: Obtener courseId del perfil del estudiante
      console.warn("⚠️ Student schedules not implemented yet - need courseId from profile");
      return [];
    } else if (userProfile.role === 'COORDINADOR') {
      // Para coordinadores, obtener todos los horarios con paginación
      const result = await getAllSchedules(token, 0, 100);
      return result.content;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener horarios del usuario:', error);
    return [];
  }
}