"use client";
import { useGetAppointmentsByStatusAndDateQuery, useUpdateAppointmentStatusMutation } from "@/state/api";
import { StepForward, ChartLine } from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

const AppointmentList = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, refetch, isLoading, isError } = useGetAppointmentsByStatusAndDateQuery({
    statuses: "waiting,examining,awaiting results",
    date: selectedDate,
    page: currentPage,
    limit: 10,
  });
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    refetch();
  }, [selectedDate, currentPage, refetch]);

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

  const handleExamine = async (id) => {
    await updateAppointmentStatus({ id: id, status: "examining" }).unwrap();
    router.push(`examine/${id}`);
  };
  const handleContinue = async (id) => {
    router.push(`examine/${id}`);
  };

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
            {isLoading && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Error loading data
                </td>
              </tr>
            )}
            {data?.appointments?.map((appointment, index) => (
              <tr key={appointment._id} className="hover:bg-gray-100">
                <td className="border-b px-4 py-2">{index + 1}</td>
                <td className="border-b px-4 py-2">{new Date(appointment.date_of_visit).toLocaleDateString()}</td>
                <td className="border-b px-4 py-2">{appointment.start_time}</td>
                <td className="border-b px-4 py-2">{appointment.patient.fullname}</td>
                <td className="border-b px-4 py-2">{new Date(appointment.patient.dob).toLocaleDateString()}</td>
                <td className="border-b px-4 py-2">
                  <a href={`tel:${appointment.patient.phone}`} className="text-blue-500">
                    {appointment.patient.phone}
                  </a>
                </td>
                <td className="border-b px-4 py-2">{appointment.status}</td>
                <td className="border-b px-4 py-2">
                  {appointment.status === "waiting" ? (
                    <button onClick={() => handleExamine(appointment._id)} className="text-blue-500 hover:underline">
                      <StepForward />
                    </button>
                  ) : (
                    <button onClick={() => handleContinue(appointment._id)} className="text-red-500 hover:underline ">
                      <ChartLine />
                    </button>
                  )}
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
          pageCount={data?.totalPages}
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
