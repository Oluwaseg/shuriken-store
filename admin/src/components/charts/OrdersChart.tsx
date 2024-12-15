import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchOrdersData } from '../../services/dashboardService';

const CumulativeOrdersChart: React.FC = () => {
  const [data, setData] = useState<
    { month: string; orders: number; cumulativeOrders: number }[]
  >([]);
  const [filterMonths, setFilterMonths] = useState<number>(12); // Default to last 12 months

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrdersData();

        // Get the current date and filter based on the selected months
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth(); // Get current month (0-11)

        // Calculate the start month based on the filter
        const startMonth = currentMonth - filterMonths + 1; // For example, for 12 months, it would be 0, for 6 months, it would be 6

        let filteredData: { month: string; orders: number }[] = [];

        // Adjust the date range filter logic for months
        for (let i = 0; i < filterMonths; i++) {
          const monthIndex = (startMonth + i + 12) % 12; // This keeps the index within range (0-11)
          const label = response.labels[monthIndex];
          const orders = response.values[monthIndex];

          filteredData.push({ month: label, orders });
        }

        // Now process the cumulative data
        let cumulative = 0;
        const chartData = filteredData.map((dataItem) => {
          cumulative += dataItem.orders || 0; // Safely handle 0 or NaN values
          return { ...dataItem, cumulativeOrders: cumulative };
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching cumulative orders data:', error);
      }
    };
    fetchData();
  }, [filterMonths]); // Re-fetch data whenever the filter changes

  return (
    <div className=''>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
          Cumulative Orders
        </h2>
        <div>
          {/* Dropdown for selecting the time period */}
          <select
            value={filterMonths}
            onChange={(e) => setFilterMonths(Number(e.target.value))}
            className='px-3 py-1 bg-gray-100 text-gray-700 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-300'
          >
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last 12 Months</option>
          </select>
        </div>
      </div>
      <ResponsiveContainer width='100%' height={300}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            className='stroke-gray-300 dark:stroke-gray-700'
          />
          <XAxis dataKey='month' tick={{ fill: '#6b7280' }} />
          <YAxis tick={{ fill: '#6b7280' }} />
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
            wrapperStyle={{ color: '#6b7280' }}
            onClick={(e: any) => console.log('Legend Clicked:', e)}
          />
          <Area
            type='monotone'
            dataKey='orders'
            name='Orders'
            stroke='#10b981'
            fill='rgba(16, 185, 129, 0.2)'
            strokeWidth={2}
          />
          <Area
            type='monotone'
            dataKey='cumulativeOrders'
            name='Cumulative Orders'
            stroke='#3b82f6'
            fill='rgba(59, 130, 246, 0.2)'
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeOrdersChart;
