import apiClient from '../../services/apiClient';
import { UpdatePasswordValues, UpdateProfileValues } from './types';

export const getUserDetails = async () => {
  const response = await apiClient.get('/user/me');
  return response.data.user;
};

export const updateUserProfile = async (data: UpdateProfileValues) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }
  const response = await apiClient.put('/user/update/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.user;
};

export const updateUserPassword = async (data: UpdatePasswordValues) => {
  const response = await apiClient.put('/user/password/update', data);
  return response.data;
};
