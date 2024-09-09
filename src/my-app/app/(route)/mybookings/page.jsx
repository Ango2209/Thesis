"use client";
import { useGetAppointmentsPatientIdQuery } from "@/state/api";
import { CalendarIcon, ClockIcon } from "lucide-react";
import React from "react";

export default function MyBookings() {
  const {
    data: bookings,
    error,
    isLoading,
  } = useGetAppointmentsPatientIdQuery("66df122021a2f7d8546a3c5f");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      {bookings && bookings.length > 0 ? (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="p-6 bg-white shadow-md rounded-lg transition-transform transform"
            >
              <div className="flex justify-between">
                {/* Doctor Info */}
                <div className="flex items-start space-x-6 mt-4 ml-16">
                  <img
                    src={`/${booking.doctor.avatar}`}
                    alt={booking.doctor.fullname}
                    className="w-20 h-20 rounded-full border"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Dr. {booking.doctor.fullname}
                    </h3>
                    <p className="text-gray-600">
                      DOB: {new Date(booking.doctor.dob).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Address: {booking.doctor.address}
                    </p>
                    <p className="text-gray-600">
                      Phone: {booking.doctor.phone}
                    </p>
                    <p className="text-gray-600">
                      Email: {booking.doctor.email}
                    </p>
                  </div>
                </div>
                {/* Patient Info */}
                <div className="flex justify-between items-center mb-4 mr-16">
                  <div>
                    <p className="text-gray-600 flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" /> Date of Visit:{" "}
                      {new Date(booking.date_of_visit).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2" /> Start Time:{" "}
                      {booking.start_time} | End Time: {booking.end_time}
                    </p>
                    <p className="text-gray-600">
                      Purpose of Visit: {booking.purpose_visit}
                    </p>
                  </div>
                  <div
                    className={`ml-12 px-3 py-1 rounded-full font-semibold text-sm ${
                      booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              </div>
              {/* Booking Status & Description */}
              <div className="mt-4">
                <p className="text-gray-600">
                  Description: {booking.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-4">
                {booking.status === "Pending" ? (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Reschedule
                  </button>
                ) : (
                  <button
                    onClick={() => openMedicalRecords(booking)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    View Medical Records
                  </button>
                )}
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have no bookings.</p>
      )}
    </div>
  );
}
