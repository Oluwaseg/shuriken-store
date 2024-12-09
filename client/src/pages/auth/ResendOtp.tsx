import React from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiSend } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { resendOTP } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type FormData = {
  email: string;
};

const ResendOTPPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    dispatch(resendOTP(data.email))
      .unwrap()
      .then(() => {
        navigate('/verify-otp');
      })
      .catch(() => {});
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark'>
      <div className='bg-white dark:bg-dark-light p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-8 text-text-primary-light dark:text-text-primary-dark'>
          Resend OTP
        </h2>
        <p className='text-center text-text-secondary-light dark:text-text-secondary-dark mb-6'>
          Enter your email address to receive a new OTP.
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
            className={`w-full bg-button-primary-light dark:bg-button-primary-dark text-white py-2 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center ${
              loading && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <FiSend className='mr-2 animate-spin' /> Resending...
              </>
            ) : (
              <>
                <FiSend className='mr-2' /> Resend OTP
              </>
            )}
          </button>
        </form>
        {error && (
          <div className='mt-2 text-red-500 text-xs'>
            <p>{error}</p>
          </div>
        )}
        <div className='mt-6 text-center space-y-2'>
          <p className='text-text-secondary-light dark:text-text-secondary-dark'>
            <Link
              to='/verify-otp'
              className='text-accent-light dark:text-accent-dark hover:underline'
            >
              Back to Verify OTP
            </Link>
          </p>
          <p className='text-text-secondary-light dark:text-text-secondary-dark'>
            <Link
              to='/login'
              className='text-accent-light dark:text-accent-dark hover:underline'
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendOTPPage;
