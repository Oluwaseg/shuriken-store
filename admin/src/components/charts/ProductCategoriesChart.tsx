import React, { useEffect, useState } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { fetchCategoriesWithProductCount } from '../../services/dashboardService';

const ProductCategoriesChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await fetchCategoriesWithProductCount();

        // Process data for RadarChart
        const data = categories.map((category: any) => ({
          subject: category.name,
          productCount: category.productCount,
        }));

        setChartData(data);
      } catch (error) {
        console.error('Error fetching categories data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=''>
      <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4'>
        Product Categories by Count
      </h2>
      <div className='relative'>
        <ResponsiveContainer width='100%' height={300}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey='subject' stroke='#6b7280' />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke='#6b7280' />
            <Radar
              name='Product Count'
              dataKey='productCount'
              stroke='#10b981'
              fill='#10b981'
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a202c',
                border: 'none',
                borderRadius: '5px',
              }}
              labelStyle={{ color: '#e5e7eb' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductCategoriesChart;
