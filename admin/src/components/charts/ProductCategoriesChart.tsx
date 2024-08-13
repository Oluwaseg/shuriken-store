import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip } from "chart.js";
import { fetchCategoriesWithProductCount } from "../../services/dashboardService";

ChartJS.register(ArcElement, Title, Tooltip);

const ProductCategoriesChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await fetchCategoriesWithProductCount();

        const labels = categories.map((category: any) => category.name);
        const values = categories.map((category: any) => category.productCount);

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#cc65fe",
                "#ffce56",
                "#4caf50",
                "#2196f3",
                "#9c27b0",
                "#ff9800",
                "#795548",
                "#8bc34a",
                "#ff5722",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Categories by Product Count
      </h2>
      <Pie data={chartData} />
    </div>
  );
};

export default ProductCategoriesChart;
