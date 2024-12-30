import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const newPassword = watch('newPassword');

  const passwordRequirements = [
    { regex: /.{10,}/, text: 'At least 10 characters' },
    { regex: /[a-z]/, text: 'At least one lowercase character' },
    { regex: /[^a-zA-Z0-9]/, text: 'At least one special character' },
  ];

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold mb-3'>Update Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
        {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map(
          (field) => (
            <div key={field}>
              <label className='block text-sm font-medium mb-1' htmlFor={field}>
                {field === 'currentPassword'
                  ? 'Current Password'
                  : field === 'newPassword'
                  ? 'New Password'
                  : 'Confirm New Password'}
              </label>
              <div className='relative'>
                <input
                  type={showPassword[field] ? 'text' : 'password'}
                  {...register(field)}
                  className={`w-full px-3 py-2 border rounded-md bg-input-light dark:bg-input-dark ${
                    errors[field]
                      ? 'border-red-500'
                      : 'border-border-light dark:border-border-dark'
                  } focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark`}
                />
                <button
                  type='button'
                  onClick={() => toggleShowPassword(field)}
                  className='absolute inset-y-0 right-0 flex items-center pr-3'
                >
                  {showPassword[field] ? (
                    <EyeOff className='h-4 w-4 text-gray-400' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-400' />
                  )}
                </button>
              </div>
              {errors[field] && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors[field]?.message}
                </p>
              )}
            </div>
          )
        )}

        <div className='bg-gray-100 dark:bg-dark-secondary p-3 rounded-md'>
          <h3 className='text-sm font-medium mb-2'>Password Requirements:</h3>
          <ul className='space-y-1'>
            {passwordRequirements.map((req, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className='flex items-center space-x-2'
              >
                {req.regex.test(newPassword || '') ? (
                  <Check className='h-3 w-3 text-green-500' />
                ) : (
                  <X className='h-3 w-3 text-red-500' />
                )}
                <span
                  className={`text-xs ${
                    req.regex.test(newPassword || '')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {req.text}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.button
          type='submit'
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full bg-button-primary-light hover:bg-button-hover-light dark:bg-button-primary-dark dark:hover:bg-button-hover-dark text-white py-2 px-4 rounded-md font-medium ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </motion.button>
      </form>
    </div>
  );
};
