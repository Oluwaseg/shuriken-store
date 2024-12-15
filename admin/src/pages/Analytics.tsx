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
      <div className='container mx-auto px-6 py-8 bg-body-light dark:bg-body-dark'>
        {/* Page Header */}
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-text-primary-light dark:text-text-primary-dark text-3xl font-medium'>
            Analytics Dashboard
          </h3>
          <div className='flex gap-2'>
            <select className='px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-sm bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark'>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          <div className='bg-body-light dark:bg-dark-light p-6 rounded-xl shadow-lg'>
            <UsersChart />
          </div>
          <div className='bg-body-light dark:bg-dark-light p-6 rounded-xl shadow-lg'>
            <ProductCategoriesChart />
          </div>
          <div className='bg-body-light dark:bg-dark-light p-6 rounded-xl shadow-lg'>
            <OrdersChart />
          </div>
          <div className='bg-body-light dark:bg-dark-light p-6 rounded-xl shadow-lg'>
            <RevenueChart />
          </div>
        </div>

        <button className='mt-4 flex items-center bg-button-primary-light dark:bg-button-primary-dark text-body-light dark:text-body-dark px-4 py-2 rounded-lg hover:bg-button-hover-light dark:hover:bg-button-hover-dark shadow-md'>
          Export Report
        </button>
      </div>
    </>
  );
};

export default Analytics;
