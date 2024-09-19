"use client";
import React, { useState } from "react";
import { Eye, Trash } from "lucide-react";
import {
  useGetMedicinesQuery,
  useGetMedicinesAvailableQuery,
  useGetBatchesByMedicineIdQuery,
  useAddBatchsMutation,
  useGetAppointmentsDoctorIdQuery,
} from "@/state/api";
import TreatmentDetail from "./TreatmentDetail";

const TreatmentTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: medicines, error, isLoading } = useGetMedicinesQuery();
  const { data: appointments } = useGetAppointmentsDoctorIdQuery(
    "66c326e038ca0fcd63974456"
  );

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [batches, setBatches] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [batchQuantity, setBatchQuantity] = useState(0);

  const handleViewClick = (medicine) => {
    setSelectedMedicine(medicine);
    // Fetch the batches for the selected medicine
    fetchBatches(medicine.id);
  };

  const fetchBatches = async (medicineId) => {
    const { data: batchesData } = useGetBatchesByMedicineIdQuery(medicineId);
    setBatches(batchesData);
  };

  const handleAddBatch = async () => {
    if (!batchName || batchQuantity <= 0 || !selectedMedicine) return;

    await addBatchs({
      name: batchName,
      quantity: batchQuantity,
      medicineId: selectedMedicine.id,
    });

    // Clear the form and fetch updated batches
    setBatchName("");
    setBatchQuantity(0);
    fetchBatches(selectedMedicine.id);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      {!selectedMedicine ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search 'medicines'"
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
          <h3 className="text-lg font-semibold">Available Medicines</h3>
          <table className="w-full text-left table-auto mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Patient</th>
                <th className="px-4 py-2 border-b">Purpose of visit</th>
                <th className="px-4 py-2 border-b">Date of visit</th>
                <th className="px-4 py-2 border-b">Start time</th>
                <th className="px-4 py-2 border-b">End time</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments?.map((appointment, index) => (
                <tr key={appointment.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">
                    {appointment.patient_name}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {appointment.purpose_visit}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {appointment.date_of_visit}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {appointment.start_time}
                  </td>
                  <td className="px-4 py-2 border-b">{appointment.end_time}</td>
                  <td className="px-4 py-2 border-b">{appointment.status}</td>
                  <td className="px-4 py-2 border-b">
                    {appointment.description}
                  </td>
                  <td className="p-3 border-b">
                    <button
                      className="text-gray-500 hover:text-teal-600"
                      onClick={() => handleViewClick(appointment)}
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
        <TreatmentDetail />
      )}
    </div>
  );
};

export default TreatmentTable;
