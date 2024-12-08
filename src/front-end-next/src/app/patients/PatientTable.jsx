"use client";
import React, { useState } from "react";
import { Eye, Trash } from "lucide-react";
import PatientProfile from "./PatientProfile";
import { useGetPatientsQuery } from "@/state/api";
import ReactPaginate from "react-paginate";
import Spinner from "../(components)/Spinner";

const PatientTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, error, isLoading } = useGetPatientsQuery({ page, limit });
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleViewClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load data. Please try again later.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {!selectedPatient ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input type="text" placeholder="Search patients" className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              <option>Sort by...</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              <option>Gender...</option>
            </select>
            <input type="date" className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" />
            <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Filter</button>
          </div>

          {/* Patient Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
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
                    <td className="px-4 py-2 border-b flex items-center">
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
                    <td className="px-4 py-2 border-b">
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
        </>
      ) : (
        <PatientProfile patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
      )}

      {/* Pagination */}
      <div className="mt-8">
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
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
