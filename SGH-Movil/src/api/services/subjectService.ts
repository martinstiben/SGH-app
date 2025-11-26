import { API_URL } from '../constant/api';

export interface SubjectDTO {
  subjectId: number;
  subjectName: string;
}

export async function getAllSubjects(): Promise<SubjectDTO[]> {
  try {
    const response = await fetch(`${API_URL}/subjects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn("⚠️ Failed to fetch subjects, using mock data");
      // Return mock data if API fails
      return [
        { subjectId: 1, subjectName: 'Matemáticas' },
        { subjectId: 2, subjectName: 'Física' },
        { subjectId: 3, subjectName: 'Química' },
        { subjectId: 4, subjectName: 'Programación' },
        { subjectId: 5, subjectName: 'Estadística' },
      ];
    }

    const data = await response.json();
    return data as SubjectDTO[];
  } catch (error) {
    console.warn("⚠️ Error fetching subjects, using mock data:", error);
    // Return mock data if network fails
    return [
      { subjectId: 1, subjectName: 'Matemáticas' },
      { subjectId: 2, subjectName: 'Física' },
      { subjectId: 3, subjectName: 'Química' },
      { subjectId: 4, subjectName: 'Programación' },
      { subjectId: 5, subjectName: 'Estadística' },
    ];
  }
}