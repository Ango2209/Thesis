"use client";
import { useState } from "react";
import MedicineTable from "./MedicineTable";
import Attachments from "./Attachments";

export default function NewMedicalRecord() {
  const [complains, setComplains] = useState("");
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
  const [medicine, setMedicine] = useState("");
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    quantity: "",
    instruction: "",
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

  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSuggestions(fetchSuggestions(value));
    setDropdownOpen(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    setNewMedicine((prev) => ({ ...prev, name: suggestion }));
    setSearchQuery(""); // Clear search query
    setSuggestions([]); // Clear suggestions list
    setDropdownOpen(false); // Close dropdown
  };

  // Function to simulate fetching medicine suggestions (replace with actual API call)
  const fetchSuggestions = (query) => {
    // Dummy data for example
    const allMedicines = ["Aspirin", "Paracetamol", "Ibuprofen", "Amoxicillin"];
    if (!query) return [];
    return allMedicines.filter((medicine) => medicine.toLowerCase().includes(query.toLowerCase()));
  };

  const handleReset = () => {
    setNewMedicine({
      name: "",
      quantity: "",
      instruction: "",
      dosageQuantity: "",
      dosage: {
        morning: false,
        afternoon: false,
        evening: false,
      },
    });
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.quantity && newMedicine.instruction && newMedicine.dosageQuantity && newMedicine.dosage) {
      setMedicine((prev) => [...prev, newMedicine]);
      setNewMedicine({
        name: "",
        quantity: "",
        instruction: "",
        dosageQuantity: "",
        dosage: "",
      });
    }
    handleReset();
  };

  const handleRemoveMedicine = () => {
    setNewMedicine((prev) => ({ ...prev, name: "" }));
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-2">
      <div className="flex items-center gap-4">
        <a className="bg-white border border-subMain border-dashed rounded-lg py-2 px-3 text-md hover:bg-gray-100" href="/patients/preview/1">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"></path>
          </svg>
        </a>
        <h1 className="text-2xl font-semibold text-gray-700">Create New Medical Record</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-8 items-start">
        <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-md p-6">
          <img
            src="https://cdn.24h.com.vn/upload/2-2024/images/2024-06-13/David-Beckham-tuoi-49-Thoai-mai-coi-ao-khoe-body-cung-de-dang-david1-1718251288-414-width740height490.jpg"
            alt="patient"
            className="w-32 h-32 mx-auto rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="text-center mt-4">
            <h2 className="text-lg font-semibold">Amani Mmassy</h2>
            <p className="text-sm text-gray-500">amanimmassy@gmail.com</p>
            <p className="text-sm">+254 712 345 678</p>
            <p className="text-sm text-white bg-subMain font-medium py-1 px-4 rounded-full mt-2">45 yrs</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            {/* Doctor Section */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Doctor</label>
              <div className="relative mt-2">
                <button className="w-full bg-gray-200 flex items-center justify-between text-gray-500 text-sm p-3 border border-gray-300 rounded-lg hover:border-gray-400">Hugo Lloris</button>
              </div>
            </div>

            {/* Complains */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Complains</label>
              <textarea
                rows="3"
                placeholder="Bad breath, toothache, etc."
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                value={complains}
                onChange={(e) => setComplains(e.target.value)}
              ></textarea>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Diagnosis</label>
              <textarea
                rows="3"
                placeholder="Gingivitis, Periodontitis, etc."
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
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
                  <label className="text-gray-700 text-sm font-medium">Name</label>
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
                    {isDropdownOpen && suggestions.length > 0 && (
                      <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} onClick={() => handleSelectSuggestion(suggestion)} className="p-2 hover:bg-gray-100 cursor-pointer">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newMedicine.quantity}
                      onChange={handleMedicineChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium">Instruction</label>
                    <select
                      name="instruction"
                      value={newMedicine.instruction}
                      onChange={handleMedicineChange}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm focus:ring-subMain focus:border-subMain"
                    >
                      <option value="">Select...</option>
                      <option value="After Meal">After Meal</option>
                      <option value="Before Meal">Before Meal</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-gray-700 text-sm font-medium">Dosage Quantity</label>
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
                  <label className="text-gray-700 text-sm font-medium">Dosage</label>
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
            <MedicineTable />

            <Attachments setSelectedFiles={setAttachment} />
          </div>
          <button className="w-full flex items-center justify-center gap-4 bg-sub-main text-white text-sm font-medium px-2 py-4 my-4 rounded hover:opacity-80 transition">
            Save Changes
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" className="text-white text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
