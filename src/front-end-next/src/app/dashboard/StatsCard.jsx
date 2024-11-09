import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Đăng ký plugin
Chart.register(ChartDataLabels);

const StatsCard = ({ title, value, percentage, chartData, chartColor, labels }) => {
  // Định dạng các nhãn ngày thành dd/MM
  const formattedLabels = labels?.map((label) => {
    const date = new Date(label);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  });

  const data = {
    labels: formattedLabels,
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
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: "#4B5563",
          font: {
            size: 16, // Tăng kích thước phông chữ của nhãn
          },
        },
      },
      y: {
        display: false,
        suggestedMax: Math.max(...chartData) * 1.2, // Tạo khoảng trống phía trên các cột
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "#000", // Màu chữ của giá trị trên cột
        anchor: "end",
        align: "end", // Canh chỉnh giá trị nằm ngay trên cột
        offset: -2, // Tạo một khoảng cách nhỏ giữa giá trị và đầu cột
        font: {
          size: 14, // Tăng kích thước chữ hiển thị giá trị
          weight: "bold",
        },
        padding: {
          top: 6,
        },
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
      <h3 className="text-gray-500 text-lg mb-2">{title}</h3> {/* Tăng kích thước tiêu đề */}
      <div className="w-full h-48 mb-4">
        {" "}
        {/* Tăng chiều cao của biểu đồ */}
        <Bar data={data} options={options} />
      </div>
      <div className="text-3xl font-bold">{value}</div> {/* Tăng kích thước giá trị tổng */}
      <div className={`text-lg ${percentage > 0 ? "text-green-500" : "text-red-500"}`}>
        {percentage > 0 ? "↑" : "↓"} {Math.abs(percentage)}%
      </div>
    </div>
  );
};

export default StatsCard;
