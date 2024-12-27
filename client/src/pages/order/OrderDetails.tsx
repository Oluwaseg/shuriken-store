import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  MessageCircle,
  Package,
  Printer,
  Truck,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { fetchSingleOrder } from '../../features/orders/orderSlice';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { singleOrder, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSingleOrder(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-body-light to-primary dark:from-body-dark dark:to-dark-secondary'>
        <div className='w-16 h-16 border-4 border-accent-light dark:border-accent-dark border-solid rounded-full animate-spin border-t-transparent'></div>
        <p className='mt-4 text-text-secondary-light dark:text-text-secondary-dark text-lg font-medium'>
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-body-light to-primary dark:from-body-dark dark:to-dark-secondary'>
        <div className='bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-6 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold mb-2'>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-body-light to-primary dark:from-body-dark dark:to-dark-secondary'>
        <div className='bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 p-6 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold mb-2'>No Order Found</h2>
          <p>The requested order could not be found.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const order = singleOrder;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Package className='w-6 h-6 text-yellow-500' />;
      case 'Processing':
        return <Package className='w-6 h-6 text-blue-500' />;
      case 'Shipped':
        return <Truck className='w-6 h-6 text-purple-500' />;
      case 'Delivered':
        return <CheckCircle className='w-6 h-6 text-green-500' />;
      case 'Cancelled':
        return <XCircle className='w-6 h-6 text-red-500' />;
      default:
        return <Package className='w-6 h-6 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-500',
      Processing: 'bg-blue-500',
      Shipped: 'bg-purple-500',
      Delivered: 'bg-green-500',
      Cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-body-light to-primary dark:from-body-dark dark:to-dark-secondary text-text-primary-light dark:text-text-primary-dark p-6 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/orders')}
            className='flex items-center text-accent-light dark:text-accent-dark hover:underline mb-6'
          >
            <ArrowLeft className='mr-2' />
            Back to Orders
          </button>

          <div className='bg-white dark:bg-dark-light rounded-2xl shadow-xl overflow-hidden mb-8'>
            <div className='p-6 md:p-8'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
                <h1 className='text-3xl font-bold mb-4 md:mb-0'>
                  Order #{order.id}
                </h1>
                <div className='flex items-center space-x-2'>
                  {getStatusIcon(order.orderStatus)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <div>
                  <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
                  <ul className='space-y-3'>
                    <li className='flex justify-between items-center'>
                      <span className='text-text-secondary-light dark:text-text-secondary-dark'>
                        Order Date:
                      </span>
                      <span className='font-medium flex items-center'>
                        <Calendar className='w-4 h-4 mr-2 text-accent-light dark:text-accent-dark' />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                    <li className='flex justify-between items-center'>
                      <span className='text-text-secondary-light dark:text-text-secondary-dark'>
                        Total Amount:
                      </span>
                      <span className='font-semibold text-lg'>
                        ₦{formatPrice(order.totalPrice)}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className='text-xl font-semibold mb-4'>
                    Shipping Information
                  </h2>
                  <p className='text-sm mb-2'>
                    <span className='font-medium'>Address: </span>
                    {order.shippingInfo.address}, {order.shippingInfo.city},{' '}
                    {order.shippingInfo.state}, {order.shippingInfo.country}
                  </p>
                  <p className='text-sm mb-2'>
                    <span className='font-medium'>Postal Code: </span>
                    {order.shippingInfo.postalCode}
                  </p>
                  <p className='text-sm'>
                    <span className='font-medium'>Phone: </span>
                    {order.shippingInfo.phoneNo}
                  </p>
                </div>
              </div>

              <div className='mb-6'>
                <div className='flex border-b border-border-light dark:border-border-dark'>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'items'
                        ? 'text-accent-light dark:text-accent-dark border-b-2 border-accent-light dark:border-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    onClick={() => setActiveTab('items')}
                  >
                    Order Items
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'timeline'
                        ? 'text-accent-light dark:text-accent-dark border-b-2 border-accent-light dark:border-accent-dark'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                    onClick={() => setActiveTab('timeline')}
                  >
                    Order Timeline
                  </button>
                </div>
              </div>

              <AnimatePresence mode='wait'>
                {activeTab === 'items' && (
                  <motion.div
                    key='items'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='overflow-x-auto'>
                      <table className='w-full text-sm'>
                        <thead>
                          <tr className='bg-gray-50 dark:bg-gray-800'>
                            <th className='p-3 text-left'>Product</th>
                            <th className='p-3 text-left'>Quantity</th>
                            <th className='p-3 text-left'>Price (₦)</th>
                            <th className='p-3 text-left'>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orderItems.map((item) => (
                            <tr
                              key={item.id}
                              className='border-b border-border-light dark:border-border-dark'
                            >
                              <td className='p-3 flex items-center'>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className='w-12 h-12 object-cover rounded mr-4'
                                />
                                <span>{item.name}</span>
                              </td>
                              <td className='p-3'>{item.quantity}</td>
                              <td className='p-3'>
                                ₦{formatPrice(item.price)}
                              </td>
                              <td className='p-3'>
                                ₦{formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'timeline' && (
                  <motion.div
                    key='timeline'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='space-y-6'>
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map(
                        (status, index) => (
                          <div key={status} className='flex items-center'>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                order.orderStatus === status
                                  ? 'bg-accent-light dark:bg-accent-dark text-white'
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className='ml-4'>
                              <h3 className='font-medium'>{status}</h3>
                              <p className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                                {status === 'Pending'
                                  ? 'Order received'
                                  : status === 'Processing'
                                  ? 'Preparing your order'
                                  : status === 'Shipped'
                                  ? 'Order is on the way'
                                  : 'Order has been delivered'}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className='flex justify-end gap-4'>
            <button className='bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center'>
              <Printer className='w-5 h-5 mr-2' />
              Print Order
            </button>
            <button className='bg-accent-light dark:bg-accent-dark text-white px-6 py-2 rounded-lg hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition flex items-center'>
              <MessageCircle className='w-5 h-5 mr-2' />
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;
