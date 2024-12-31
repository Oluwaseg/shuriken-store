import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  FiEye,
  FiEyeOff,
  FiImage,
  FiLock,
  FiMail,
  FiUser,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type FormData = {
  name: string;
  email: string;
  password: string;
  avatar?: File;
};

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const {
    register: formRegister,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    dispatch(register(data))
      .unwrap()
      .then(() => {
        reset();
        setIsRedirecting(true);
        setTimeout(() => {
          navigate('/verify-otp');
        }, 5000);
      })
      .catch(() => toast.error('Registration failed.'));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark'>
      <div className='bg-white dark:bg-dark-light p-8 rounded-xl shadow-2xl w-full max-w-md border border-border-light dark:border-border-dark'>
        <h2 className='text-3xl font-bold text-center mb-8 text-text-primary-light dark:text-text-primary-dark'>
          Create Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Name Field */}
          <div className='relative'>
            <FiUser className='absolute top-3 left-3 text-placeholder-light dark:text-placeholder-dark' />
            <input
              type='text'
              placeholder='Full Name'
              {...formRegister('name', { required: 'Name is required' })}
              className='w-full pl-10 pr-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            />
            {errors.name && (
              <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className='relative'>
            <FiMail className='absolute top-3 left-3 text-placeholder-light dark:text-placeholder-dark' />
            <input
              type='email'
              placeholder='Email Address'
              {...formRegister('email', { required: 'Email is required' })}
              className='w-full pl-10 pr-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className='relative'>
            <FiLock className='absolute top-3 left-3 text-placeholder-light dark:text-placeholder-dark' />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              {...formRegister('password', {
                required: 'Password is required',
              })}
              className='w-full pl-10 pr-10 py-2 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-placeholder-light dark:text-placeholder-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='relative'>
            <label
              htmlFor='avatar'
              className='flex items-center cursor-pointer justify-center border border-dashed border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark text-text-secondary-light dark:text-text-secondary-dark rounded-lg py-2 px-3 focus:outline-none'
            >
              <FiImage className='mr-2 text-placeholder-light dark:text-placeholder-dark' />
              {preview || 'Upload Avatar'}
            </label>
            <input
              id='avatar'
              type='file'
              accept='image/*'
              {...formRegister('avatar')}
              className='hidden'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setValue('avatar', file);
                } else {
                  setPreview(null);
                  setValue('avatar', undefined);
                }
              }}
            />
            {preview && (
              <img
                src={preview}
                alt='Avatar Preview'
                className='mt-3 w-20 h-20 rounded-full object-cover border border-border-light dark:border-border-dark'
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading || isRedirecting}
            className='w-full bg-button-primary-light dark:bg-button-primary-dark text-white py-3 rounded-lg font-semibold text-lg hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed'
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

        <p className='mt-6 text-center text-text-secondary-light dark:text-text-secondary-dark'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-accent-light dark:text-accent-dark hover:underline'
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
