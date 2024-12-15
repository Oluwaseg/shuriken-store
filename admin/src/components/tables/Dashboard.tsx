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
    <div className='container mx-auto px-6 py-8 bg-body-light dark:bg-body-dark'>
      <h3 className='text-text-primary-light dark:text-text-primary-dark text-3xl font-medium'>
        Dashboard
      </h3>

      <div className='mt-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Total Customers Card */}
          <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-accent-secondary-light dark:bg-accent-dark'>
                <FaUsers className='h-6 w-6 text-body-light dark:text-body-dark' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
                  {totalCustomers !== null ? totalCustomers : 'Loading...'}
                </h4>
                <div className='text-text-secondary-light dark:text-text-secondary-dark'>
                  Total Customers
                </div>
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-accent-light dark:bg-accent-secondary-dark'>
                <FaShoppingCart className='h-6 w-6 text-body-light dark:text-body-dark' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
                  {totalOrders !== null ? totalOrders : 'Loading...'}
                </h4>
                <div className='text-text-secondary-light dark:text-text-secondary-dark'>
                  Total Orders
                </div>
              </div>
            </div>
          </div>

          {/* Total Products Card */}
          <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-button-primary-light dark:bg-button-primary-dark'>
                <FaChartLine className='h-6 w-6 text-body-light dark:text-body-dark' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
                  {totalProducts !== null ? totalProducts : 'Loading...'}
                </h4>
                <div className='text-text-secondary-light dark:text-text-secondary-dark'>
                  Total Products
                </div>
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-accent-dark dark:bg-button-hover-dark'>
                <FaMoneyBillWave className='h-6 w-6 text-body-light dark:text-body-dark' />
              </div>
              <div className='mx-4'>
                <h4 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
                  {totalIncome !== null
                    ? `₦${totalIncome.toLocaleString()}`
                    : 'Loading...'}
                </h4>
                <div className='text-text-secondary-light dark:text-text-secondary-dark'>
                  Total Revenue
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4'>
        <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-sm p-4 lg:col-span-1'>
          <div className='h-[300px]'>
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
