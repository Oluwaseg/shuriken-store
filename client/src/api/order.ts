import axios from "axios";
import { Order, ApiResponse, ShippingInfo } from "../types/type";

// Create Order
export const createOrder = async (
  userId: string,
  shippingInfo: ShippingInfo
): Promise<ApiResponse<Order>> => {
  const { data } = await axios.post<ApiResponse<Order>>("/api/order", {
    userId,
    shippingInfo,
  });
  return data;
};

// Get Single Order by ID
export const getSingleOrder = async (
  orderId: string
): Promise<ApiResponse<Order>> => {
  const { data } = await axios.get<ApiResponse<Order>>(`/api/order/${orderId}`);
  return data;
};

// Get Orders for Logged-in User
export const getMyOrders = async (): Promise<ApiResponse<Order[]>> => {
  const { data } = await axios.get<ApiResponse<Order[]>>(
    `/api/order/my-orders`
  );
  return data;
};
