// components/UsersChart.tsx
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
import { fetchUserData } from "../../services/dashboardService";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
  Filler
);

const UsersChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserData();
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Users Over Time",
              data: data.values,
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Users Over Time</h2>
      <div className="relative">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 12,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default UsersChart;
