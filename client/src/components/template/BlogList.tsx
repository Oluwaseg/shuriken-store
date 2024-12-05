import React from 'react';
import { FaCalendar, FaTag, FaUser } from 'react-icons/fa';

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    excerpt:
      'Learn the basics of React and start building your first component.',
    date: 'May 10, 2023',
    author: 'Jane Smith',
    category: 'React',
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS',
    excerpt:
      'Discover advanced techniques to create stunning designs with Tailwind CSS.',
    date: 'May 8, 2023',
    author: 'Mike Johnson',
    category: 'CSS',
  },
  {
    id: 3,
    title: 'The Power of TypeScript',
    excerpt:
      'Explore how TypeScript can improve your JavaScript development workflow.',
    date: 'May 5, 2023',
    author: 'Emily Brown',
    category: 'TypeScript',
  },
];

const BlogList: React.FC = () => {
  return (
    <div className='col-span-2'>
      <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-6'>
        Latest Posts
      </h2>
      <div className='space-y-8'>
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
          >
            <img
              src={`https://source.unsplash.com/random/800x400?${post.category.toLowerCase()} ||`}
              alt={post.title}
              className='w-full h-48 object-cover'
            />
            <div className='p-6'>
              <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
                {post.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                {post.excerpt}
              </p>
              <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                <FaCalendar className='mr-2' />
                <span className='mr-4'>{post.date}</span>
                <FaUser className='mr-2' />
                <span className='mr-4'>{post.author}</span>
                <FaTag className='mr-2' />
                <span>{post.category}</span>
              </div>
              <a
                href='#'
                className='inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline'
              >
                Read More
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
