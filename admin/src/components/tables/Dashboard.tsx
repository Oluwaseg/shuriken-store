import React, { useEffect, useState } from 'react';
import {
  FaChartLine,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
} from 'react-icons/fa';
import {
  fetchOrderMetrics,
  fetchTotalCustomers,
  fetchTotalProducts,
} from '../../services/dashboardService';
import CryptoNews from '../templates/CryptoNews';
import E_NEWS from '../templates/E_NEWS';
import TopCryptoList from '../templates/TopCryptoList';

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
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container mx-auto px-6 py-8'>
      <h3 className='text-gray-700 dark:text-white text-3xl font-medium'>
        Dashboard
      </h3>

      <div className='mt-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Total Customers Card */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-indigo-600 bg-opacity-75'>
                <FaUsers className='h-6 w-6 text-white' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-gray-700 dark:text-white'>
                  {totalCustomers !== null ? totalCustomers : 'Loading...'}
                </h4>
                <div className='text-gray-500 dark:text-white'>
                  Total Customers
                </div>
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-orange-600 bg-opacity-75'>
                <FaShoppingCart className='h-6 w-6 text-white' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-gray-700 dark:text-white'>
                  {totalOrders !== null ? totalOrders : 'Loading...'}
                </h4>
                <div className='text-gray-500 dark:text-white'>
                  Total Orders
                </div>
              </div>
            </div>
          </div>

          {/* Total Products Card */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-pink-600 bg-opacity-75'>
                <FaChartLine className='h-6 w-6 text-white' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-gray-700 dark:text-white'>
                  {totalProducts !== null ? totalProducts : 'Loading...'}
                </h4>
                <div className='text-gray-500 dark:text-white'>
                  Total Products
                </div>
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-green-600 bg-opacity-75'>
                <FaMoneyBillWave className='h-6 w-6 text-white' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-gray-700 dark:text-white'>
                  {totalIncome !== null
                    ? `₦${totalIncome.toLocaleString()}`
                    : 'Loading...'}
                </h4>
                <div className='text-gray-500 dark:text-white'>
                  Total Revenue
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:col-span-1'>
          {/* Add your chart component here */}
          <div className='h-[300px]'>
            {' '}
            <TopCryptoList />
          </div>
        </div>
        <div className='lg:col-span-1'>
          <E_NEWS />
        </div>
        <div className='lg:col-span-1'>
          <CryptoNews />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
