"use client";
import React, { useState, useEffect } from "react";

const TimeFilter = ({ onChange, initialFilterType = "7days", initialYear = new Date().getFullYear() }) => {
  const [filterType, setFilterType] = useState(initialFilterType);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    const today = new Date();
    let startDate, endDate;

    if (filterType === "7days") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      endDate = today;
    } else {
      startDate = new Date(year, selectedMonth - 1, 1);
      endDate = new Date(year, selectedMonth, 0);
    }

    onChange({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      filterType,
      selectedMonth,
      year,
    });
  }, [filterType, selectedMonth, year, onChange]);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="p-1 border border-gray-300 rounded-md h-10 text-sm w-auto flex-shrink-0">
        <option value="7days">Last 7 days</option>
        <option value="month">Specific month</option>
      </select>

      {filterType === "month" && (
        <div className="flex flex-wrap gap-2">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="p-1 border border-gray-300 rounded-md h-10 text-sm w-auto flex-shrink-0">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                Month {month}
              </option>
            ))}
          </select>

          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="p-1 border border-gray-300 rounded-md h-10 w-20 text-sm flex-shrink-0" placeholder="Year" />
        </div>
      )}
    </div>
  );
};

export default TimeFilter;
