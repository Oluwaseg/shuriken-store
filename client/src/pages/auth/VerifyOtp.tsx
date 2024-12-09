import React, { useState } from 'react';
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
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(parseInt(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const onSubmit = (data: FormData) => {
    setIsVerifying(true);
    dispatch(verifyOTP({ otp: data.otp }))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch(() => {
        toast.error('OTP verification failed.');
        setIsVerifying(false);
      });
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
            {otp.map((data, index) => (
              <input
                key={index}
                type='text'
                maxLength={1}
                value={data}
                {...formRegister('otp', { required: 'OTP is required' })}
                onChange={(e) => handleChange(e.target, index)}
                className='w-12 h-12 text-center text-text-primary-light dark:text-text-primary-light text-2xl rounded-lg border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
              />
            ))}
          </div>
          {errors.otp && (
            <p className='text-red-500 text-xs mt-1'>{errors.otp.message}</p>
          )}
          <button
            type='submit'
            disabled={loading || isVerifying}
            className='w-full bg-button-primary-light dark:bg-button-primary-dark text-white py-2 rounded-lg hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-300 transform hover:scale-105 flex items-center justify-center'
          >
            {isVerifying ? (
              'Verifying...'
            ) : loading ? (
              'Processing...'
            ) : (
              <>
                <FiCheck className='mr-2' />
                Verify OTP
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
