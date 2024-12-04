import axiosInstance from './axiosInstance';

export const initializePayment = async (userId: string, email: string) => {
  const response = await axiosInstance.post('/payment/initialize', {
    userId,
    email,
  });
  return response.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await axiosInstance.get(`/payment/verify/${reference}`);
  return response.data;
};
