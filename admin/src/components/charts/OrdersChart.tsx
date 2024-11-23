// components/OrdersChart.tsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { fetchOrdersData } from "../../services/dashboardService";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
  Filler
);

const OrdersChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrdersData(); // Adjust this to your API call
        setChartData({
          labels: data.labels, // Array of labels (e.g., months)
          datasets: [
            {
              label: "Orders Over Time",
              data: data.values, // Array of values corresponding to the labels
              borderColor: "#2196f3",
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Orders Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default OrdersChart;
