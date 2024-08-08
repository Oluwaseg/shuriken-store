// src/api/orders.ts

import axios from "axios";
import { Order } from "../types/type";

// Fetch orders
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await axios.get("/api/admin/orders");
  return data.orders;
};

// Update order status
export const updateOrderStatus = async (id: string, status: string) => {
  await axios.put(`/api/admin/order/${id}`, { status });
};

// Delete order
export const deleteOrder = async (id: string) => {
  await axios.delete(`/api/admin/order/${id}`);
};
