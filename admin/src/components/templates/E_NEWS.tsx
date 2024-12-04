import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaNewspaper } from 'react-icons/fa';

interface NewsArticle {
  headline: string;
  summary: string;
  url: string;
  image: string;
  datetime: number;
}

const E_NEWS: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://finnhub.io/api/v1/news?category=ecommerce&token=ct6d061r01qmbqorn8l0ct6d061r01qmbqorn8lg'
        );

        if (!response.ok) {
          throw new Error(`Error fetching news: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response structure');
        }

        setNews(data);
        setError(null); // Clear errors if any
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className='mt-8 bg-white dark:bg-gray-800 shadow-sm rounded-lg'>
      <div className='p-4 border-b flex items-center justify-between'>
        <div className='flex items-center'>
          <FaNewspaper className='text-blue-600 mr-2' />
          <h4 className='text-lg font-semibold text-gray-800 dark:text-white'>
            Ecommerce News
          </h4>
        </div>
      </div>
      <div className='h-[300px] overflow-y-auto'>
        <div className='divide-y'>
          {error ? (
            <div className='flex items-center justify-center h-full'>
              <p className='text-red-500'>Error: {error}</p>
            </div>
          ) : news.length > 0 ? (
            news.map((article, index) => (
              <div
                key={index}
                className='p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out'
              >
                <div className='flex gap-4'>
                  {article.image && (
                    <img
                      src={article.image}
                      alt='News thumbnail'
                      className='w-16 h-16 object-cover rounded flex-shrink-0'
                    />
                  )}
                  <div className='flex-1 min-w-0'>
                    <h5 className='text-sm font-medium text-gray-900 dark:text-white truncate mb-1'>
                      {article.headline}
                    </h5>
                    <p className='text-xs text-gray-500 dark:text-white line-clamp-2 mb-2'>
                      {article.summary || 'No summary available.'}
                    </p>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-gray-400'>
                        {new Date(article.datetime * 1000).toLocaleDateString()}
                      </span>
                      <a
                        href={article.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center text-blue-600 hover:text-blue-700'
                      >
                        Read more
                        <FaExternalLinkAlt className='ml-1 h-3 w-3' />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-500'>No ecommerce news available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default E_NEWS;
