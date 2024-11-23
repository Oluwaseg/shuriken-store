// components/RevenueChart.tsx
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
import { fetchRevenueData } from "../../services/dashboardService";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
  Filler
);

const RevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRevenueData(); // Adjust this to your API call
        setChartData({
          labels: data.labels, // Array of labels (e.g., months)
          datasets: [
            {
              label: "Revenue Over Time",
              data: data.values, // Array of values corresponding to the labels
              borderColor: "#ff5722",
              backgroundColor: "rgba(255, 87, 34, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default RevenueChart;
