"use client";

import { formatDateToVietnamTime } from "@/lib/dateUtils";

export default function PrescriptionDetail({ record }) {
  const { prescriptions: medicineList, patient, doctor, record_date } = record;
  return (
    <div className="flex w-full flex-col gap-6 mb-6">
      {/* Thông Tin Bệnh Nhân và Bác Sĩ */}
      <div className="bg-white border border-gray-200 rounded-md shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thông tin bệnh nhân */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Patient Information</h2>
            <p className="text-sm">
              <span className="font-medium">ID:</span> {patient?.patient_id || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {patient?.fullname || "Unknown"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Phone:</span>{" "}
              <a href={`tel:${patient?.phone}`} className="text-blue-500">
                {patient?.phone || "N/A"}
              </a>
            </p>
          </div>

          {/* Thông tin bác sĩ */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Doctor Information</h2>
            <p className="text-sm">
              <span className="font-medium">ID:</span> {doctor?.doctor_id || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {doctor?.fullname || "Unknown"}
            </p>
          </div>

          {/* Ngày kê đơn */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mt-4 md:mt-0">Prescription Date</h2>
            <p className="text-sm">{formatDateToVietnamTime(record_date)}</p>
          </div>
        </div>
      </div>

      {/* Bảng Thuốc */}
      <div className="w-full overflow-x-auto">
        <p className="text-black text-sm font-medium mb-2">Medicine</p>
        <table className="table-auto w-full bg-white border border-gray-200 rounded-md shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left text-xs font-medium py-3 px-2">Item</th>
              <th className="text-left text-xs font-medium py-3 px-2">Dosage</th>
              <th className="text-left text-xs font-medium py-3 px-2">Instruction</th>
              <th className="text-left text-xs font-medium py-3 px-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {medicineList?.map((medicine, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="text-left text-xs py-4 px-2">{medicine.itemName}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.dosage}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.instraction}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
