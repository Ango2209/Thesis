"use client";
import { StepForward, ChartLine } from "lucide-react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const AppointmentList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  };

  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];
    setSelectedDate(tomorrowDate);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Ví dụ dữ liệu bệnh nhân
  const patients = [
    { id: 1, appointmentDate: "2024-09-16", appointmentTime: "08:00", name: "Nguyễn Văn A", dob: "1980-01-01", phone: "0912345678", status: "Đang chờ" },
    { id: 2, appointmentDate: "2024-09-16", appointmentTime: "09:00", name: "Trần Thị B", dob: "1990-02-02", phone: "0987654321", status: "Đã khám" },
    { id: 3, appointmentDate: "2024-09-16", appointmentTime: "10:00", name: "Lê Văn C", dob: "1985-03-03", phone: "0901234567", status: "Đang chờ" },
    // Thêm dữ liệu bệnh nhân ở đây
  ];

  return (
    <div className="container mx-auto p-6 bg-white">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-4">
          <h3 className="text-xl font-semibold mb-4 lg:mb-0">Examination list</h3>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex space-x-2">
              <button onClick={handleToday} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
                Today
              </button>
              <button onClick={handleTomorrow} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
                Tomorrow
              </button>
            </div>
            <input type="date" value={selectedDate} onChange={handleDateChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">#</th>
              <th className="border-b px-4 py-2 text-left">Date</th>
              <th className="border-b px-4 py-2 text-left">Time</th>
              <th className="border-b px-4 py-2 text-left">Patient</th>
              <th className="border-b px-4 py-2 text-left">Dob</th>
              <th className="border-b px-4 py-2 text-left">Phone number</th>
              <th className="border-b px-4 py-2 text-left">Status</th>
              <th className="border-b px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.id} className="hover:bg-gray-100">
                <td className="border-b px-4 py-2">{index + 1}</td>
                <td className="border-b px-4 py-2">{patient.appointmentDate}</td>
                <td className="border-b px-4 py-2">{patient.appointmentTime}</td>
                <td className="border-b px-4 py-2">{patient.name}</td>
                <td className="border-b px-4 py-2">{patient.dob}</td>
                <td className="border-b px-4 py-2">{patient.phone}</td>
                <td className="border-b px-4 py-2">{patient.status}</td>
                <td className="border-b px-4 py-2">
                  <button className="text-blue-500 hover:underline">
                    <StepForward />
                  </button>
                  <button className="text-red-500 hover:underline ml-2">
                    <ChartLine />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8">
        <ReactPaginate
          previousLabel={"← "}
          nextLabel={" →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center items-center space-x-2"}
          previousLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          nextLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-500 text-white py-2 rounded-md"}
          pageLinkClassName={"px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"}
        />
      </div>
    </div>
  );
};

export default AppointmentList;
