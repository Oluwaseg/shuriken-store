import { Helmet, HelmetProvider } from 'react-helmet-async';

import OrdersChart from '../components/charts/OrdersChart';
import ProductCategoriesChart from '../components/charts/ProductCategoriesChart';
import RevenueChart from '../components/charts/RevenueChart';
import UsersChart from '../components/charts/UsersChart';

const Analytics = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin Analytics</title>
          <meta name='description' content='Admin Dashboard' />
        </Helmet>
      </HelmetProvider>
      <div className='container mx-auto px-6 py-8'>
        {/* Page Header */}
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-gray-700 text-3xl font-medium dark:text-gray-200'>
            Analytics Dashboard
          </h3>
          <div className='flex gap-2'>
            <select className='px-4 py-2 border rounded-lg text-sm'>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
            <UsersChart />
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
            <ProductCategoriesChart />
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
            <OrdersChart />
          </div>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg'>
            <RevenueChart />
          </div>
        </div>

        <button className=' mt-4 flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow-md'>
          Export Report
        </button>
      </div>
    </>
  );
};

export default Analytics;
