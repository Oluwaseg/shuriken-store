import axios from "axios";
import { Order, OrderResponse } from "../types/type";

// Fetch all orders
export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await axios.get("/api/admin/orders");
  return data.orders;
};

// Fetch a single order by ID
export const fetchOrderById = async (id: string): Promise<OrderResponse> => {
  const { data } = await axios.get(`/api/orders/${id}`);
  return data;
};

// Update the status of an order
export const updateOrderStatus = async (id: string, status: string) => {
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  await axios.put(`/api/admin/orders/${id}`, { status });
};

// Delete an order
export const deleteOrder = async (id: string) => {
  await axios.delete(`/api/admin/orders/${id}`);
};
