import axios from "axios";
import { Cart, ApiResponse } from "../types/type";

// Get Cart by User ID
export const getCartByUserId = async (
  userId: string
): Promise<ApiResponse<Cart>> => {
  const { data } = await axios.get<ApiResponse<Cart>>(`/api/cart/${userId}`);
  return data;
};

// Add or Update Cart Item
export const createOrUpdateCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ApiResponse<Cart>> => {
  const { data } = await axios.post<ApiResponse<Cart>>("/api/cart", {
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
  const { data } = await axios.delete<ApiResponse<Cart>>("/api/cart/item", {
    data: { userId, productId },
  });
  return data;
};

// Clear Cart
export const clearCart = async (
  userId: string
): Promise<ApiResponse<{ message: string }>> => {
  const { data } = await axios.delete<ApiResponse<{ message: string }>>(
    `/api/cart/${userId}`
  );
  return data;
};
