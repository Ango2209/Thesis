// components/PatientProfile.js
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import MedicalRecordDetail from "./MedicalRecordDetail";
import { useGetMedicaRecordsQuery } from "@/state/api";

const PatientProfile = ({ patient, onBack }) => {
  // Dummy medical records
  const { data, error, isLoading } = useGetMedicaRecordsQuery(patient._id);
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  const [selectedRecord, setSelectedRecord] = useState(null);

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const handleClosePopUp = () => {
    setIsOpenPopup(false);
  };
  return (
    <div className="flex gap-6 p-6 bg-white rounded-lg shadow-md animate-slideIn">
      <div className="w-1/4">
        <button
          className="flex items-center px-4 py-2 mb-4 text-gray-500 bg-gray-100 rounded-lg hover:text-gray-700"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2" /> Back to List
        </button>
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg animate-fadeIn">
          <img
            src={`https://i.pravatar.cc/150?img=${patient.id}`}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <h2 className="mt-4 text-lg font-semibold">{patient.fullname}</h2>
          <p className="text-gray-600">{patient.phone}</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <h3 className="text-lg font-semibold">Medical Record</h3>
          <button className="flex items-center px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600">
            <Plus className="mr-2" /> New Record
          </button>
        </div>
        <div className="space-y-4 animate-fadeIn">
          {data?.map((record, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-600">
                    {formatDate(record.record_date)}
                  </div>
                  <div className="font-semibold">
                    Complaint: {record.complaint}
                  </div>
                  <div>Diagnosis: {record.diagnosis}</div>
                  <div>Treatment: {record.treatment}</div>
                  <div>
                    Prescription:{" "}
                    {record.prescriptions.map((p) => p.itemName).join(",")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-teal-500">
                    (Tsh) {record.cost}
                  </div>
                  <div className="flex mt-4 space-x-2">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsOpenPopup(true);
                      }}
                    >
                      <Eye />
                    </button>
                    {isOpenPopup && (
                      <MedicalRecordDetail
                        isOpen={isOpenPopup}
                        onClose={handleClosePopUp}
                        record={selectedRecord}
                      />
                    )}
                    <button className="text-gray-500 hover:text-red-500">
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
