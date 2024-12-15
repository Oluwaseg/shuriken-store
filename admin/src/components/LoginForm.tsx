import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/authSlice';
import Circle from './logo/Circle';
import Shuriken from './logo/Shuriken';

// Define types for form data
interface LoginFormInputs {
  email: string;
  password: string;
}

// Define types for Redux state
interface RootState {
  auth: {
    loading: boolean;
    error: string | null;
  };
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { email, password } = data;
    const notifySuccess = () => toast.success('Login successful');
    const notifyError = (message: string) => toast.error(message);

    try {
      // Dispatch the login action
      const resultAction = await dispatch(
        loginUser({ email, password }) as any
      );

      // Check if the action was fulfilled or rejected
      if (resultAction.type === 'auth/loginUser/fulfilled') {
        notifySuccess();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const errorMessage =
          resultAction.payload?.message || 'Login failed. Please try again.';
        notifyError(errorMessage);
      }
    } catch (err) {
      notifyError('Login failed. Please try again.');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-primary dark:bg-body-dark transition-all p-6'>
      <HelmetProvider>
        <Helmet>
          <title>Admin Login</title>
          <meta name='description' content='Admin Login Page' />
        </Helmet>
      </HelmetProvider>
      <div className='w-full max-w-md bg-white dark:bg-dark-light p-8 rounded-lg shadow-md'>
        <div className='flex items-center justify-center gap-2.5 font-medium py-3 mb-3 mx-auto'>
          <div className={`relative w-12 h-12`}>
            <Circle />
            <div className='absolute inset-0 flex items-center justify-center'>
              <Shuriken className='w-1/2 h-1/2 object-contain' />
            </div>
          </div>
          <h1 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
            Admin Panel
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-md font-semibold text-text-secondary-light dark:text-text-secondary-dark'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              placeholder='admin@admin.com'
              {...register('email', { required: 'Email is required' })}
              className={`mt-1 block w-full px-3 py-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark placeholder-text-secondary-light dark:placeholder-placeholder-dark sm:text-sm ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-md font-semibold text-text-secondary-light dark:text-text-secondary-dark'
            >
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='•••••••••'
                {...register('password', { required: 'Password is required' })}
                className={`mt-1 block w-full px-3 py-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark placeholder-text-secondary-light dark:placeholder-placeholder-dark sm:text-sm ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500'
              >
                {showPassword ? (
                  <HiEyeOff className='w-5 h-5' />
                ) : (
                  <HiEye className='w-5 h-5' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='text-red-500 text-sm'>{errors.password.message}</p>
            )}
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full py-2 px-4 font-semibold rounded-md shadow-sm text-white bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark disabled:bg-gray-400 transition-all'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <Toaster position='top-right' />
    </div>
  );
};

export default LoginForm;
