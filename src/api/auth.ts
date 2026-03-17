import { apiClient } from './client';
import type { Token, UserResponse } from '../types';

export const register = (email: string, password: string, nickname?: string) =>
  apiClient.post<UserResponse>('/register', { email, password, nickname });

// /login은 OAuth2 form-data 방식
export const login = (email: string, password: string) => {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  return apiClient.post<Token>('/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const getMe = () => apiClient.get<UserResponse>('/users/me');
