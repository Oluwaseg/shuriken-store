import { ApiResponse, Cart } from '../types/type';
import axiosInstance from './axiosInstance';

// Get Cart by User ID
export const getCartByUserId = async (
  userId: string
): Promise<ApiResponse<Cart>> => {
  const { data } = await axiosInstance.get<ApiResponse<Cart>>(
    `/cart/${userId}`
  );
  return data;
};

// Add or Update Cart Item
export const createOrUpdateCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ApiResponse<Cart>> => {
  const { data } = await axiosInstance.post<ApiResponse<Cart>>('/cart', {
    userId,
    productId,
    quantity,
  });
  return data;
};

// Remove Item from Cart
export const removeItemFromCart = async (
  userId: string,
  productId: string
): Promise<ApiResponse<Cart>> => {
  const { data } = await axiosInstance.delete<ApiResponse<Cart>>('/cart/item', {
    data: { userId, productId },
  });
  return data;
};

// Clear Cart
export const clearCart = async (
  userId: string
): Promise<ApiResponse<{ message: string }>> => {
  const { data } = await axiosInstance.delete<ApiResponse<{ message: string }>>(
    `/cart/${userId}`
  );
  return data;
};

// Merge Cart API
export const mergeCart = async (
  guestCart: Cart['items'],
  userId: string
): Promise<ApiResponse<Cart>> => {
  const { data } = await axiosInstance.post<ApiResponse<Cart>>('/cart/merge', {
    guestCart,
    userId,
  });
  return data;
};
