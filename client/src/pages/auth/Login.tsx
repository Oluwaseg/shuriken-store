import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = (data: FormData) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark transition-all'>
      <div className='bg-white dark:bg-dark-light p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center text-text-primary-light dark:text-text-primary-dark'>
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Email Input */}
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              {...formRegister('email', { required: 'Email is required' })}
              className='mt-1 w-full px-4 py-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark placeholder-text-secondary-light dark:placeholder-placeholder-dark'
            />
            {errors.email && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark'
            >
              Password
            </label>
            <div className='relative mt-1'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                {...formRegister('password', {
                  required: 'Password is required',
                })}
                className='w-full px-4 py-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark placeholder-text-secondary-light dark:placeholder-placeholder-dark'
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute inset-y-0 right-3 flex items-center text-text-secondary-light dark:text-placeholder-dark'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-2 rounded-lg text-white bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark disabled:bg-gray-400 transition-all'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <p className='text-center text-sm text-red-500 mt-4'>
            {error ===
            'User not verified. Please verify your email address.' ? (
              <>
                {error}{' '}
                <Link
                  to='/resend-otp'
                  className='text-accent-light dark:text-accent-dark hover:underline'
                >
                  Resend OTP
                </Link>
              </>
            ) : (
              error
            )}
          </p>
        )}

        {/* Additional Links */}
        <div className='mt-6 text-center'>
          <Link
            to='/forgot-password'
            className='text-sm text-accent-light dark:text-accent-dark hover:underline'
          >
            Forgot Password?
          </Link>
        </div>
        <div className='mt-4 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='text-accent-light dark:text-accent-dark hover:underline'
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
