// pages/appointments/[id].js
import { useState } from "react";
import { useRouter } from "next/router";

export default function TreatmentDetail() {
  // Dữ liệu mẫu, thay thế bằng dữ liệu API thực
  const appointmentData = {
    patientName: "John Doe",
    patientPhone: "123-456-7890",
    patientImage: "/images/patient.jpg", // Đường dẫn tới hình ảnh bệnh nhân
    complaint: "Severe pain in the lower right molar area",
    diagnosis: "Toothache caused by bacterial infection",
    treatment: "Antibiotic treatment and pain relief prescribed",
    vitalSigns: {
      temperature: "98.6°F",
      bloodPressure: "120/80 mmHg",
    },
    prescriptions: [
      {
        item: "Amoxicillin",
        price: "10.5 Tsh",
        dosage: "1-M/A/E",
        instruction: "After meal",
        quantity: 9,
        amount: "94.5 Tsh",
      },
    ],
    status: "pending", // Trạng thái hiện tại của cuộc hẹn
  };

  // State để lưu trạng thái cuộc hẹn
  const [status, setStatus] = useState(appointmentData.status);

  const handleChangeStatus = (newStatus) => {
    // Gọi API để cập nhật trạng thái cuộc hẹn
    // fetch(`https://api.yourbackend.com/appointments/${id}/status`, {
    //   method: 'POST',
    //   body: JSON.stringify({ status: newStatus })
    // });
    setStatus(newStatus);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Appointment Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Thông tin bệnh nhân */}
        <div className="flex items-center mb-4">
          <img
            src={appointmentData.patientImage}
            alt={appointmentData.patientName}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-bold">{appointmentData.patientName}</h2>
            <p>Phone: {appointmentData.patientPhone}</p>
          </div>
        </div>

        <p>
          <strong>Complaint:</strong> {appointmentData.complaint}
        </p>
        <p>
          <strong>Diagnosis:</strong> {appointmentData.diagnosis}
        </p>
        <p>
          <strong>Treatment:</strong> {appointmentData.treatment}
        </p>
        <p>
          <strong>Vital Signs:</strong> Temperature:{" "}
          {appointmentData.vitalSigns.temperature}, Blood Pressure:{" "}
          {appointmentData.vitalSigns.bloodPressure}
        </p>

        {/* Thông tin đơn thuốc */}
        <h3 className="text-lg font-semibold mt-4">Prescriptions</h3>
        <table className="table-auto w-full mt-2">
          <thead>
            <tr>
              <th>Item</th>
              <th>Item Price (Tsh)</th>
              <th>Dosage</th>
              <th>Instruction</th>
              <th>Quantity</th>
              <th>Amount (Tsh)</th>
            </tr>
          </thead>
          <tbody>
            {appointmentData.prescriptions.map((prescription, index) => (
              <tr key={index}>
                <td>{prescription.item}</td>
                <td>{prescription.price}</td>
                <td>{prescription.dosage}</td>
                <td>{prescription.instruction}</td>
                <td>{prescription.quantity}</td>
                <td>{prescription.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Nút kê đơn thuốc */}
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Prescribe Medication
        </button>

        {/* Nút chat với bệnh nhân */}
        <button className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Chat with Patient
        </button>

        {/* Thay đổi trạng thái cuộc hẹn */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">
            Appointment Status: {status}
          </h3>
          <div className="flex space-x-4 mt-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                status === "done" ? "bg-gray-400" : "bg-blue-500"
              } text-white`}
              onClick={() => handleChangeStatus("done")}
              disabled={status === "done"}
            >
              Done
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                status === "cancel" ? "bg-gray-400" : "bg-red-500"
              } text-white`}
              onClick={() => handleChangeStatus("cancel")}
              disabled={status === "cancel"}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                status === "pending" ? "bg-gray-400" : "bg-yellow-500"
              } text-white`}
              onClick={() => handleChangeStatus("pending")}
              disabled={status === "pending"}
            >
              Pending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
