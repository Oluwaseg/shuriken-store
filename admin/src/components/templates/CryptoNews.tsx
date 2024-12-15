import React, { useEffect, useState } from 'react';
import { FaBitcoin, FaExternalLinkAlt } from 'react-icons/fa';

interface NewsArticle {
  headline: string;
  summary: string;
  url: string;
  source: string;
  datetime: number;
}

const CryptoNews: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=crypto&token=${
            import.meta.env.VITE_FINNHUB_API_KEY
          }`
        );
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response structure');
        }

        setNews(data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching crypto news:', error);
        setError((error as Error).message);
        setNews([]); // Reset news on error
      }
    };

    fetchCryptoNews();
  }, []);

  return (
    <div className='bg-body-light dark:bg-dark-light shadow-sm rounded-lg h-full'>
      <div className='p-4 border-b flex items-center justify-between'>
        <div className='flex items-center'>
          <FaBitcoin className='text-yellow-500 mr-2' />
          <h4 className='text-lg font-semibold text-gray-800 dark:text-white'>
            Crypto News
          </h4>
        </div>
      </div>
      <div className='h-[252px] overflow-y-auto'>
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
              <p className='text-gray-500'>No crypto news available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoNews;
