import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchRevenueData } from '../../services/dashboardService';

const RevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRevenueData();
        const formattedData = data.labels.map(
          (label: string, index: number) => ({
            name: label,
            revenue: data.values[index],
          })
        );

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=''>
      <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4'>
        Revenue Over Time
      </h2>
      <div className='relative'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#ccc' />
            <XAxis dataKey='name' stroke='#6b7280' />
            <YAxis stroke='#6b7280' />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a202c',
                border: 'none',
                borderRadius: '5px',
              }}
              labelStyle={{ color: '#e5e7eb' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend
              verticalAlign='top'
              align='right'
              iconType='square'
              iconSize={12}
              wrapperStyle={{
                paddingRight: 20,
                paddingTop: 10,
                fontSize: 12,
              }}
            />
            <Bar
              dataKey='revenue'
              fill='#ff5722'
              barSize={30}
              radius={[5, 5, 0, 0]} // Rounded top corners
            />
            <ReferenceLine y={0} stroke='#000' strokeDasharray='3 3' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
