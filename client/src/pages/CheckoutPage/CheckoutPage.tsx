import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaLock, FaShoppingCart, FaTruck } from 'react-icons/fa';
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
  const shipping = 15.0;
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
      // Initialize checkout
      await dispatch(initializeCheckout({ userId: userInfo.id, shippingInfo }));

      if (!error) {
        try {
          // Call the backend to initialize payment
          const paymentResponse = await initializePayment(
            userInfo.id,
            userInfo.email
          );

          if (
            paymentResponse.success &&
            paymentResponse.data.authorization_url
          ) {
            // Redirect to Paystack authorization URL
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

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Shipping Info */}
          <div className='lg:col-span-2 bg-white shadow-lg rounded-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
              <FaTruck className='text-indigo-600 mr-3' />
              Shipping Information
            </h2>
            <form className='space-y-6'>
              <div className='space-y-1'>
                <label
                  htmlFor='address'
                  className='text-sm font-medium text-gray-700'
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
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label
                    htmlFor='city'
                    className='text-sm font-medium text-gray-700'
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
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  />
                </div>
                <div className='space-y-1'>
                  <label
                    htmlFor='state'
                    className='text-sm font-medium text-gray-700'
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
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label
                    htmlFor='postalCode'
                    className='text-sm font-medium text-gray-700'
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
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  />
                </div>
                <div className='space-y-1'>
                  <label
                    htmlFor='country'
                    className='text-sm font-medium text-gray-700'
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
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  />
                </div>
              </div>
              <div className='space-y-1'>
                <label
                  htmlFor='phoneNo'
                  className='text-sm font-medium text-gray-700'
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
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className='bg-white shadow-lg rounded-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
              <FaShoppingCart className='text-indigo-600 mr-3' />
              Order Summary
            </h2>
            <div className='space-y-4 text-gray-600'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className='border-t border-gray-200 pt-4 flex justify-between text-lg font-bold'>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className='mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              {loading ? 'Processing...' : 'Confirm and Pay'}
            </button>
            <p className='mt-4 text-sm text-gray-500 flex justify-center items-center'>
              <FaLock className='mr-2' /> Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
