import React from "react";
import { Line } from "react-chartjs-2";

const EarningsReport = ({ chartData, percentage }) => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: chartData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-gray-500 text-sm mb-2">Earning Reports</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-500">5.44%</span>
        <span
          className={`text-sm ${
            percentage > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentage > 0 ? "+" : "-"}
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default EarningsReport;
