import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  FaApple,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaGoogle,
  FaImage,
  FaLock,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type FormData = {
  name: string;
  email: string;
  password: string;
  avatar?: File;
};

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    dispatch(register(data))
      .unwrap()
      .then(() => {
        setIsRedirecting(true);
        setTimeout(() => {
          navigate('/verify-otp');
        }, 5000);
      })
      .catch(() => toast.error('Registration failed.'));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8'>
        <h2 className='text-4xl font-bold mb-6 text-center text-gray-800'>
          Join Us
        </h2>
        <p className='text-center text-gray-600 mb-8'>
          Create your account and start your journey
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='relative'>
            <FaUser className='absolute top-3 left-3 text-gray-400' />
            <input
              id='name'
              type='text'
              {...formRegister('name', { required: 'Name is required' })}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
              placeholder='Full Name'
            />
            {errors.name && (
              <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
            )}
          </div>

          <div className='relative'>
            <FaEnvelope className='absolute top-3 left-3 text-gray-400' />
            <input
              id='email'
              type='email'
              {...formRegister('email', { required: 'Email is required' })}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
              placeholder='Email Address'
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='relative'>
            <FaLock className='absolute top-3 left-3 text-gray-400' />
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              {...formRegister('password', {
                required: 'Password is required',
              })}
              className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
              placeholder='Password'
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='relative'>
            <FaImage className='absolute top-3 left-3 text-gray-400' />
            <input
              id='avatar'
              type='file'
              {...formRegister('avatar')}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
            />
          </div>

          <button
            type='submit'
            disabled={loading || isRedirecting}
            className='w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isRedirecting
              ? 'Redirecting...'
              : loading
              ? 'Creating Account...'
              : 'Sign Up'}
          </button>

          {error && (
            <p className='text-red-500 text-sm mt-2 text-center'>{error}</p>
          )}
        </form>

        <div className='mt-8'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mt-6 flex justify-center gap-4'>
            <a
              href='/google'
              className='flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md'
            >
              <FaGoogle className='text-red-500 w-5 h-5' />
            </a>
            <a
              href='/facebook'
              className='flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md'
            >
              <FaFacebook className='text-blue-600 w-5 h-5' />
            </a>
            <a
              href='/apple'
              className='flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md'
            >
              <FaApple className='text-gray-800 w-5 h-5' />
            </a>
          </div>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <a
              href='/login'
              className='text-purple-600 hover:underline font-medium'
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
