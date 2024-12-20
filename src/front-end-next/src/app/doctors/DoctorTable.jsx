// components/DoctorTable.js
"use client";
import React, { useState } from "react";
import { Ellipsis, Eye, Trash, Trash2 } from "lucide-react";
import { useGetDoctorsQuery } from "@/state/api";
import DoctorProfile from "./DoctorProfile";
const DoctorTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, error, isLoading } = useGetDoctorsQuery();
  const [patients] = useState([
    {
      id: 1,
      name: "Nguyen Van Ngo",
      phone: "+1 234 567 890",
      createdAt: "20 Aug 2021",
      gender: "Male",
      bloodGroup: "A+",
      age: 25,
      avatar: "/path/to/avatar1.jpg", // Replace with actual paths or URLs
    },
    {
      id: 2,
      name: "Nguyen Thanh Sang",
      phone: "+1 456 789 123",
      createdAt: "22 Nov 2023",
      gender: "Female",
      bloodGroup: "B+",
      age: 34,
      avatar: "/path/to/avatar2.jpg",
    },
    // Add more patient data as needed
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleViewClick = (patient) => {
    setSelectedPatient(patient);
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      {!selectedPatient ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search 'Patients'"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <div className="flex space-x-2">
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                <option>Sort by...</option>
              </select>
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                <option>Gender...</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button className="px-6 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none">
              Filter
            </button>
          </div>
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Doctor</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Age</th>
                <th className="px-4 py-2 border-b">Phone</th>
                <th className="px-4 py-2 border-b">Year of Experience</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((patient, index) => (
                <tr key={patient.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="flex items-center px-4 py-2 border-b">
                    <div>
                      <div className="font-semibold">{patient.fullname}</div>
                      <div className="text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">{patient.email}</td>

                  <td className="px-4 py-2 border-b">
                    {calculateAge(patient.dob)}
                  </td>
                  <td className="px-4 py-2 border-b">{patient.phone}</td>
                  <td className="px-4 py-2 border-b">
                    {patient?.year_of_experience}
                  </td>
                  <td className="p-3 border-b">
                    <button
                      className="text-gray-500 hover:text-teal-600"
                      onClick={() => handleViewClick(patient)}
                    >
                      <Eye />
                    </button>
                    <button className="ml-4 text-gray-500 hover:text-red-600">
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <DoctorProfile
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default DoctorTable;
