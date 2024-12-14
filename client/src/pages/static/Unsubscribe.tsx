import { useState } from 'react';

export default function Unsubscribe() {
  const [email, setEmail] = useState('');
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Unsubscribe email: ${email}`);
    setIsUnsubscribed(true);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-6 text-center'>
          Unsubscribe
        </h1>
        {!isUnsubscribed ? (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Unsubscribe
            </button>
          </form>
        ) : (
          <div className='text-center'>
            <p className='text-xl text-gray-700 mb-4'>
              You have been successfully unsubscribed.
            </p>
            <p className='text-gray-500'>
              We're sorry to see you go. You can always resubscribe if you
              change your mind.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
