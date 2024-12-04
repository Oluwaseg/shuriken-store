import { Helmet, HelmetProvider } from 'react-helmet-async';
import OrderTable from '../components/tables/OrderTable';

const Order = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin -Orders</title>
          <meta name='description' content='Admin Order Page' />
        </Helmet>
      </HelmetProvider>
      <div className='container mx-auto px-6 py-8'>
        <h1 className='text-2xl font-semibold mb-4'>Orders</h1>
        <OrderTable />
      </div>
    </>
  );
};

export default Order;
