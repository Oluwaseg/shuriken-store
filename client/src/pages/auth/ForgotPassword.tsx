import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { forgotPassword, resetAuthState } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type FormData = {
  email: string;
};

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Clear error on component mount
    dispatch(resetAuthState());
  }, [dispatch]);

  const onSubmit = (data: FormData) => {
    dispatch(forgotPassword(data.email))
      .unwrap()
      .then(() => {
        // Handle additional feedback or reset form if needed
        dispatch(resetAuthState()); // Clear error if needed
      })
      .catch(() => {
        // Error will be handled by the authSlice, no need to use toast here
      });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark'>
      <div className='bg-white dark:bg-dark-light p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-8 text-text-primary-light dark:text-text-primary-dark'>
          Forgot Password
        </h2>
        <p className='text-center text-text-secondary-light dark:text-text-secondary-dark mb-6'>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='relative'>
            <FiMail className='absolute top-3 left-3 text-text-secondary-light dark:text-text-secondary-dark' />
            <input
              type='email'
              placeholder='Email Address'
              {...formRegister('email', { required: 'Email is required' })}
              className='w-full pl-10 pr-3 py-2 rounded-lg border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-button-primary-light dark:bg-button-primary-dark text-white py-2 rounded-lg hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-300 transform hover:scale-105 flex items-center justify-center'
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
            <FiArrowRight className='ml-2' />
          </button>

          {error && (
            <div className='mt-2 text-red-500 text-xs'>
              <p>{error}</p>
            </div>
          )}
        </form>

        <p className='mt-6 text-center text-text-secondary-light dark:text-text-secondary-dark'>
          Remember your password?{' '}
          <Link
            to='/login'
            className='text-accent-light dark:text-accent-dark hover:underline'
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
