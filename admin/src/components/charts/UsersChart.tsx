import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchUserData } from '../../services/dashboardService';

const UsersChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserData();
        // Preparing data to be used in the LineChart
        const formattedData = data.labels.map(
          (label: string, index: number) => ({
            name: label,
            users: data.values[index],
          })
        );

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className=''>
      <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4'>
        Users Over Time
      </h2>
      <div className='relative'>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData}>
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
              iconType='circle'
              iconSize={10}
              wrapperStyle={{
                paddingRight: 20,
                paddingTop: 10,
                fontSize: 12,
              }}
            />
            <Line
              type='monotone'
              dataKey='users'
              stroke='#4caf50'
              strokeWidth={3}
              dot={{ stroke: '#4caf50', strokeWidth: 2 }}
              activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
              fill='rgba(76, 175, 80, 0.2)'
            />
            <ReferenceLine y={0} stroke='#000' strokeDasharray='3 3' />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersChart;
