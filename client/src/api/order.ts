import { ApiResponse, Order } from '../types/type';
import axiosInstance from './axiosInstance';

// Get Single Order by ID
export const getSingleOrder = async (
  orderId: string
): Promise<ApiResponse<Order>> => {
  const { data } = await axiosInstance.get<ApiResponse<Order>>(
    `/orders/${orderId}`
  );
  return data;
};

// Get Orders for Logged-in User
export const getMyOrders = async (): Promise<ApiResponse<Order[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<Order[]>>(`/orders/me`);
  return data;
};
