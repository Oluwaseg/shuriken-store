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
      <div className='flex items-center justify-center min-h-screen bg-body-light dark:bg-body-dark'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-light'></div>
      </div>
    );

  if (error)
    return (
      <div className='flex items-center justify-center min-h-screen bg-body-light dark:bg-body-dark'>
        <div className='text-center p-8 bg-body-light dark:bg-dark-light rounded-lg shadow-xl'>
          <p className='text-xl text-red-600 font-semibold mb-4'>{error}</p>
          <Link
            to='/orders'
            className='inline-flex items-center px-4 py-2 bg-button-primary-light text-body-light dark:bg-button-primary-dark dark:text-body-dark rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition-colors duration-300'
          >
            <FaArrowLeft className='mr-2' />
            Back to Orders
          </Link>
        </div>
      </div>
    );

  if (!orders)
    return (
      <div className='flex items-center justify-center min-h-screen bg-body-light dark:bg-body-dark'>
        <div className='text-center p-8 bg-body-light dark:bg-dark-light rounded-lg shadow-xl'>
          <p className='text-xl font-semibold mb-4'>No order found.</p>
          <Link
            to='/orders'
            className='inline-flex items-center px-4 py-2 bg-button-primary-light text-body-light dark:bg-button-primary-dark dark:text-body-dark rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition-colors duration-300'
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
            content={`Order details for order #₦{orders._id}`}
          />
        </Helmet>
      </HelmetProvider>
      <div className='min-h-screen bg-body-light dark:bg-body-dark py-8'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 flex justify-between items-center'>
            <Link
              to='/orders'
              className='inline-flex items-center px-4 py-2 bg-body-light dark:bg-dark-light text-text-primary-light dark:text-text-primary-dark rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm'
            >
              <FaArrowLeft className='mr-2' />
              Back to Orders
            </Link>
            <button
              onClick={handlePrint}
              className='inline-flex items-center px-4 py-2 bg-button-primary-light text-body-light dark:bg-button-primary-dark dark:text-body-dark rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition-colors duration-300 shadow-sm'
            >
              <FaPrint className='mr-2' />
              Print Order
            </button>
          </div>

          <div className='bg-body-light dark:bg-dark-light shadow-xl rounded-lg overflow-hidden'>
            <div className='p-6 sm:p-8'>
              <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-text-primary-light dark:text-text-primary-dark'>
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
                  <h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4'>
                    Shipping Information
                  </h2>
                  {orders.shippingInfo ? (
                    <div className='space-y-2 text-text-secondary-light dark:text-text-secondary-dark'>
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
                    <p className='text-text-secondary-light dark:text-text-secondary-dark'>
                      No shipping information available.
                    </p>
                  )}
                </div>

                <div>
                  <h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4'>
                    Payment Information
                  </h2>
                  {orders.paymentInfo ? (
                    <div className='space-y-2 text-text-secondary-light dark:text-text-secondary-dark'>
                      <p>
                        <strong>ID:</strong> {orders.paymentInfo.id}
                      </p>
                      <p>
                        <strong>Status:</strong> {orders.paymentInfo.status}
                      </p>
                    </div>
                  ) : (
                    <p className='text-text-secondary-light dark:text-text-secondary-dark'>
                      No payment information available.
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className='mt-8 bg-body-light dark:bg-dark-light p-6 rounded-lg'>
                <h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-4'>
                  Order Summary
                </h2>
                <div className='space-y-2 text-text-secondary-light dark:text-text-secondary-dark'>
                  <p className='flex justify-between'>
                    <span>Items Price:</span>
                    <span>₦{orders.itemsPrice.toFixed(2)}</span>
                  </p>
                  <p className='flex justify-between'>
                    <span>Tax:</span>
                    <span>₦{orders.taxPrice.toFixed(2)}</span>
                  </p>
                  <p className='flex justify-between'>
                    <span>Shipping:</span>
                    <span>₦{orders.shippingPrice.toFixed(2)}</span>
                  </p>
                  <div className='border-t border-gray-200 dark:border-gray-600 my-2 pt-2'>
                    <p className='flex justify-between font-semibold text-lg'>
                      <span>Total:</span>
                      <span>₦{orders.totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Date */}
              <div className='mt-8 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
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
