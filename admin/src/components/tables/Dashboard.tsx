import React, { useState, useEffect } from "react";
import { FaUsers, FaDollarSign, FaBox, FaTag } from "react-icons/fa";
import {
  fetchTotalCustomers,
  fetchOrderMetrics,
  fetchTotalProducts,
} from "../../services/dashboardService";
import UsersChart from "../charts/UsersChart";
import OrdersChart from "../charts/OrdersChart";
import RevenueChart from "../charts/RevenueChart";
import ProductCategoriesChart from "../charts/ProductCategoriesChart";

const Dashboard: React.FC = () => {
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customers, orderMetrics, products] = await Promise.all([
          fetchTotalCustomers(),
          fetchOrderMetrics(),
          fetchTotalProducts(),
        ]);

        setTotalCustomers(customers);
        setTotalIncome(orderMetrics.totalIncome);
        setTotalOrders(orderMetrics.totalOrders);
        setTotalProducts(products);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 h-full space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Customers Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Customers
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {totalCustomers !== null ? totalCustomers : "Loading..."}
            </p>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-green-500 text-white p-3 rounded-full mr-4">
            <FaDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Income
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {totalIncome !== null
                ? `$${totalIncome.toLocaleString()}`
                : "Loading..."}
            </p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-yellow-500 text-white p-3 rounded-full mr-4">
            <FaBox size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Orders
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {totalOrders !== null ? totalOrders : "Loading..."}
            </p>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-purple-500 text-white p-3 rounded-full mr-4">
            <FaTag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Products
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {totalProducts !== null ? totalProducts : "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UsersChart />
        <ProductCategoriesChart />
        <OrdersChart />
        <RevenueChart />
      </div>
    </div>
  );
};

export default Dashboard;
