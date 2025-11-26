import { API_URL } from '../constant/api';
import { ScheduleDTO } from '../types/schedules';

export async function getSchedulesByTeacher(token: string, teacherId: number): Promise<ScheduleDTO[]> {
  const response = await fetch(`${API_URL}/schedules-crud/by-teacher/${teacherId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as ScheduleDTO[] | { error?: string };

  if (!response.ok) {
    console.warn("⚠️ Failed to fetch teacher schedules, returning empty array");
    return [];
  }

  return data as ScheduleDTO[];
}

export async function getSchedulesByCourse(token: string, courseId: number): Promise<ScheduleDTO[]> {
  const response = await fetch(`${API_URL}/schedules-crud/by-course/${courseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as ScheduleDTO[] | { error?: string };

  if (!response.ok) {
    console.warn("⚠️ Failed to fetch course schedules, returning empty array");
    return [];
  }

  return data as ScheduleDTO[];
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
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching user schedules:', error);
    return [];
  }
}