import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight, FaEye, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PagePreloader from '../PagePreloader';
import { deleteOrder, fetchOrders, updateOrderStatus } from './apis/orders';
import { Order } from './types/type';

const ITEMS_PER_PAGE = 10;

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPreloader, setShowPreloader] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await fetchOrders();
        setOrders(orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    // Simulate preloader delay
    const timer = setTimeout(() => {
      setShowPreloader(false);
      loadOrders();
    }, 3000); // 3 seconds

    // Cleanup timeout
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order
        )
      );
      toast.success('Order status updated successfully.');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== id)
        );
        toast.success('Order deleted successfully.');
      } catch (error) {
        console.error('Failed to delete order:', error);
        toast.error('Failed to delete order.');
      }
    }
  };

  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalOrders);
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (showPreloader)
    return (
      <div className='min-h-screen flex items-center justify-center dark:bg-body-dark'>
        <PagePreloader />
      </div>
    );
  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center dark:bg-body-dark'>
        <PagePreloader />
      </div>
    );

  if (orders.length === 0)
    return (
      <div className='text-center py-10'>
        <p className='text-xl text-text-primary-light dark:text-text-primary-dark'>
          No orders found.
        </p>
      </div>
    );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'packaging':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='overflow-x-auto bg-body-light dark:bg-body-dark rounded-lg shadow-lg'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-800'>
            <tr>
              {[
                '#',
                'Client',
                'Order ID',
                'Order Date',
                'Order Items',
                'Status',
                'Total Price',
                'Actions',
              ].map((header) => (
                <th
                  key={header}
                  className='px-6 py-3 text-left text-xs font-medium text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-body-light divide-y divide-gray-200 dark:bg-body-dark dark:divide-gray-700'>
            {currentOrders.map((order, index) => (
              <tr
                key={order._id}
                className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out'
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'>
                  {startIndex + index + 1}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'>
                  <div className='flex items-center space-x-4'>
                    <img
                      src={
                        (order.user.avatar && order.user.avatar[0]?.url) ||
                        'https://example.com/default-avatar.jpg'
                      }
                      alt='Client Avatar'
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <span>{order.user.name || 'Client Name'}</span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'>
                  <Link
                    to={`/orders/${order._id}`}
                    className='text-accent-light dark:text-accent-secondary-dark hover:underline'
                  >
                    {order._id}
                  </Link>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                  {order.orderItems.length > 0 ? (
                    <ul className='list-disc list-inside'>
                      {order.orderItems.slice(0, 2).map((item) => (
                        <li key={item._id} className='truncate'>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                      {order.orderItems.length > 2 && (
                        <li>+{order.orderItems.length - 2} more</li>
                      )}
                    </ul>
                  ) : (
                    <span>No items</span>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`border rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {[
                      'Pending',
                      'Processing',
                      'Packaging',
                      'Shipped',
                      'Delivered',
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                  ₦{order.totalPrice.toFixed(2)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex space-x-2'>
                    <Link
                      to={`/orders/${order._id}`}
                      className='text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300'
                    >
                      <FaEye className='w-5 h-5' />
                    </Link>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                    >
                      <FaTrash className='w-5 h-5' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-between mt-4'>
          <div className='text-sm'>
            Showing {startIndex + 1} to {endIndex} of {totalOrders} orders
          </div>
          <div className='flex space-x-2'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50'
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50'
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default OrderTable;
