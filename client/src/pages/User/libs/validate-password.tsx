import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaTimesCircle,
} from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import * as Yup from 'yup';
import { fetchUpdateUserPassword } from '../../../features/user/userSlice';
import { useAppDispatch } from '../../../hooks';

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(10, 'Password must be at least 10 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Please confirm your new password'),
});

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const UpdateUserPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<PasswordData>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordData) => {
    await dispatch(fetchUpdateUserPassword(data));
    reset();
  };

  const toggleShowPassword = (field: keyof PasswordData) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const newPassword = watch('newPassword');

  const passwordRequirements = [
    { regex: /.{10,}/, text: 'At least 10 characters' },
    { regex: /[a-z]/, text: 'At least one lowercase character' },
    { regex: /[^a-zA-Z0-9]/, text: 'At least one special character' },
  ];

  return (
    <div className='lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg'>
      <h3 className='text-2xl font-bold mb-6 text-gray-800 dark:text-white'>
        Update Password
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map(
          (field) => (
            <div key={field}>
              <label
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                htmlFor={field}
              >
                {field === 'currentPassword'
                  ? 'Current Password'
                  : field === 'newPassword'
                  ? 'New Password'
                  : 'Confirm New Password'}
              </label>
              <div className='relative'>
                <input
                  type={showPassword[field] ? 'text' : 'password'}
                  placeholder='••••••••'
                  className={`bg-gray-50 dark:bg-gray-700 border ${
                    errors[field]
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  {...register(field)}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500'
                  onClick={() => toggleShowPassword(field)}
                >
                  {showPassword[field] ? (
                    <FaEyeSlash className='h-5 w-5' />
                  ) : (
                    <FaEye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors[field] && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors[field]?.message}
                </p>
              )}
            </div>
          )
        )}
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Password requirements:
          </p>
          <ul className='space-y-1'>
            {passwordRequirements.map((req, index) => (
              <li key={index} className='flex items-center space-x-2'>
                {req.regex.test(newPassword || '') ? (
                  <FaCheckCircle className='text-green-500' />
                ) : (
                  <FaTimesCircle className='text-red-500' />
                )}
                <span
                  className={`text-sm ${
                    req.regex.test(newPassword || '')
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <button
          type='submit'
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex justify-center items-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <ClipLoader size={20} color='white' />
              <span className='ml-2'>Updating...</span>
            </>
          ) : (
            <>
              <FaLock className='mr-2' />
              <span>Update Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
