"use client";
import { useCreateMedicalTestMutation, useGetServicesByStatusQuery, useUpdateAppointmentStatusMutation } from "@/state/api";
import React, { useState } from "react";
import { toast } from "react-toastify";

const MedicalServiceRequest = ({ isOpen, onClose, doctorId, patientId, appointmentId, doctorName, patientName, refetch }) => {
  const [selectedService, setSelectedService] = useState("");
  const [serviceNote, setServiceNote] = useState("");
  const [initialDiagnosis, setInitialDiagnosis] = useState("");

  const { data: services, error, isLoading } = useGetServicesByStatusQuery("Enabled");
  const [createMedicalTest, { isLoading: isLoadingCreate, isSuccess, isError: isErrorCreate, error: errorCreate }] = useCreateMedicalTestMutation();
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  const handleSubmit = async () => {
    if (selectedService && initialDiagnosis) {
      const createMedicalTestDto = {
        appointment: appointmentId,
        doctor: doctorId,
        patient: patientId,
        initialDiagnosis,
        notes: serviceNote,
        status: "awaiting payment",
        service: services?.find((service) => service.name === selectedService)?._id,
      };

      // Submit requestData to API
      await createMedicalTest(createMedicalTestDto).unwrap();
      await updateAppointmentStatus({ id: appointmentId, status: "awaiting results" }).unwrap();
      refetch();
      setSelectedService("");
      setServiceNote("");
      setInitialDiagnosis("");
      toast.success("Request meical test success");
      onClose();
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-xl font-semibold">Medical Service Request</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Thông tin bác sĩ và bệnh nhân */}
        <div className="mt-4">
          <p>
            <strong>Doctor:</strong> {doctorName}
          </p>
          <p>
            <strong>Patient:</strong> {patientName}
          </p>
        </div>

        {/* Nhập chẩn đoán ban đầu */}
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">
            <span className="text-red-500">*</span>Initial Diagnosis:
          </label>
          <textarea
            value={initialDiagnosis}
            onChange={(e) => setInitialDiagnosis(e.target.value)}
            placeholder="Enter initial diagnosis"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Chọn dịch vụ */}
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Select Service:</label>
          <select value={selectedService} onChange={handleServiceChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
            <option value="">-- Select a service --</option>
            {services?.map((service) => (
              <option key={service._id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ghi chú về dịch vụ */}
        {selectedService && (
          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Service Note for {selectedService}:</label>
            <textarea
              value={serviceNote}
              onChange={(e) => setServiceNote(e.target.value)}
              placeholder={`Enter notes for ${selectedService}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoadingCreate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {isLoadingCreate ? "Creating..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalServiceRequest;
