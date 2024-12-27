import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Check,
  ChevronDown,
  Package,
  Search,
  Truck,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import {
  cancelSingleOrder,
  fetchMyOrders,
} from '../../features/orders/orderSlice';

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <AlertCircle className='text-yellow-500' />,
  Processing: <Package className='text-blue-500' />,
  Packing: <Package className='text-blue-500' />,
  Shipped: <Truck className='text-purple-500' />,
  Delivered: <Check className='text-green-500' />,
  Cancelled: <X className='text-red-500' />,
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
    dispatch(cancelSingleOrder(orderId));
  };
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-body-light to-primary dark:from-body-dark dark:to-dark-secondary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8'
        >
          My Orders
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 flex flex-col sm:flex-row justify-between items-center gap-4'
        >
          <div className='relative w-full sm:w-64'>
            <input
              type='text'
              placeholder='Search orders...'
              value={searchTerm}
              onChange={handleSearch}
              className='w-full pl-10 pr-4 py-2 rounded-full border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-300'
            />
            <Search className='absolute left-3 top-2.5 text-placeholder-light dark:text-placeholder-dark' />
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='appearance-none pl-4 pr-10 py-2 rounded-full border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-300'
              >
                <option value='All'>All Status</option>
                <option value='Pending'>Pending</option>
                <option value='Processing'>Processing</option>
                <option value='Shipped'>Shipped</option>
                <option value='Delivered'>Delivered</option>
                <option value='Cancelled'>Cancelled</option>
              </select>
              <ChevronDown className='absolute right-3 top-2.5 text-placeholder-light dark:text-placeholder-dark pointer-events-none' />
            </div>

            <div className='relative'>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='appearance-none pl-4 pr-10 py-2 rounded-full border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all duration-300'
              >
                <option value='date'>Sort by Date</option>
                <option value='price'>Sort by Price</option>
              </select>
              <ChevronDown className='absolute right-3 top-2.5 text-placeholder-light dark:text-placeholder-dark pointer-events-none' />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex justify-center items-center h-64'
            >
              <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-light dark:border-accent-dark'></div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-center text-red-500 bg-red-100 dark:bg-red-900 p-4 rounded-lg'
            >
              {error}
            </motion.div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex justify-center items-center h-64'
            >
              <div className='text-center text-placeholder-light dark:text-placeholder-dark'>
                {statusFilter === 'All' && searchTerm === ''
                  ? 'No orders found.'
                  : `No orders found matching the ${statusFilter} status or your search term.`}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial='hidden'
              animate='visible'
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
            >
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className='bg-white dark:bg-dark-light rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300'
                >
                  <div className='p-6'>
                    <div className='flex justify-between items-center mb-4'>
                      <span className='text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark'>
                        Order #{order.id}
                      </span>
                      <div className='flex items-center'>
                        {statusIcons[order.orderStatus]}
                        <span className='ml-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    <div className='mb-4'>
                      <div className='text-xs text-placeholder-light dark:text-placeholder-dark mb-1'>
                        Order Date
                      </div>
                      <div className='text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className='mb-6'>
                      <div className='text-xs text-placeholder-light dark:text-placeholder-dark mb-1'>
                        Total Amount
                      </div>
                      <div className='text-2xl font-bold text-accent-light dark:text-accent-dark'>
                        ₦{formatPrice(order.totalPrice)}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className='w-full bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark text-white font-medium py-2 px-4 rounded-full transition duration-300 transform hover:scale-105'
                      >
                        View Details
                      </button>
                      {['Pending', 'Processing'].includes(
                        order.orderStatus
                      ) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition duration-300 transform hover:scale-105'
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderPage;
