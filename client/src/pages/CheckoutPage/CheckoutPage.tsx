import { motion } from 'framer-motion';
import { CreditCard, Lock, Package, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { initializePayment } from '../../api/payment';
import { fetchCart } from '../../features/cart/cartSlice';
import { initializeCheckout } from '../../features/checkout/checkoutSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const CheckoutPage: React.FC = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
    phoneNo: '',
  });

  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const { loading, error } = useAppSelector((state) => state.checkout);
  const { cart } = useAppSelector((state) => state.cart);

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = 8500;
  const total = subtotal + tax + shipping;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && userInfo?.id) {
      dispatch(fetchCart(userInfo.id));
    }
  }, [isAuthenticated, userInfo, dispatch]);

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error('You must be logged in to checkout.');
      navigate('/cart');
      return;
    }
    if (cart && cart.items.length === 0) {
      toast.error('You must have items in your cart to checkout.');
      navigate('/cart');
      return;
    }

    if (userInfo?.shippingInfo) {
      setShippingInfo(userInfo.shippingInfo);
    }
  }, [isAuthenticated, cart, userInfo, navigate]);

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.country) {
      toast.error('Please fill in all shipping details.');
      return;
    }

    if (isAuthenticated && userInfo?.id) {
      await dispatch(initializeCheckout({ userId: userInfo.id, shippingInfo }));

      if (!error) {
        try {
          const paymentResponse = await initializePayment(
            userInfo.id,
            userInfo.email
          );

          if (
            paymentResponse.success &&
            paymentResponse.data.authorization_url
          ) {
            window.location.href = paymentResponse.data.authorization_url;
          } else {
            toast.error('Payment initialization failed. Please try again.');
          }
        } catch (err) {
          toast.error('An error occurred while initializing payment.');
          console.error(err);
        }
      }
    } else {
      toast.error('You need to sign in to proceed with checkout.');
    }
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='min-h-screen bg-primary dark:bg-body-dark'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='grid lg:grid-cols-3 gap-8'
        >
          {/* Shipping Info */}
          <div className='lg:col-span-2 bg-body-light dark:bg-dark-light rounded-2xl shadow-xl overflow-hidden'>
            <div className='p-6 sm:p-8'>
              <h2 className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center'>
                <Truck className='text-accent-light dark:text-accent-dark mr-3' />
                Shipping Information
              </h2>
              <form className='space-y-6'>
                <div className='space-y-1'>
                  <label
                    htmlFor='address'
                    className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
                  >
                    Street Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    placeholder='Enter your street address'
                    value={shippingInfo.address}
                    onChange={handleShippingInfoChange}
                    className='w-full px-4 py-3 rounded-xl bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label
                      htmlFor='city'
                      className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
                    >
                      City
                    </label>
                    <input
                      type='text'
                      id='city'
                      name='city'
                      placeholder='City'
                      value={shippingInfo.city}
                      onChange={handleShippingInfoChange}
                      className='w-full px-4 py-3 rounded-xl bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
                    />
                  </div>
                  <div className='space-y-1'>
                    <label
                      htmlFor='state'
                      className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
                    >
                      State
                    </label>
                    <input
                      type='text'
                      id='state'
                      name='state'
                      placeholder='State'
                      value={shippingInfo.state}
                      onChange={handleShippingInfoChange}
                      className='w-full px-4 py-3 rounded-xl bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
                    />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label
                      htmlFor='postalCode'
                      className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
                    >
                      Postal Code
                    </label>
                    <input
                      type='text'
                      id='postalCode'
                      name='postalCode'
                      placeholder='Postal Code'
                      value={shippingInfo.postalCode}
                      onChange={handleShippingInfoChange}
                      className='w-full px-4 py-3 rounded-xl bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
                    />
                  </div>
                  <div className='space-y-1'>
                    <label
                      htmlFor='country'
                      className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
                    >
                      Country
                    </label>
                    <input
                      type='text'
                      id='country'
                      name='country'
                      placeholder='Country'
                      value={shippingInfo.country}
                      onChange={handleShippingInfoChange}
                      className='w-full px-4 py-3 rounded-xl bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
                    />
                  </div>
                </div>
                <div className='space-y-1'>
                  <label
                    htmlFor='phoneNo'
                    className='text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
                  >
                    Phone Number
                  </label>
                  <input
                    type='text'
                    id='phoneNo'
                    name='phoneNo'
                    placeholder='Phone Number'
                    value={shippingInfo.phoneNo}
                    onChange={handleShippingInfoChange}
                    className='w-full px-4 py-3 rounded-xl bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className='bg-body-light dark:bg-dark-light rounded-2xl shadow-xl overflow-hidden'>
            <div className='p-6 sm:p-8'>
              <h2 className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6 flex items-center'>
                <Package className='text-accent-light dark:text-accent-dark mr-3' />
                Order Summary
              </h2>
              <div className='space-y-4 text-text-secondary-light dark:text-text-secondary-dark'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>₦{formatPrice(subtotal)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Tax</span>
                  <span>₦{formatPrice(tax)}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>₦{formatPrice(shipping)}</span>
                </div>
                <div className='border-t border-border-light dark:border-border-dark pt-4 flex justify-between text-lg font-bold text-text-primary-light dark:text-text-primary-dark'>
                  <span>Total</span>
                  <span>₦{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className='mt-6 w-full bg-accent-light hover:bg-accent-secondary-light dark:bg-accent-dark dark:hover:bg-accent-secondary-dark text-white py-4 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-light dark:focus:ring-accent-dark disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <span className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className='flex items-center justify-center'>
                    <CreditCard className='mr-2' />
                    Confirm and Pay
                  </span>
                )}
              </button>
              <p className='mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark flex justify-center items-center'>
                <Lock className='mr-2' /> Secure Checkout
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
