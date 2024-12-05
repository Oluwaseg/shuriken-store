import React from 'react';
import { FaSearch } from 'react-icons/fa';

const categories = [
  'React',
  'JavaScript',
  'CSS',
  'TypeScript',
  'Node.js',
  'GraphQL',
];

const Sidebar: React.FC = () => {
  return (
    <aside className='space-y-8'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-4'>
          Search
        </h3>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search...'
            className='w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
          <FaSearch className='absolute left-3 top-3 text-gray-400' />
        </div>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-4'>
          Categories
        </h3>
        <ul className='space-y-2'>
          {categories.map((category) => (
            <li key={category}>
              <a
                href='#'
                className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-4'>
          Newsletter
        </h3>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          Subscribe to our newsletter for the latest updates.
        </p>
        <form className='space-y-4'>
          <input
            type='email'
            placeholder='Your email'
            className='w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300'
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
