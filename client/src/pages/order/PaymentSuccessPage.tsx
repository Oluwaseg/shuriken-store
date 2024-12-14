import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { verifyPayment } from '../../api/payment';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const reference = query.get('reference');

    if (!reference) {
      toast.error('Payment reference missing.');
      navigate('/checkout');
      return;
    }

    verifyPayment(reference).then((response) => {
      setLoading(false);
      if (response.success) {
        toast.success('Payment verified successfully!');
        navigate('/orders');
      } else {
        toast.error('Payment verification failed.');
        navigate('/checkout');
      }
    });
  }, [navigate]);

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8'>
        <div className='flex flex-col items-center'>
          {loading ? (
            <div className='flex flex-col items-center'>
              <SyncLoader color='#4B9CE2' size={15} />
              <h3 className='mt-4 text-xl text-gray-700'>
                Processing your payment...
              </h3>
            </div>
          ) : (
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-green-600'>
                Payment Verified!
              </h2>
              <p className='text-lg mt-4 text-gray-600'>
                Your payment has been successfully processed. You can now view
                your orders.
              </p>
              <button
                onClick={() => navigate('/orders')}
                className='mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                View Orders
              </button>
            </div>
          )}
        </div>
        <Toaster position='top-right' />
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
