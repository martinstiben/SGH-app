export const getAuthHeaders = (token: string): Record<string, string> => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getToken = (): string | null => {
  // Implementación básica para obtener el token
  // En una aplicación real, esto podría venir de AsyncStorage, contexto, etc.
  return localStorage.getItem('token') || null;
};