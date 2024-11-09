import { formatDateToVietnamTime } from "@/lib/dateUtils";
import React from "react";

const RecentPatients = ({ patients }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-gray-500 text-lg mb-2">Recent Patients</h3>
      <ul>
        {patients?.map((patient, index) => (
          <li key={index} className="flex justify-between items-center mb-2 h-16">
            <div className="flex items-center">
              <img src={patient.patient?.avatar} alt={patient.patient?.fullname} className="w-8 h-8 rounded-full mr-2" />
              <div>
                <div className="font-bold">{patient.patient?.fullname}</div>
                <div className="text-sm text-gray-500">{patient.patient?.phone}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{formatDateToVietnamTime(patient?.updatedAt)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentPatients;
