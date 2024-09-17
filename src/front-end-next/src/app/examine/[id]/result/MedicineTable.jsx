"use client";
import { useState } from "react";

const medicines = [
  { name: "Paracetamol", price: 1000, dosage: "1 - M/A/E", instruction: "After meal", quantity: 1, amount: 1000 },
  { name: "Amoxicillin", price: 2300, dosage: "2 - M/A/E", instruction: "After meal", quantity: 2, amount: 4600 },
  { name: "Ibuprofen", price: 5000, dosage: "3 - M/A/E", instruction: "Before meal", quantity: 3, amount: 15000 },
];

export default function MedicineTable() {
  const [medicineList, setMedicineList] = useState(medicines);

  const handleDelete = (index) => {
    setMedicineList(medicineList.filter((_, i) => i !== index));
  };

  return (
    <div className="flex w-full flex-col gap-4 mb-6">
      <p className="text-black text-sm font-medium">Medicine</p>
      <div className="w-full overflow-x-auto">
        <table className="table-auto w-full bg-white border border-gray-200 rounded-md shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left text-xs font-medium py-3 px-2">Item</th>
              <th className="text-left text-xs font-medium py-3 px-2">
                Item Price<span className="text-xs font-light ml-1">(Tsh)</span>
              </th>
              <th className="text-left text-xs font-medium py-3 px-2">Dosage</th>
              <th className="text-left text-xs font-medium py-3 px-2">Instruction</th>
              <th className="text-left text-xs font-medium py-3 px-2">Quantity</th>
              <th className="text-left text-xs font-medium py-3 px-2">
                Amount<span className="text-xs font-light ml-1">(Tsh)</span>
              </th>
              <th className="text-left text-xs font-medium py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicineList.map((medicine, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="text-left text-xs py-4 px-2">{medicine.name}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.price}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.dosage}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.instruction}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.quantity}</td>
                <td className="text-left text-xs py-4 px-2">{medicine.amount}</td>
                <td className="text-left text-xs py-4 px-2">
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-600 bg-opacity-5 text-red-600 rounded-lg border border-red-100 py-2 px-3 text-sm flex items-center gap-2 hover:bg-red-200 transition-colors"
                  >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                    </svg>
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
