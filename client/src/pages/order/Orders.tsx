import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheck,
  FiChevronDown,
  FiPackage,
  FiSearch,
  FiTruck,
  FiX,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import {
  cancelSingleOrder,
  fetchMyOrders,
} from '../../features/orders/orderSlice';

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <FiAlertCircle className='text-yellow-500' />,
  Processing: <FiPackage className='text-blue-500' />,
  Packing: <FiPackage className='text-blue-500' />,
  Shipped: <FiTruck className='text-purple-500' />,
  Delivered: <FiCheck className='text-green-500' />,
  Cancelled: <FiX className='text-red-500' />,
};

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [filteredOrders, setFilteredOrders] = useState(orders || []);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      let filtered = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (statusFilter !== 'All') {
        filtered = filtered.filter(
          (order) => order.orderStatus === statusFilter
        );
      }

      filtered.sort((a, b) => {
        if (sortBy === 'date') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortBy === 'price') {
          return b.totalPrice - a.totalPrice;
        }
        return 0;
      });

      setFilteredOrders(filtered);
    }
  }, [searchTerm, statusFilter, sortBy, orders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCancelOrder = (orderId: string) => {
    dispatch(cancelSingleOrder(orderId)); // Dispatch cancel thunk
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
          My Orders
        </h1>

        <div className='mb-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <div className='relative w-full sm:w-64'>
            <input
              type='text'
              placeholder='Search orders...'
              value={searchTerm}
              onChange={handleSearch}
              className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <FiSearch className='absolute left-3 top-2.5 text-gray-400' />
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='All'>All Status</option>
                <option value='Pending'>Pending</option>
                <option value='Processing'>Processing</option>
                <option value='Shipped'>Shipped</option>
                <option value='Delivered'>Delivered</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
              <FiChevronDown className='absolute right-3 top-2.5 text-gray-400 pointer-events-none' />
            </div>

            <div className='relative'>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='date'>Sort by Date</option>
                <option value='price'>Sort by Price</option>
              </select>
              <FiChevronDown className='absolute right-3 top-2.5 text-gray-400 pointer-events-none' />
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
          </div>
        ) : error ? (
          <div className='text-center text-red-500'>{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-center text-gray-500 dark:text-gray-400'>
              {statusFilter === 'All' && searchTerm === ''
                ? 'No orders found.'
                : `No orders found matching the ${statusFilter} status or your search term.`}
            </div>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
              >
                <div className='p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <span className='text-sm font-semibold text-gray-600 dark:text-gray-400'>
                      Order #{order.id}
                    </span>
                    <div className='flex items-center'>
                      {statusIcons[order.orderStatus]}
                      <span className='ml-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  <div className='mb-4'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                      Order Date
                    </div>
                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className='mb-4'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                      Total Amount
                    </div>
                    <div className='text-lg font-bold text-gray-900 dark:text-white'>
                      ${order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200'
                  >
                    View Details
                  </button>
                  {['Pending', 'Processing'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200'
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
