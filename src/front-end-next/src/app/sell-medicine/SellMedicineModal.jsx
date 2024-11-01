"use client";
import {
  useCheckMedicinesAvailabilityMutation,
  useCreateInvoiceMutation,
  useLockMedicinesMutation,
  useReduceMedicinesMutation,
  useSearchMedicinesQuery,
  useUnlockMedicinesMutation,
} from "@/state/api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SellMedicineModal = ({ isOpen, onClose, medicines, setMedicines, record, openQrCodeModal, setInvoice }) => {
  const { patient } = record;
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkMedicinesAvailability, { isLoading: isLoadingCheck }] = useCheckMedicinesAvailabilityMutation();
  const [createInvoice, { isLoading: isLoadingCreate }] = useCreateInvoiceMutation();
  const [reduceMedicines, { isLoading: isLoadingReduce }] = useReduceMedicinesMutation();
  const [lockMedicines, { isLoading: isLoadingLock }] = useLockMedicinesMutation();


  const handleDelete = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const [newMedicine, setNewMedicine] = useState({
    medicineId: "",
    name: "",
    daysOfUse: "",
    instraction: "After Meal",
    dosageQuantity: "",
    basePrice: 0,
    dosage: {
      morning: false,
      afternoon: false,
      evening: false,
    },
  });
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
    setNewMedicine((prev) => ({ ...prev, name: suggestion.name, medicineId: suggestion._id, basePrice: suggestion.basePrice, availableQuantity: suggestion.availableQuantity }));
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
      if (quantity > newMedicine.availableQuantity) {
        toast.error("Insufficient quantity of medicine.");
        return;
      }
      const dosageParts = [newMedicine.dosage.morning ? "M" : "", newMedicine.dosage.afternoon ? "A" : "", newMedicine.dosage.evening ? "E" : ""].filter(Boolean);

      const dosage = `${newMedicine.dosageQuantity}-${dosageParts.join("/")}`;
      const { name, medicineId, dosageQuantity, daysOfUse, basePrice, instraction } = newMedicine;
      const newMedicineEntry = {
        name: name,
        _id: medicineId,
        basePrice,
        dosage,
        quantityToUse: quantity,
        instraction,
      };

      // Tìm thuốc với cùng _id trong danh sách hiện tại
      const existingMedicineIndex = medicines.findIndex((med) => med._id === newMedicineEntry._id);

      if (existingMedicineIndex !== -1) {
        const updatedMedicines = [...medicines];
        const updatedMedicine = {
          ...updatedMedicines[existingMedicineIndex],
          quantityToUse: updatedMedicines[existingMedicineIndex].quantityToUse + newMedicineEntry.quantityToUse,
        };
        if (updatedMedicine.quantityToUse > newMedicine.availableQuantity) {
          toast.error("Insufficient quantity of medicine.");
          return;
        }
        updatedMedicines[existingMedicineIndex] = updatedMedicine;
        setMedicines(updatedMedicines);
      } else {
        setMedicines((prev) => [...prev, newMedicineEntry]);
      }
      handleReset();
    } else {
      toast.error("Please fill all required fields and select at least one dosage time.");
    }
  };

  const handleRemoveMedicine = () => {
    setNewMedicine((prev) => ({ ...prev, name: "" }));
  };

  if (!isOpen) return null;

  const handlePayment = async () => {
    const medicinesToCheck = medicines.map((med) => ({
      medicineId: med._id,
      quantityToUse: med.quantityToUse,
      dosage: med.dosage,
      instraction: med.instraction,
    }));
    const data = await checkMedicinesAvailability(medicinesToCheck).unwrap();
    if (data.unavailable.length > 0) {
      const unavailableMedicines = data.unavailable.map((med) => `- ${med.name}: Available ${med.availableQuantity || 0}, Required ${med.quantityToUse}`).join("\n");
      toast.error(
        <div className="space-y-4">
          <p className="text-lg font-semibold">The following medicines are not available in sufficient quantity:</p>
          <pre className="bg-gray-100 p-2 rounded-md whitespace-pre-wrap">{unavailableMedicines}</pre>
        </div>
      );
      return;
    }
    const medicinesParams = medicines.map((med) => ({
      medicineId: med._id,
      quantity: med.quantityToUse,
      dosage: med.dosage,
      instraction: med.instraction,
      unitPrice: med.basePrice,
    }));
    const params = {
      patientId: patient.patient_id,
      userId: "648d7c4f9a3f5a001e2c8e75", //test
      invoiceType: "medicine",
      medicines: medicinesParams,
      status: "paid",
      createdAt: Date.now(),
    };
    let createInvoiceDto = {};
    if (paymentMethod === "cash") {
      createInvoiceDto = { ...params, paymentMethod: "cash" };
      await createInvoice(createInvoiceDto).unwrap();
      await reduceMedicines(medicinesToCheck).unwrap();
      toast.success("Payment success");
      onClose();
    } else {
      createInvoiceDto = { ...params, paymentMethod: "transfer", status: "awaiting transfer" };
      await lockMedicines(medicinesToCheck).unwrap();
      const invoice = await createInvoice(createInvoiceDto).unwrap();
      setInvoice(invoice);
      onClose();
      openQrCodeModal();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mx-4 relative overflow-y-auto max-h-screen">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Sell Medicine</h2>

        {/* Thông tin khách hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input type="text" value={patient.fullname} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="text" value={patient.phone} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" readOnly />
          </div>
        </div>

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
                    <span className="mr-2">{newMedicine.name + "- Instock: " + newMedicine.availableQuantity}</span>
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
                        {suggestion.name} - Instock: {suggestion.availableQuantity}
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

        {/* Bảng thuốc */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full table-auto border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2 text-sm font-medium">Medicine</th>
                <th className="text-center px-3 py-2 text-sm font-medium">Quantity</th>
                <th className="text-center px-3 py-2 text-sm font-medium">Dosage</th>
                <th className="text-center px-3 py-2 text-sm font-medium">Instraction</th>
                <th className="text-center px-3 py-2 text-sm font-medium">Unit Price</th>
                <th className="text-center px-3 py-2 text-sm font-medium">Total</th>
                <th className="text-right px-3 py-2 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm">{medicine.name}</td>
                  <td className="text-center px-3 py-2 text-sm">{medicine.quantityToUse}</td>
                  <td className="text-center px-3 py-2 text-sm ">{medicine.dosage}</td>
                  <td className="text-center px-3 py-2 text-sm ">{medicine.instraction}</td>
                  <td className="text-center px-3 py-2 text-sm">{medicine.basePrice} ₫</td>
                  <td className="text-center px-3 py-2 text-sm">{medicine.quantityToUse * medicine.basePrice} ₫</td>
                  <td className="text-right text-xs py-4 px-2">
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-2 px-3 text-sm flex items-center gap-2 hover:bg-red-200 transition-colors"
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total:</span>
          <span className="text-lg font-semibold">{medicines.reduce((acc, item) => acc + item.quantityToUse * item.basePrice, 0)} ₫</span>
        </div>

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

        {/* Nút hành động */}
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handlePayment}>
            Payments
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellMedicineModal;
