"use client";
import React, { useState } from "react";
import StatsCard from "./StatsCard";
import EarningsReport from "./EarningsReport";
import RecentPatients from "./RecentPatients";
import { useGetLast7DaysfinishedAppointmentsQuery, useGetLast7DaysRevenueQuery, useGetMonthlyRevenueByYearQuery, useGetRecentPatientQuery } from "@/state/api";

const Dashboard = () => {
  const { data: last7DaysRevenue } = useGetLast7DaysRevenueQuery();
  const { data: last7DaysfinishedAppointments } = useGetLast7DaysfinishedAppointmentsQuery();
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: monthlyRevenueByYear } = useGetMonthlyRevenueByYearQuery({ year });
  const { data: recentPatients } = useGetRecentPatientQuery({});

  const chartColors = ["rgba(0, 200, 100, 0.6)", "rgba(255, 205, 86, 0.6)", "rgba(255, 99, 132, 0.6)"];

  const handleYearChange = (newYear) => {
    setYear(newYear);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {/* Hàng đầu tiên hiển thị tối đa 4 cột StatsCard */}
      <div className="col-span-1 h-full">
        <StatsCard {...last7DaysfinishedAppointments} chartColor="rgba(0, 200, 200, 0.6)" />
      </div>
      {last7DaysRevenue?.map((stat, index) => (
        <div key={index} className="col-span-1 h-full">
          <StatsCard {...stat} chartColor={chartColors[index]} />
        </div>
      ))}

      {/* Earnings report và Recent patients trên hàng thứ hai */}
      <div className="col-span-1 lg:col-span-2 xl:col-span-3 h-full">
        <EarningsReport selectedYear={year} onYearChange={handleYearChange} chartData={monthlyRevenueByYear?.earningsChartData} title={monthlyRevenueByYear?.title} percentage={24} />
      </div>
      <div className="col-span-1 lg:col-span-1 xl:col-span-1 h-full">
        <RecentPatients patients={recentPatients} />
      </div>
    </div>
  );
};

export default Dashboard;
