import { api } from './axios';
import type { UserDto } from '@repo/types';

export const getUsers = async (): Promise<UserDto[]> => {
  const response = await api.get<UserDto[]>('/users');
  return response.data;
};

export const assignLayout = async (userId: number, layoutId: number): Promise<void> => {
  await api.put(`/users/${userId}/layout`, { layoutId });
};
