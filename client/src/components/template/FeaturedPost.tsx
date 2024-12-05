import React from 'react';
import { FaCalendar, FaUser } from 'react-icons/fa';

const FeaturedPost: React.FC = () => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
      <img
        src='https://source.unsplash.com/random/800x400?blog'
        alt='Featured post'
        className='w-full h-64 object-cover'
      />
      <div className='p-6'>
        <h2 className='text-3xl font-bold text-gray-800 dark:text-white mb-4'>
          Featured Post Title
        </h2>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
          <FaCalendar className='mr-2' />
          <span className='mr-4'>May 15, 2023</span>
          <FaUser className='mr-2' />
          <span>John Doe</span>
        </div>
        <a
          href='#'
          className='inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300'
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default FeaturedPost;
