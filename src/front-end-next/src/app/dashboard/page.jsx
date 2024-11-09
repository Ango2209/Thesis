"use client";
import React, { useState } from "react";
import StatsCard from "./StatsCard";
import EarningsReport from "./EarningsReport";
import RecentPatients from "./RecentPatients";
import { useGetLast7DaysRevenueQuery, useGetMonthlyRevenueByYearQuery } from "@/state/api";

const Dashboard = () => {
  const { data: Last7DaysRevenue, refetch, isLoading, isError } = useGetLast7DaysRevenueQuery();
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: monthlyRevenueByYear } = useGetMonthlyRevenueByYearQuery({ year });
  const statsData = [
    {
      title: "Total Patients",
      value: "1600+",
      percentage: -45.06,
      chartData: [30, 50, 20, 40, 60, 40, 70],
      chartColor: "rgba(0, 200, 200, 0.6)",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    {
      title: "Appointments",
      value: "130+",
      percentage: -25.06,
      chartData: [10, 30, 15, 20, 25, 35, 45],
      chartColor: "rgba(255, 205, 86, 0.6)",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    {
      title: "Prescriptions",
      value: "4160+",
      percentage: 65.06,
      chartData: [40, 60, 45, 70, 80, 60, 90],
      chartColor: "rgba(0, 200, 100, 0.6)",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    // {
    //   title: "Total Earnings",
    //   value: "4590$",
    //   percentage: -45.06,
    //   chartData: [20, 40, 30, 50, 70, 50, 90],
    //   chartColor: "rgba(255, 99, 132, 0.6)",
    // },
  ];

  const handleYearChange = (newYear) => {
    setYear(newYear);
    console.log(year);
  };

  const recentPatients = [
    {
      name: "Ngo Test",
      phone: "+1 908 765 432",
      time: "2:00 PM",
      avatar: "https://i.pravatar.cc/150?",
    },
    {
      name: "Thanh Sang",
      phone: "+1 890 123 456",
      time: "2:00 PM",
      avatar: "https://i.pravatar.cc/150?",
    },
    {
      name: "Khoa Luan",
      phone: "+1 908 765 432",
      time: "2:00 PM",
      avatar: "https://i.pravatar.cc/150?",
    },
    {
      name: "Tot Nghiep",
      phone: "+1 234 567 890",
      time: "2:00 PM",
      avatar: "https://i.pravatar.cc/150?",
    },
    {
      name: "David Beckham",
      phone: "+1 234 567 890",
      time: "2:00 PM",
      avatar: "https://i.pravatar.cc/150?",
    },
  ];

  console.log(monthlyRevenueByYear);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
      <StatsCard {...Last7DaysRevenue} chartColor="rgba(255, 99, 132, 0.6)" />
      <div className="col-span-2 lg:col-span-3">
        <EarningsReport selectedYear={year} onYearChange={handleYearChange} chartData={monthlyRevenueByYear?.earningsChartData} title={monthlyRevenueByYear?.title} percentage={24} />
      </div>
      <div className="col-span-1">
        <RecentPatients patients={recentPatients} />
      </div>
    </div>
  );
};

export default Dashboard;
