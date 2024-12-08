// components/PatientProfile.js
import { ArrowLeft, Eye, Plus } from "lucide-react";
import React, { useState } from "react";
import MedicalRecordDetail from "./MedicalRecordDetail";
import { useGetMedicaRecordsQuery } from "@/state/api";
import Spinner from "../(components)/Spinner";

// Skeleton Loader for loading effect
const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 rounded-lg shadow-md bg-gray-200 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/4"></div>
        </div>
      ))}
    </div>
  );
};

const PatientProfile = ({ patient, onBack }) => {
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

  // State for filtering
  const [filter, setFilter] = useState("all");

  const filteredData = filter === "valid" ? data?.filter((record) => record.valid) : filter === "untrustworthy" ? data?.filter((record) => !record.valid) : data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Spinner />
        <SkeletonLoader />
      </div>
    );
  }
  if (error) return <div>Error loading medical records</div>;

  return (
    <div className="p-4 space-y-6 bg-white rounded-lg shadow-md md:flex md:gap-6 md:p-6 animate-slideIn">
      {/* Sidebar */}
      <div className="md:w-1/4">
        <button className="flex items-center px-4 py-2 mb-4 text-gray-500 bg-gray-100 rounded-lg hover:text-gray-700" onClick={onBack}>
          <ArrowLeft className="mr-2" /> Back to List
        </button>
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg animate-fadeIn">
          <img src={patient.avatar} alt="Profile" className="w-24 h-24 rounded-full" />
          <h2 className="mt-4 text-lg font-semibold text-center">{patient.fullname}</h2>
          <p className="text-gray-600">{patient.phone}</p>
        </div>
      </div>

      {/* Medical Records */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Medical Records</h3>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-end space-x-2 mb-4">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 ${filter === "all" ? "bg-teal-500 text-white" : "bg-gray-100"} rounded-lg`}>
            All
          </button>
          <button onClick={() => setFilter("valid")} className={`px-4 py-2 ${filter === "valid" ? "bg-teal-500 text-white" : "bg-gray-100"} rounded-lg`}>
            Valid
          </button>
          <button onClick={() => setFilter("untrustworthy")} className={`px-4 py-2 ${filter === "untrustworthy" ? "bg-teal-500 text-white" : "bg-gray-100"} rounded-lg`}>
            Untrustworthy
          </button>
        </div>

        {/* Medical Records List */}
        <div className="space-y-4">
          {filteredData?.length > 0 ? (
            filteredData.map((record, index) => (
              <div key={index} className={`p-4 rounded-lg shadow-md ${record?.valid ? "bg-gray-100" : "bg-orange-100 border border-orange-500"}`}>
                <div className="flex flex-wrap justify-between">
                  {/* Left */}
                  <div className="w-full md:w-3/4">
                    <div className="text-sm text-gray-600">{formatDate(record?.record_date)}</div>
                    <div className="font-semibold">Complaint: {record?.complaint}</div>
                    <div>Diagnosis: {record?.diagnosis}</div>
                    <div>Treatment: {record?.treatment}</div>
                    <div>Prescription: {record?.prescriptions?.map((p) => p.itemName).join(", ")}</div>
                    {!record?.valid && <div className="text-orange-500 font-semibold mt-2">⚠️ This record is untrustworthy.</div>}
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end w-full md:w-auto">
                    <div className="text-sm text-teal-500 mb-2">(Tsh) {record?.cost}</div>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsOpenPopup(true);
                        }}
                      >
                        <Eye />
                      </button>
                      {isOpenPopup && <MedicalRecordDetail isOpen={isOpenPopup} onClose={handleClosePopUp} record={selectedRecord} />}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No medical records found for this patient.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
