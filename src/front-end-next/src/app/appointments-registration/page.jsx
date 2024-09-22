"use client";
import { useGetAppointmentsByStatusAndDateQuery, useUpdateAppointmentStatusMutation } from "@/state/api";
import { StepForward, CircleX } from "lucide-react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const AppointmentList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, refetch, isLoading, isError } = useGetAppointmentsByStatusAndDateQuery({
    statuses: "booked",
    date: selectedDate,
    page: currentPage,
    limit: 10,
  });
  console.log(data);
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();

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

  const handleCheckIn = async (appointmentId) => {
    try {
      await updateAppointmentStatus({ id: appointmentId, status: "waiting" }).unwrap();
      refetch();
      toast.success("Patient checkin successfully!");
    } catch (error) {
      console.error("Failed to check in:", error);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-4">
          <h3 className="text-xl font-semibold mb-4 lg:mb-0">Appointment List</h3>
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
        <table class="w-full min-w-[800px] bg-white border border-gray-200">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-4 py-2 text-center border-r">#</th>
              <th class="px-4 py-2 border-r">Date</th>
              <th class="px-4 py-2 border-r">Time</th>
              <th class="px-4 py-2 border-r">Specialties</th>
              <th class="px-4 py-2 border-r">Patient</th>
              <th class="px-4 py-2 border-r">Doctor</th>
              <th class="px-4 py-2 text-center border-r">Status</th>
              <th class="px-4 py-2 text-center">Actions</th>
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
              <tr key={appointment._id} className="border-b">
                <td className="px-4 py-2 text-center">{(currentPage - 1) * 10 + index + 1}</td>
                <td className="px-4 py-2">{new Date(appointment.date_of_visit).toLocaleDateString()}</td>
                <td className="px-4 py-2">{appointment.start_time}</td>
                <td className="px-4 py-2">{appointment.specialized || "N/A"}</td>
                <td className="px-4 py-2">
                  <div className="text-sm">
                    <p className="font-semibold">{appointment.patient.fullname}</p>
                    <p className="text-gray-600">{new Date(appointment.patient.dob).toLocaleDateString()}</p>
                    <a href={`tel:${appointment.patient.phone}`} className="text-blue-500">
                      {appointment.patient.phone}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm">
                    <p className="font-semibold">{appointment.doctor.fullname}</p>
                    <p className="text-gray-600">{new Date(appointment.doctor.dob).toLocaleDateString()}</p>
                    <a href={`tel:${appointment.doctor.phone}`} className="text-blue-500">
                      {appointment.doctor.phone}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`inline-block py-1 px-2 rounded-full text-xs font-semibold ${appointment.status === "booked" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <div className="relative group">
                      <button onClick={() => handleCheckIn(appointment._id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        <StepForward />
                      </button>
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-2 bg-gray-700 text-white text-sm rounded hidden group-hover:block">Check in</div>
                    </div>

                    <div className="relative group">
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        <CircleX />
                      </button>
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-2 bg-gray-700 text-white text-sm rounded hidden group-hover:block">Cancel</div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {/* <tr class="border-b">
              <td class="px-4 py-2 text-center">1</td>
              <td class="px-4 py-2">16/09/2024</td>
              <td class="px-4 py-2">14:30</td>
              <td class="px-4 py-2">Đa khoa</td>
              <td class="px-4 py-2">
                <div class="text-sm">
                  <p class="font-semibold">Nguyễn Thị Hồng</p>
                  <p class="text-gray-600">19/09/1997</p>
                  <a href="tel:0938897355" class="text-blue-500">
                    0938897355
                  </a>
                </div>
              </td>
              <td class="px-4 py-2">
                <div class="text-sm">
                  <p class="font-semibold">Nguyen Thanh Sang</p>
                  <p class="text-gray-600">01/01/1990</p>
                  <a href="tel:0398408935" class="text-blue-500">
                    0398408935
                  </a>
                </div>
              </td>
              <td class="px-4 py-2 text-center">
                <span class="inline-block bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs font-semibold">Đã đặt</span>
              </td>
              <td class="px-4 py-2 text-center">
                <div class="flex justify-center space-x-2">
                  <div class="relative group">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      <StepForward />
                    </button>
                    <div class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-2 bg-gray-700 text-white text-sm rounded hidden group-hover:block">Check in</div>
                  </div>

                  <div class="relative group">
                    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      <CircleX />
                    </button>
                    <div class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-2 bg-gray-700 text-white text-sm rounded hidden group-hover:block">Cancel</div>
                  </div>
                </div>
              </td>
            </tr> */}
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
