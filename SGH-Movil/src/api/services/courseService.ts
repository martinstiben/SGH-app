import { API_URL } from '../constant/api';

export interface CourseDTO {
  courseId: number;
  courseName: string;
}

export async function getAllCourses(): Promise<CourseDTO[]> {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn("⚠️ Failed to fetch courses, using mock data");
      // Return mock data if API fails
      return [
        { courseId: 1, courseName: 'Ingeniería de Sistemas' },
        { courseId: 2, courseName: 'Medicina' },
        { courseId: 3, courseName: 'Derecho' },
        { courseId: 4, courseName: 'Administración' },
        { courseId: 5, courseName: 'Psicología' },
      ];
    }

    const data = await response.json();
    return data as CourseDTO[];
  } catch (error) {
    console.warn("⚠️ Error fetching courses, using mock data:", error);
    // Return mock data if network fails
    return [
      { courseId: 1, courseName: 'Ingeniería de Sistemas' },
      { courseId: 2, courseName: 'Medicina' },
      { courseId: 3, courseName: 'Derecho' },
      { courseId: 4, courseName: 'Administración' },
      { courseId: 5, courseName: 'Psicología' },
    ];
  }
}