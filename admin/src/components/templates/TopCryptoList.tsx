import React, { useEffect, useState } from 'react';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const TopCryptoList: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch crypto data');
        }
        const data = await response.json();
        setCryptoData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching crypto data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  if (isLoading) {
    return <div className='text-center py-4'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center py-4 text-red-500'>{error}</div>;
  }

  return (
    <div className='h-full flex flex-col '>
      <h3 className='text-lg font-semibold mb-2'>Top Cryptocurrencies</h3>
      <div className='overflow-y-auto flex-grow'>
        <table className='min-w-full'>
          <thead>
            <tr className='text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              <th className='py-2'>Name</th>
              <th className='py-2'>Price</th>
              <th className='py-2'>24h Change</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {cryptoData.map((crypto) => (
              <tr
                key={crypto.id}
                className='hover:bg-gray-50 dark:hover:bg-gray-700'
              >
                <td className='py-2 flex items-center space-x-2'>
                  {/* Display image from API */}
                  <img
                    src={crypto.image}
                    alt={`${crypto.name} logo`}
                    className='w-8 h-8 rounded-full'
                  />
                  <span>{crypto.name}</span>
                </td>
                <td className='py-2'>
                  ${crypto.current_price.toLocaleString()}
                </td>
                <td
                  className={`py-2 ${
                    crypto.price_change_percentage_24h >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCryptoList;
