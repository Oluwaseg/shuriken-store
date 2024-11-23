import { ApiResponse, CheckoutData, ShippingInfo } from '../types/type';
import axiosInstance from './axiosInstance';

// Initialize Checkout
export const initializeCheckout = async (
  userId: string,
  shippingInfo: ShippingInfo
): Promise<ApiResponse<CheckoutData>> => {
  const { data } = await axiosInstance.post<ApiResponse<CheckoutData>>(
    '/checkout',
    { userId, shippingInfo }
  );
  return data;
};
