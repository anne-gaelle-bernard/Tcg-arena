import { apiRequest } from './api';
import { setAuth, clearAuth, type AuthState } from '../app/store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthState> {
  const auth = await apiRequest<AuthState>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  setAuth(auth);
  return auth;
}

export async function logout(): Promise<void> {
  clearAuth();
}
