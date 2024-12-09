import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiCheck, FiLock } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type FormData = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (token) {
      dispatch(
        resetPassword({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })
      )
        .unwrap()
        .then(() => {
          navigate('/login');
        })
        .catch(() => {
          toast.error('Failed to reset password.');
        });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark'>
      <div className='bg-white dark:bg-dark-light p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-8 text-text-primary-light dark:text-text-primary-dark'>
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='relative'>
            <FiLock className='absolute top-3 left-3 text-text-secondary-light dark:text-text-secondary-dark' />
            <input
              type='password'
              placeholder='New Password'
              {...formRegister('password', {
                required: 'Password is required',
              })}
              className='w-full pl-10 pr-3 py-2 rounded-lg border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            />
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className='relative'>
            <FiLock className='absolute top-3 left-3 text-text-secondary-light dark:text-text-secondary-dark' />
            <input
              type='password'
              placeholder='Confirm New Password'
              {...formRegister('confirmPassword', {
                required: 'Confirm password is required',
              })}
              className='w-full pl-10 pr-3 py-2 rounded-lg border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-button-primary-light dark:bg-button-primary-dark text-white py-2 rounded-lg hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-300 transform hover:scale-105 flex items-center justify-center'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
            <FiCheck className='ml-2' />
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

export default ResetPasswordPage;
