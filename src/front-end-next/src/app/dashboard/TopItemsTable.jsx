"use client";
import React from "react";

const TopItemsTable = ({ columns, data, onExport, TimeFilterComponent }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Filter and Export Button Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex-grow">{TimeFilterComponent}</div>
        <button onClick={onExport} className="px-4 py-2 bg-blue-500 text-white rounded-md h-10 text-sm">
          Export to Excel
        </button>
      </div>

      {/* Table display */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="border p-2 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key} className="border p-2">
                  {item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopItemsTable;
