import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center'>
        <h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
        <p className='text-2xl font-semibold text-gray-600 mb-4'>
          Page Not Found
        </p>
        <p className='text-gray-500 mb-8'>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to='/'
          className='inline-block bg-secondary text-white font-bold py-2 px-4 rounded transition duration-300'
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
