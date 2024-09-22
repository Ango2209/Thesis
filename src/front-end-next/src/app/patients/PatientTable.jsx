// components/PatientTable.js
"use client";
import React, { useEffect, useState } from "react";
import { Ellipsis, Eye, Trash, Trash2 } from "lucide-react";
import PatientProfile from "./PatientProfile";
import { useGetPatientsQuery, useGetProductsQuery } from "@/state/api";
import ReactPaginate from "react-paginate";
const PatientTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, error, isLoading } = useGetPatientsQuery({ page, limit });
  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleViewClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

  // Hàm tính tuổi từ ngày sinh
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      {!selectedPatient ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <input type="text" placeholder="Search 'Patients'" className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
            <div className="flex space-x-2">
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                <option>Sort by...</option>
              </select>
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                <option>Gender...</option>
              </select>
              <input type="date" className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
            </div>
            <button className="px-6 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none">Filter</button>
          </div>
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Patient</th>
                <th className="px-4 py-2 border-b">Created At</th>
                <th className="px-4 py-2 border-b">Gender</th>
                <th className="px-4 py-2 border-b">Blood Group</th>
                <th className="px-4 py-2 border-b">Age</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.patients?.map((patient, index) => (
                <tr key={patient.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="flex items-center px-4 py-2 border-b">
                    <img src={patient.avatar} alt={patient.name} className="w-10 h-10 mr-3 rounded-full" />
                    <div>
                      <div className="font-semibold">{patient.fullname}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">{new Date(patient.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${patient.gender ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                      {patient.gender ? "Male" : "Female"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">{patient.blood_group}</td>
                  <td className="px-4 py-2 border-b">{calculateAge(patient.dob)}</td>
                  <td className="p-3 border-b">
                    <button className="text-gray-500 hover:text-teal-600" onClick={() => handleViewClick(patient)}>
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
        <PatientProfile patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
      )}

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

export default PatientTable;
