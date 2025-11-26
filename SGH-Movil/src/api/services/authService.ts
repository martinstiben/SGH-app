import { API_URL } from '../constant/api';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, Role, VerifyCodeRequest, VerifyCodeResponse, PasswordResetRequest, PasswordResetRequestResponse, PasswordResetVerifyRequest, PasswordResetVerifyResponse, UserProfile } from '../types/auth';

export async function loginService(credentials: LoginRequest): Promise<{ requiresVerification: boolean; message?: string }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json() as { message: string } | { error: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Login failed');
  }

  // Backend returns { message: "Código de verificación enviado al correo electrónico" }
  return { requiresVerification: true, message: (data as { message: string }).message };
}

export async function verifyCodeService(request: VerifyCodeRequest): Promise<VerifyCodeResponse> {
  const response = await fetch(`${API_URL}/auth/verify-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as VerifyCodeResponse | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Code verification failed');
  }

  return data as VerifyCodeResponse;
}

export async function registerService(request: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as RegisterResponse | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Registration failed');
  }

  return data as RegisterResponse;
}

export async function getRolesService(): Promise<{ roles: Role[] }> {
  const response = await fetch(`${API_URL}/auth/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as { roles: Role[] } | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Failed to fetch roles');
  }

  return data as { roles: Role[] };
}

export async function requestPasswordResetService(request: PasswordResetRequest): Promise<PasswordResetRequestResponse> {
  const response = await fetch(`${API_URL}/auth/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as PasswordResetRequestResponse | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Failed to request password reset');
  }

  return data as PasswordResetRequestResponse;
}

export async function verifyPasswordResetService(request: PasswordResetVerifyRequest): Promise<PasswordResetVerifyResponse> {
  const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = (await response.json()) as PasswordResetVerifyResponse | { error?: string };

  if (!response.ok) {
    throw new Error((data as any).error || 'Failed to reset password');
  }

  return data as PasswordResetVerifyResponse;
}

export async function getProfileService(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch profile');
  }

  // Crear el perfil con la URL de la foto si existe
  const profile: UserProfile = {
    userId: data.userId,
    name: data.name,
    email: data.email,
    role: data.role,
    photoUrl: data.userId ? `${API_URL}/users/${data.userId}/photo` : undefined,
  };

  return profile;
}

export async function uploadProfileImageService(token: string, imageUri: string): Promise<{ message: string }> {
  const formData = new FormData();

  // Obtener el nombre del archivo de la URI
  const fileName = imageUri.split('/').pop() || 'profile-image.jpg';
  const fileType = 'image/jpeg'; // Asumimos JPEG, pero se puede detectar del archivo

  // Crear el blob para FormData
  const response = await fetch(imageUri);
  const blob = await response.blob();

  formData.append('photo', {
    uri: imageUri,
    name: fileName,
    type: fileType,
  } as any);

  const uploadResponse = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      // No incluir Content-Type, dejar que fetch lo determine automáticamente para FormData
    },
    body: formData,
  });

  const data = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(data.error || 'Failed to upload profile image');
  }

  return data as { message: string };
}
