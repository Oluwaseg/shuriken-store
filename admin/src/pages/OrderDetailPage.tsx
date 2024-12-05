import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FaArrowLeft, FaPrint } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderById } from '../components/tables/apis/orders';
import { Order } from '../components/tables/types/type';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orders, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchOrderById(orderId);
        if (response && response.orders) {
          setOrder(response.orders);
        } else {
          setError('Order details are not available.');
        }
      } catch {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'packaging':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-300 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );

  if (error)
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
        <div className='text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl'>
          <p className='text-xl text-red-600 font-semibold mb-4'>{error}</p>
          <Link
            to='/orders'
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300'
          >
            <FaArrowLeft className='mr-2' />
            Back to Orders
          </Link>
        </div>
      </div>
    );

  if (!orders)
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
        <div className='text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl'>
          <p className='text-xl font-semibold mb-4'>No order found.</p>
          <Link
            to='/orders'
            className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300'
          >
            <FaArrowLeft className='mr-2' />
            Back to Orders
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Order Details - #{orders._id}</title>
          <meta
            name='description'
            content={`Order details for order #${orders._id}`}
          />
        </Helmet>
      </HelmetProvider>
      <div className='min-h-screen bg-gray-100 dark:bg-gray-900 py-8'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 flex justify-between items-center'>
            <Link
              to='/orders'
              className='inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm'
            >
              <FaArrowLeft className='mr-2' />
              Back to Orders
            </Link>
            <button
              onClick={handlePrint}
              className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-sm'
            >
              <FaPrint className='mr-2' />
              Print Order
            </button>
          </div>

          <div className='bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden'>
            <div className='p-6 sm:p-8'>
              <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                  Order #{orders._id}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    orders.orderStatus
                  )}`}
                >
                  {orders.orderStatus}
                </span>
              </div>

              <div className='grid gap-8 md:grid-cols-2'>
                <div>
                  <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
                    Shipping Information
                  </h2>
                  {orders.shippingInfo ? (
                    <div className='space-y-2 text-gray-600 dark:text-gray-400'>
                      <p>
                        <strong>Address:</strong> {orders.shippingInfo.address}
                      </p>
                      <p>
                        <strong>City:</strong> {orders.shippingInfo.city}
                      </p>
                      <p>
                        <strong>State:</strong> {orders.shippingInfo.state}
                      </p>
                      <p>
                        <strong>Country:</strong> {orders.shippingInfo.country}
                      </p>
                      <p>
                        <strong>Postal Code:</strong>{' '}
                        {orders.shippingInfo.postalCode}
                      </p>
                      <p>
                        <strong>Phone:</strong> {orders.shippingInfo.phoneNo}
                      </p>
                    </div>
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400'>
                      No shipping information available.
                    </p>
                  )}
                </div>

                <div>
                  <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
                    Payment Information
                  </h2>
                  {orders.paymentInfo ? (
                    <div className='space-y-2 text-gray-600 dark:text-gray-400'>
                      <p>
                        <strong>ID:</strong> {orders.paymentInfo.id}
                      </p>
                      <p>
                        <strong>Status:</strong> {orders.paymentInfo.status}
                      </p>
                    </div>
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400'>
                      No payment information available.
                    </p>
                  )}
                </div>
              </div>

              <div className='mt-8'>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
                  Order Items
                </h2>
                {orders.orderItems && orders.orderItems.length > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                      <thead className='bg-gray-50 dark:bg-gray-700'>
                        <tr>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                          >
                            Product
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                          >
                            Price
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                          >
                            Quantity
                          </th>
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                        {orders.orderItems.map((item) => (
                          <tr key={item._id}>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center'>
                                <img
                                  className='h-10 w-10 rounded-full object-cover'
                                  src={item.image}
                                  alt={item.name}
                                />
                                <div className='ml-4'>
                                  <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                                    {item.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-gray-500 dark:text-gray-400'>
                                ${item.price.toFixed(2)}
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-gray-500 dark:text-gray-400'>
                                {item.quantity}
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className='text-gray-500 dark:text-gray-400'>
                    No items in this order.
                  </p>
                )}
              </div>

              <div className='mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg'>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
                  Order Summary
                </h2>
                <div className='space-y-2 text-gray-600 dark:text-gray-400'>
                  <p className='flex justify-between'>
                    <span>Items Price:</span>
                    <span>${orders.itemsPrice.toFixed(2)}</span>
                  </p>
                  <p className='flex justify-between'>
                    <span>Tax:</span>
                    <span>${orders.taxPrice.toFixed(2)}</span>
                  </p>
                  <p className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>${orders.shippingPrice.toFixed(2)}</span>
                  </p>
                  <div className='border-t border-gray-200 dark:border-gray-600 my-2 pt-2'>
                    <p className='flex justify-between font-semibold text-lg'>
                      <span>Total:</span>
                      <span>${orders.totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
                <p>
                  Order placed on: {new Date(orders.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
