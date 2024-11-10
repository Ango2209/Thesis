"use client";
import React, { useState } from "react";
import StatsCard from "./StatsCard";
import EarningsReport from "./EarningsReport";
import RecentPatients from "./RecentPatients";
import {
  useGetLast7DaysfinishedAppointmentsQuery,
  useGetLast7DaysRevenueQuery,
  useGetMonthlyRevenueByYearQuery,
  useGetRecentPatientQuery,
  useGetTopItemsQuery,
  useLazyExportMedicinesToExcelQuery,
  useLazyExportServicesToExcelQuery,
} from "@/state/api";
import TimeFilter from "./TimeFilter";
import TopItemsTable from "./TopItemsTable";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { data: last7DaysRevenue } = useGetLast7DaysRevenueQuery();
  const { data: last7DaysfinishedAppointments } = useGetLast7DaysfinishedAppointmentsQuery();
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: monthlyRevenueByYear } = useGetMonthlyRevenueByYearQuery({ year });
  const { data: recentPatients } = useGetRecentPatientQuery({});
  const [medicineTimeRange, setMedicineTimeRange] = useState({
    startDate: null,
    endDate: null,
    filterType: "7days",
  });
  const [triggerExport] = useLazyExportMedicinesToExcelQuery();
  const [triggerExportServices] = useLazyExportServicesToExcelQuery();

  const [serviceTimeRange, setServiceTimeRange] = useState({
    startDate: null,
    endDate: null,
    filterType: "7days",
  });

  const {
    data: topMedicinesData,
    isLoading: loadingMedicines,
    error: errorMedicines,
  } = useGetTopItemsQuery({
    startDate: medicineTimeRange.startDate,
    endDate: medicineTimeRange.endDate,
    type: "medicine",
  });

  const {
    data: topServicesData,
    isLoading: loadingServices,
    error: errorServices,
  } = useGetTopItemsQuery({
    startDate: serviceTimeRange.startDate,
    endDate: serviceTimeRange.endDate,
    type: "service",
  });

  const columns = [
    { key: "name", label: "Name" },
    { key: "totalQuantity", label: "Quantity Sold" },
  ];

  const chartColors = ["rgba(0, 200, 100, 0.6)", "rgba(255, 205, 86, 0.6)", "rgba(255, 99, 132, 0.6)"];

  const handleYearChange = (newYear) => {
    setYear(newYear);
  };

  // Function to export medicines data to Excel
  const handleExportMedicinesToExcel = () => {
    triggerExport({ startDate: medicineTimeRange.startDate, endDate: medicineTimeRange.endDate });
  };

  // Function to export services data to Excel
  const handleExportServicesToExcel = () => {
    triggerExportServices({ startDate: serviceTimeRange.startDate, endDate: serviceTimeRange.endDate });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 auto-rows-[minmax(200px, auto)]">
      {/* Stats Cards */}
      <div className="col-span-1 h-full min-h-[200px] bg-white p-4 rounded-lg shadow-md flex flex-col">
        <StatsCard {...last7DaysfinishedAppointments} chartColor="rgba(0, 200, 200, 0.6)" />
      </div>
      {last7DaysRevenue?.map((stat, index) => (
        <div key={index} className="col-span-1 h-full min-h-[200px] bg-white p-4 rounded-lg shadow-md flex flex-col">
          <StatsCard {...stat} chartColor={chartColors[index]} />
        </div>
      ))}

      {/* Earnings Report */}
      <div className="col-span-1 lg:col-span-2 xl:col-span-3 h-full min-h-[200px] bg-white p-6 rounded-lg shadow-md flex flex-col">
        <EarningsReport selectedYear={year} onYearChange={handleYearChange} chartData={monthlyRevenueByYear?.earningsChartData} title={monthlyRevenueByYear?.title} percentage={24} />
      </div>

      {/* Recent Patients */}
      <div className="col-span-1 lg:col-span-1 xl:col-span-1 h-full min-h-[200px] bg-white p-6 rounded-lg shadow-md flex flex-col">
        <RecentPatients patients={recentPatients} />
      </div>

      {/* Top Medicines Table */}
      <div className="col-span-1 lg:col-span-2 xl:col-span-2 h-full min-h-[200px] bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Top 5 Best-Selling Medicines</h2>
        <TopItemsTable
          columns={columns}
          data={loadingMedicines || errorMedicines ? [] : topMedicinesData || []}
          onExport={handleExportMedicinesToExcel}
          TimeFilterComponent={<TimeFilter onChange={setMedicineTimeRange} />}
        />
      </div>

      {/* Top Services Table */}
      <div className="col-span-1 lg:col-span-2 xl:col-span-2 h-full min-h-[200px] bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Top 5 Most-Used Services</h2>
        <TopItemsTable
          columns={columns}
          data={loadingServices || errorServices ? [] : topServicesData || []}
          onExport={handleExportServicesToExcel}
          TimeFilterComponent={<TimeFilter onChange={setServiceTimeRange} />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
