// components/PatientProfile.js
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import MedicalRecordDetail from "./MedicalRecordDetail";
import { useGetMedicaRecordsQuery } from "@/state/api";

const PatientProfile = ({ patient, onBack }) => {
  // Dummy medical records
  const { data, error, isLoading } = useGetMedicaRecordsQuery(patient._id);
  console.log(data);
  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };
  const records = [
    {
      date: "13, Jan 2021",
      complaint: "Bleeding Gums, Toothache, bad breath",
      diagnosis: "Gingivitis, Caries, Periodontitis",
      treatment: "Filling, Post&Core, Implant, Extraction",
      prescription: "Paracetamol, Amoxicillin, Ibuprofen, Asp...",
      cost: "150000",
    },
    {
      date: "13, Jan 2021",
      complaint: "Bleeding Gums, Toothache, bad breath",
      diagnosis: "Gingivitis, Caries, Periodontitis",
      treatment: "Filling, Post&Core, Implant, Extraction",
      prescription: "Paracetamol, Amoxicillin, Ibuprofen, Asp...",
      cost: "150000",
    },
    {
      date: "13, Jan 2021",
      complaint: "Bleeding Gums, Toothache, bad breath",
      diagnosis: "Gingivitis, Caries, Periodontitis",
      treatment: "Filling, Post&Core, Implant, Extraction",
      prescription: "Paracetamol, Amoxicillin, Ibuprofen, Asp...",
      cost: "150000",
    },
    // ...other records
  ];
  const popupData = {
    date: "12 May 2021",
    complaint: "Bleeding Gums, Toothache, bad breath",
    diagnosis: "Gingivitis, Caries, Periodontitis",
    treatment: "Filling, Post&Core, Implant, Extraction",
    vitalSigns: "Blood Pressure: 120/80 mmHg, Pulse Rate: 80 bpm, Respiratory Rate: 16 bpm, Temperature: 36.5 °C, Oxygen Saturation: 98%",
    prescriptions: [
      {
        item: "Paracetamol",
        itemPrice: 1000,
        dosage: "1 - M/A/E",
        instruction: "After meal",
        quantity: 1,
        amount: 1000,
      },
      {
        item: "Amoxicillin",
        itemPrice: 2300,
        dosage: "2 - M/A/E",
        instruction: "After meal",
        quantity: 2,
        amount: 4600,
      },
      {
        item: "Ibuprofen",
        itemPrice: 5000,
        dosage: "3 - M/A/E",
        instruction: "Before meal",
        quantity: 3,
        amount: 15000,
      },
    ],
  };

  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const handleClosePopUp = () => {
    setIsOpenPopup(false);
    console.log("After closing, isOpenPopup:", isOpenPopup);
  };
  return (
    <div className="flex gap-6 p-6 bg-white rounded-lg shadow-md animate-slideIn">
      <div className="w-1/4">
        <button className="flex items-center px-4 py-2 mb-4 text-gray-500 bg-gray-100 rounded-lg hover:text-gray-700" onClick={onBack}>
          <ArrowLeft className="mr-2" /> Back to List
        </button>
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg animate-fadeIn">
          <img src={`https://i.pravatar.cc/150?img=${patient.id}`} alt="Profile" className="w-24 h-24 rounded-full" />
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
                  <div className="text-sm text-gray-600">{formatDate(record.record_date)}</div>
                  <div className="font-semibold">Complaint: {record.complaint}</div>
                  <div>Diagnosis: {record.diagnosis}</div>
                  <div>Treatment: {record.treatment}</div>
                  <div>Prescription: {record.prescription}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-teal-500">(Tsh) {record.cost}</div>
                  <div className="flex mt-4 space-x-2">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsOpenPopup(true)}>
                      <Eye />
                    </button>
                    <MedicalRecordDetail isOpen={isOpenPopup} onClose={handleClosePopUp} record={record} />
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
