import React, { useEffect } from 'react';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { AppDispatch, RootState } from '../../app/store';
import { fetchSingleOrder } from '../../features/orders/orderSlice';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { singleOrder, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchSingleOrder(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
        <SyncLoader color='#6B46C1' size={12} />
        <p className='mt-4 text-gray-600 dark:text-gray-400 text-lg'>
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500'>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!singleOrder) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
        <p>No order found.</p>
      </div>
    );
  }

  const order = singleOrder;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-8'>
      <div className='max-w-5xl mx-auto'>
        {/* Back Button */}
        <div className='mb-6'>
          <button
            onClick={() => window.history.back()}
            className='flex items-center text-purple-600 dark:text-purple-400 hover:underline'
          >
            <FaArrowLeft className='mr-2' />
            Back to Orders
          </button>
        </div>

        {/* Order Summary */}
        <h1 className='text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-6'>
          Order Details
        </h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
          {/* Order Details */}
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
            <h2 className='text-lg font-bold mb-4'>Order Summary</h2>
            <ul className='space-y-4 text-sm'>
              <li className='flex justify-between'>
                <span className='text-gray-500'>Order ID:</span>
                <span className='font-medium'>#{order.id}</span>
              </li>
              <li className='flex justify-between'>
                <span className='text-gray-500'>Order Date:</span>
                <span>
                  <FaCalendarAlt className='inline-block text-purple-500 mr-2' />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </li>
              <li className='flex justify-between'>
                <span className='text-gray-500'>Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
                  style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                >
                  {order.orderStatus}
                </span>
              </li>
              <li className='flex justify-between'>
                <span className='text-gray-500'>Total Amount:</span>
                <span className='font-semibold text-lg'>
                  ${order.totalPrice.toFixed(2)}
                </span>
              </li>
            </ul>
          </div>

          {/* Shipping Info */}
          <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
            <h2 className='text-lg font-bold mb-4'>Shipping Information</h2>
            <p className='text-sm'>
              <span className='font-medium'>Address: </span>
              {order.shippingInfo.address}, {order.shippingInfo.city},{' '}
              {order.shippingInfo.state}, {order.shippingInfo.country}
            </p>
            <p className='text-sm mt-2'>
              <span className='font-medium'>Postal Code:</span>{' '}
              {order.shippingInfo.postalCode}
            </p>
            <p className='text-sm mt-2'>
              <span className='font-medium'>Phone:</span>{' '}
              {order.shippingInfo.phoneNo}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8'>
          <h2 className='text-lg font-bold mb-4'>Order Items</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300'>
                  <th className='p-3 text-left'>Product</th>
                  <th className='p-3 text-left'>Quantity</th>
                  <th className='p-3 text-left'>Price</th>
                  <th className='p-3 text-left'>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => (
                  <tr
                    key={item.id}
                    className='border-b border-gray-200 dark:border-gray-700'
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
                    <td className='p-3'>${item.price.toFixed(2)}</td>
                    <td className='p-3'>
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className='flex justify-end gap-4'>
          <button className='bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition'>
            Print Order
          </button>
          <button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition'>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Pending: '#FBBF24',
      Processing: '#34D399',
      Shipped: '#6366F1',
      Delivered: '#10B981',
      Cancelled: '#EF4444',
    };
    return colors[status] || '#6B7280';
  }
};

export default OrderDetails;
