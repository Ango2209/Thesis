import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
const StatsCard = ({ title, value, percentage, chartData, chartColor }) => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: title,
        data: chartData,
        backgroundColor: chartColor,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      bar: {
        borderRadius: 5,
      },
    },
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-md flex flex-col items-center">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <div className="w-full h-16 mb-2">
        <Bar data={data} options={options} />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div
        className={`text-sm ${
          percentage > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {percentage > 0 ? "↑" : "↓"} {Math.abs(percentage)}%
      </div>
    </div>
  );
};

export default StatsCard;
