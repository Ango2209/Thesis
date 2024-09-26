"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const AddServiceModal = ({ isOpen, onClose, refetch }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Default to cash

  // Dữ liệu cứng tạm thời cho danh sách dịch vụ, bác sĩ, bệnh nhân và lịch hẹn
  const service = { id: 1, name: "Blood Test", price: "200,000 VND" };
  const doctor = { id: 1, name: "Dr. John Doe" };
  const patient = { id: 1, name: "Alice Johnson", code: "PT12345", phone: "0123456789" };
  const appointmentDate = "2024-09-22";

  const handleSubmit = async () => {
    try {
      console.log({
        service,
        doctor,
        patient,
        appointmentDate,
        paymentMethod,
      });

      toast.success("Medical Test created successfully!");
      refetch();
      onClose();
    } catch (err) {
      toast.error("Failed to create Medical Test. Please try again.");
      console.error("Error creating Medical Test:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mx-4 md:mx-8 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h1 className="text-2xl font-semibold text-center mb-6">Invoice</h1>

        <div className="flex justify-between mb-4">
          {/* Bên trái: Thông tin bệnh nhân */}
          <div className="w-1/2 pr-2 bg-blue-50 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Patient Information</h2>
            <div className="flex justify-between py-2">
              <span className="font-medium">Name:</span>
              <span>{patient.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Patient Code:</span>
              <span>{patient.code}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Phone:</span>
              <span>{patient.phone}</span>
            </div>
          </div>

          {/* Bên phải: Thông tin bác sĩ */}
          <div className="w-1/2 pl-2 bg-green-50 p-4 rounded-lg shadow-md ml-4">
            {" "}
            {/* Thêm margin-left */}
            <h2 className="text-lg font-semibold">Doctor Information</h2>
            <div className="flex justify-between py-2">
              <span className="font-medium">Name:</span>
              <span>{doctor.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Doctor Code:</span>
              <span>{doctor.id}</span>
            </div>
          </div>
        </div>

        {/* Ngày hẹn */}
        <div className="py-4">
          <h2 className="text-lg font-semibold">Appointment Date</h2>
          <div className="flex justify-between py-2">
            <span className="font-medium">Date:</span>
            <span>{appointmentDate}</span>
          </div>
        </div>

        {/* Dịch vụ */}
        <div className="py-4">
          <h2 className="text-lg font-semibold">Service Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-300 text-left py-2">Service</th>
                  <th className="border-b border-gray-300 text-left py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-300 py-2">{service.name}</td>
                  <td className="border-b border-gray-300 py-2">{service.price}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="py-4">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} className="mr-2" />
              Cash
            </label>
            <label className="flex items-center">
              <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === "transfer"} onChange={() => setPaymentMethod("transfer")} className="mr-2" />
              Bank Transfer
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition" onClick={onClose}>
            Cancel
          </button>
          <button className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition" onClick={handleSubmit}>
            Confirm Payment
            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
