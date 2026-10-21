import { api } from './axios';
import type { LoginRequest, LoginResponse } from '@repo/types';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};
