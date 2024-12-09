import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { verifyOTP } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

type FormData = {
  otp: string;
};

const VerifyOTPPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>();
  const navigate = useNavigate();
  const otp = watch('otp', '').split('');
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value)) || value.length > 1) return;
    const otpArray = [...otp];
    otpArray[index] = value;
    setValue('otp', otpArray.join(''));
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(verifyOTP({ otp: data.otp })).unwrap();
      toast.success('OTP verified successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-body-light dark:bg-body-dark'>
      <div className='bg-white dark:bg-dark-light p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-8 text-text-primary-light dark:text-text-primary-dark'>
          Verify OTP
        </h2>
        <p className='text-center text-text-secondary-light dark:text-text-secondary-dark mb-6'>
          We've sent a code to your email. Please enter it below.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex justify-center space-x-2'>
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type='text'
                maxLength={1}
                value={otp[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                className='w-12 h-12 text-center text-text-primary-light dark:text-text-primary-light text-2xl rounded-lg border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
              />
            ))}
          </div>
          <input
            {...register('otp', {
              required: 'OTP is required',
              minLength: 6,
              maxLength: 6,
            })}
            type='hidden'
          />
          {errors.otp && (
            <p className='text-red-500 text-xs mt-1'>{errors.otp.message}</p>
          )}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-button-primary-light dark:bg-button-primary-dark text-white py-2 rounded-lg hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-300 transform hover:scale-105 flex items-center justify-center'
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <FiCheck className='mr-2' /> Verify OTP
              </>
            )}
          </button>
        </form>
        {error && <p className='text-red-500 text-xs mt-2'>{error}</p>}
      </div>
    </div>
  );
};

export default VerifyOTPPage;
