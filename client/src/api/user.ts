import { User } from '../types/type';
import axiosInstance from './axiosInstance';

// Get user details
export const getUserDetails = async (): Promise<User> => {
  const response = await axiosInstance.get('/user/me');
  return response.data.user;
};

// Update user profile
export const updateProfile = async (formData: FormData): Promise<User> => {
  const response = await axiosInstance.put('/user/update/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.user;
};

// Update user password
export const updateUserPassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<string> => {
  const response = await axiosInstance.put(
    '/user/password/update',
    passwordData
  );
  return response.data.message;
};
