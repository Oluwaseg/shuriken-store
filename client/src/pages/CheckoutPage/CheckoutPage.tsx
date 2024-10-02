import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='container mx-auto py-10 px-4 lg:px-8'>
      {/* Progress Bar */}
      <div className='flex items-center justify-between pb-6'>
        <div className='text-gray-600 dark:text-gray-400 text-sm'>
          <span className='font-semibold'>Cart</span> {' > '}
          <span className='text-indigo-600 font-semibold'>Checkout</span>{' '}
          {' > '}
          Confirmation
        </div>
        <div>
          <button
            onClick={() => navigate('/cart')}
            className='bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300'
          >
            Back to Cart
          </button>
        </div>
      </div>

      <div className='grid lg:grid-cols-12 gap-8'>
        {/* Left Section: User Info, Address, and Payment */}
        <div className='lg:col-span-8 space-y-6'>
          {/* Delivery Address */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Delivery Address
            </h2>
            <form className='space-y-4'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    First Name
                  </label>
                  <input
                    type='text'
                    className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Address
                </label>
                <input
                  type='text'
                  className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                />
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    City
                  </label>
                  <input
                    type='text'
                    className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Postal Code
                  </label>
                  <input
                    type='text'
                    className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Information */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Payment Information
            </h2>
            <form className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Cardholder's Name
                </label>
                <input
                  type='text'
                  className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Card Number
                </label>
                <input
                  type='text'
                  className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                />
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Expiry Date
                  </label>
                  <input
                    type='text'
                    className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    CVV
                  </label>
                  <input
                    type='text'
                    className='mt-1 p-2 w-full rounded border dark:bg-gray-700 dark:text-white'
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section: Order Summary */}
        <div className='lg:col-span-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
            Order Summary
          </h2>
          <div className='flex justify-between text-gray-700 dark:text-gray-300 mb-2'>
            <span>Subtotal</span>
            <span>$120.00</span>
          </div>
          <div className='flex justify-between text-gray-700 dark:text-gray-300 mb-2'>
            <span>Tax (10%)</span>
            <span>$12.00</span>
          </div>
          <div className='flex justify-between text-gray-700 dark:text-gray-300 mb-4'>
            <span>Shipping</span>
            <span>$15.00</span>
          </div>
          <hr className='my-4' />
          <div className='flex justify-between text-xl font-semibold text-gray-900 dark:text-white'>
            <span>Total</span>
            <span>$147.00</span>
          </div>

          {/* Checkout and Clear Cart Buttons */}
          <div className='mt-6 space-y-4'>
            <button
              onClick={() => navigate('/confirmation')}
              className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors'
            >
              Complete Purchase
            </button>
            <button
              onClick={() => navigate('/cart')}
              className='w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition-colors'
            >
              Edit Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
