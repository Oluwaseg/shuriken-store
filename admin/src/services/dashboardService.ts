import { Order, User } from '../components/tables/types/type';
import apiClient from './apiClient';

export const fetchTotalCustomers = async (): Promise<number> => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching total customers:', error);
    throw error;
  }
};

export const fetchOrderMetrics = async (): Promise<{
  totalOrders: number;
  totalIncome: number;
}> => {
  try {
    const response = await apiClient.get('/admin/orders');
    return {
      totalOrders: response.data.orderCount,
      totalIncome: response.data.totalAmount,
    };
  } catch (error) {
    console.error('Error fetching order metrics:', error);
    throw error;
  }
};

export const fetchTotalProducts = async (): Promise<number> => {
  try {
    const response = await apiClient.get('/admin/products/count');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching total products:', error);
    throw error;
  }
};

export const fetchUserData = async (): Promise<{
  labels: string[];
  values: number[];
}> => {
  try {
    const response = await apiClient.get(`/admin/users`);
    const users: User[] = response.data.users;

    const labels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const values = new Array(12).fill(0);

    users.forEach((user) => {
      const month = new Date(user.createdAt).getMonth();
      values[month]++;
    });

    return { labels, values };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const fetchCategoriesWithProductCount = async () => {
  try {
    const response = await fetch('/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error fetching categories with product count:', error);
    throw error;
  }
};

export const fetchOrdersData = async (): Promise<{
  labels: string[];
  values: number[];
}> => {
  try {
    const response = await apiClient.get(`/admin/orders`);
    const orders: Order[] = response.data.orders;

    const labels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const values = new Array(12).fill(0);

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      values[month]++;
    });

    return { labels, values };
  } catch (error) {
    console.error('Error fetching orders data:', error);
    throw error;
  }
};

export const fetchRevenueData = async (): Promise<{
  labels: string[];
  values: number[];
}> => {
  try {
    const response = await apiClient.get(`/admin/orders`);
    const orders: Order[] = response.data.orders;

    const labels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const values = new Array(12).fill(0);

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      values[month] += order.totalPrice;
    });

    return { labels, values };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};
