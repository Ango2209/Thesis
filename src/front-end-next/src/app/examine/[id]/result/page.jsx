"use client";
import { useState } from "react";
import MedicineTable from "./MedicineTable";
import Attachments from "./Attachments";
import Link from "next/link";
import { useAddMedicalRecordMutation, useGetAppointmentQuery, useSearchMedicinesQuery } from "@/state/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function NewMedicalRecord({ params }) {
  const router = useRouter();
  const { id } = params;
  const { data, isError, isLoading } = useGetAppointmentQuery(id);

  const [complaint, setComplaint] = useState("");
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [vitalSigns, setVitalSigns] = useState("");
  const [treatments, setTreatments] = useState({
    rootCanal: false,
    teethWhitening: false,
    dentalImplants: false,
    dentalCrowns: false,
    dentalBridges: false,
    dentalVeneers: false,
  });
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    medicineId: "",
    name: "",
    daysOfUse: "",
    instraction: "After Meal",
    dosageQuantity: "",
    dosage: {
      morning: false,
      afternoon: false,
      evening: false,
    },
  });
  const [attachment, setAttachment] = useState(null);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTreatments((prev) => ({ ...prev, [name]: checked }));
  };

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleDosageChange = (e) => {
    const { name, checked } = e.target;
    setNewMedicine((prev) => ({
      ...prev,
      dosage: { ...prev.dosage, [name]: checked },
    }));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { data: suggestions, isLoading: searchLoading, error } = useSearchMedicinesQuery(searchQuery);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setDropdownOpen(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    setNewMedicine((prev) => ({ ...prev, name: suggestion.name, medicineId: suggestion._id }));
    setSearchQuery(""); // Clear search query
    setDropdownOpen(false); // Close dropdown
  };

  const handleReset = () => {
    setNewMedicine({
      medicineId: "",
      name: "",
      daysOfUse: "",
      instraction: "After Meal",
      dosageQuantity: "",
      dosage: {
        morning: false,
        afternoon: false,
        evening: false,
      },
    });
    setSearchQuery("");
  };

  const handleAddMedicine = () => {
    if (
      newMedicine.name &&
      newMedicine.daysOfUse &&
      parseInt(newMedicine.daysOfUse) > 0 &&
      newMedicine.dosageQuantity &&
      (newMedicine.dosage.morning || newMedicine.dosage.afternoon || newMedicine.dosage.evening)
    ) {
      const dosageTimesPerDay = [newMedicine.dosage.morning ? "M" : "", newMedicine.dosage.afternoon ? "A" : "", newMedicine.dosage.evening ? "E" : ""].filter(Boolean).length;

      const quantity = newMedicine.dosageQuantity * dosageTimesPerDay * newMedicine.daysOfUse;
      const dosageParts = [newMedicine.dosage.morning ? "M" : "", newMedicine.dosage.afternoon ? "A" : "", newMedicine.dosage.evening ? "E" : ""].filter(Boolean);

      const dosage = `${newMedicine.dosageQuantity}-${dosageParts.join("/")}`;
      const { name, dosageQuantity, daysOfUse, ...medicineData } = newMedicine;
      const newMedicineEntry = {
        itemName: name,
        ...medicineData,
        dosage,
        quantity,
      };
      setMedicines((prev) => [...prev, newMedicineEntry]);
      handleReset();
    } else {
      toast.error("Please fill all required fields and select at least one dosage time.");
    }
  };

  const handleRemoveMedicine = () => {
    setNewMedicine((prev) => ({ ...prev, name: "" }));
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

  const [addMedicalRecord, { isLoading: isLoadingCreate, isSuccess, isError: isErrorCreate, error: errorCreate }] = useAddMedicalRecordMutation();

  const resetForm = () => {
    setComplaint("");
    setNotes("");
    setDiagnosis("");
    setVitalSigns("");
    setTreatments({
      rootCanal: false,
      teethWhitening: false,
      dentalImplants: false,
      dentalCrowns: false,
      dentalBridges: false,
      dentalVeneers: false,
    });
    setAttachment(null);
    setMedicines([]);
  };

  const handleSubmit = async () => {
    if (!complaint || !diagnosis) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    try {
      const formData = {
        doctor: data?.doctor?._id,
        record_date: new Date().toISOString(),
        complaint,
        notes,
        diagnosis,
        vital_signs: vitalSigns,
        treatments: "",
        prescriptions: medicines,
        attachments: [],
      };

      await addMedicalRecord({ patientId: data?.patient?._id, record: formData }).unwrap();
      toast.success("Medical record created successfully!");
      //change status

      router.push(`/examine/${id}`);
    } catch (error) {
      toast.error("Failed to create medical record. Please check your input and try again.");
      console.error("Failed to medical record", error);
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-2">
      <div className="flex items-center gap-4">
        <Link className="bg-white border border-subMain border-dashed rounded-lg py-2 px-3 text-md hover:bg-gray-100" href={`/examine/${id}`}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"></path>
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold text-gray-700">Create New Medical Record</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-8 items-start">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-md p-6">
          <img src={data?.patient?.avatar} alt="patient" className="w-32 h-32 mx-auto rounded-full object-cover border border-dashed border-subMain" />
          <div className="text-center mt-4">
            <h2 className="text-lg font-semibold">{data?.patient?.fullname}</h2>
            <p className="text-sm text-gray-500">{data?.patient?.email}</p>
            <p className="text-sm">{data?.patient?.phone}</p>
            <p className="text-sm text-white bg-sub-main font-medium py-1 px-4 rounded-full mt-2">{calculateAge(data?.patient?.dob)} yrs</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            {/* Doctor Section */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Doctor</label>
              <div className="relative mt-2">
                <button className="w-full bg-gray-200 flex items-center justify-between text-gray-500 text-sm p-3 border border-gray-300 rounded-lg hover:border-gray-400">
                  {data?.doctor?.fullname}
                </button>
              </div>
            </div>

            {/* Complains */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Complaint <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                placeholder="Bad breath, toothache, etc."
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
              ></textarea>
            </div>

            {/* Vital Signs */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Vital Signs</label>
              <textarea
                rows="3"
                placeholder="Blood pressure, Pulse, etc."
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                value={vitalSigns}
                onChange={(e) => setVitalSigns(e.target.value)}
              ></textarea>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="3"
                placeholder="Gingivitis, Periodontitis, etc."
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              ></textarea>
            </div>

            {/* Notes */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Notes</label>
              <textarea
                rows="3"
                placeholder="Notes something ..."
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            {/* Treatment */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Treatment</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                {Object.keys(treatments).map((treatment) => (
                  <div key={treatment} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={treatment}
                      checked={treatments[treatment]}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-subMain border-gray-300 rounded focus:ring-subMain"
                    />
                    <label className="text-gray-700 text-sm">{treatment.replace(/([A-Z])/g, " $1").trim()}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Medicine Form */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Add Medicine</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {newMedicine.name ? (
                      // Hiển thị badge sau khi chọn thuốc
                      <div className="flex items-center bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                        <span className="mr-2">{newMedicine.name}</span>
                        <button onClick={handleRemoveMedicine} className="text-red-600 hover:text-red-800 ml-2">
                          X
                        </button>
                      </div>
                    ) : (
                      // Hiển thị input tìm kiếm khi chưa chọn thuốc
                      <div className="relative flex items-center border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => setDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} // Delay để bắt sự kiện click
                          className="w-full border-none outline-none focus:ring-0 text-sm"
                          placeholder="Search for medicine..."
                        />
                      </div>
                    )}

                    {/* Dropdown hiển thị danh sách gợi ý */}
                    {isDropdownOpen && suggestions?.length > 0 && (
                      <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} onClick={() => handleSelectSuggestion(suggestion)} className="p-2 hover:bg-gray-100 cursor-pointer">
                            {suggestion.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium">
                      Days of use <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="daysOfUse"
                      value={newMedicine.daysOfUse}
                      onChange={handleMedicineChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium">Instraction</label>
                    <select
                      name="instraction"
                      value={newMedicine.instraction}
                      onChange={handleMedicineChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                    >
                      <option value="After Meal">After Meal</option>
                      <option value="Before Meal">Before Meal</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium">
                      Dosage Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="dosageQuantity"
                      value={newMedicine.dosageQuantity}
                      onChange={handleMedicineChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-gray-700 text-sm font-medium">
                    Dosage <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="morning"
                        checked={newMedicine.dosage.morning}
                        onChange={handleDosageChange}
                        className="h-4 w-4 text-subMain border-gray-300 rounded focus:ring-subMain"
                      />
                      <label className="text-gray-700 text-sm ml-2">Morning</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="afternoon"
                        checked={newMedicine.dosage.afternoon}
                        onChange={handleDosageChange}
                        className="h-4 w-4 text-subMain border-gray-300 rounded focus:ring-subMain"
                      />
                      <label className="text-gray-700 text-sm ml-2">Afternoon</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="evening"
                        checked={newMedicine.dosage.evening}
                        onChange={handleDosageChange}
                        className="h-4 w-4 text-subMain border-gray-300 rounded focus:ring-subMain"
                      />
                      <label className="text-gray-700 text-sm ml-2">Evening</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={handleReset} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Reset
                </button>
                <button type="button" onClick={handleAddMedicine} className="bg-blue-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-blue-300">
                  Add
                </button>
              </div>
            </div>

            {/* Medicine */}
            <MedicineTable medicineList={medicines} setMedicineList={setMedicines} />

            <Attachments setSelectedFiles={setAttachment} />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-4 bg-sub-main text-white text-sm font-medium px-2 py-4 my-4 rounded hover:opacity-80 transition"
            disabled={isLoadingCreate}
          >
            {isLoadingCreate ? "Creating..." : "Save Changes"}
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" className="text-white text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
