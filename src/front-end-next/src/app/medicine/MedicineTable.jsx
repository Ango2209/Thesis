// "use client";
// import React, { useState } from "react";
// import { Eye, Trash } from "lucide-react";
// import {
//   useGetMedicinesQuery,
//   useGetMedicinesAvailableQuery,
//   useGetBatchesByMedicineIdQuery,
//   useAddBatchsMutation,
// } from "@/state/api";

// const MedicineTable = () => {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const { data: medicines, error, isLoading } = useGetMedicinesQuery();
//   const { data: availableMedicines } = useGetMedicinesAvailableQuery({
//     page,
//     limit,
//   });
//   const [addBatchs] = useAddBatchsMutation(); // Mutation to add batches
//   const [selectedMedicine, setSelectedMedicine] = useState(null);
//   const [batches, setBatches] = useState(null);
//   const [batchName, setBatchName] = useState("");
//   const [batchQuantity, setBatchQuantity] = useState(0);

//   const handleViewClick = (medicine) => {
//     setSelectedMedicine(medicine);
//     // Fetch the batches for the selected medicine
//     fetchBatches(medicine.id);
//   };

//   const fetchBatches = async (medicineId) => {
//     const { data: batchesData } = useGetBatchesByMedicineIdQuery(medicineId);
//     setBatches(batchesData);
//   };

//   const handleAddBatch = async () => {
//     if (!batchName || batchQuantity <= 0 || !selectedMedicine) return;

//     await addBatchs({
//       name: batchName,
//       quantity: batchQuantity,
//       medicineId: selectedMedicine.id,
//     });

//     // Clear the form and fetch updated batches
//     setBatchName("");
//     setBatchQuantity(0);
//     fetchBatches(selectedMedicine.id);
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md animate-fadeIn">
//       {!selectedMedicine ? (
//         <div className="p-6 bg-white rounded-lg shadow-md">

//           <h3 className="text-lg font-semibold">Available Medicines</h3>
//           <table className="w-full text-left table-auto mb-4">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 border-b">#</th>
//                 <th className="px-4 py-2 border-b">Medicine</th>
//                 <th className="px-4 py-2 border-b">Base price</th>
//                 <th className="px-4 py-2 border-b">Measure</th>
//                 <th className="px-4 py-2 border-b">Description</th>
//                 <th className="px-4 py-2 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {availableMedicines?.medicines?.map((medicine, index) => (
//                 <tr key={medicine.id} className="hover:bg-gray-100">
//                   <td className="px-4 py-2 border-b">{index + 1}</td>
//                   <td className="px-4 py-2 border-b">{medicine.name}</td>
//                   <td className="px-4 py-2 border-b">{medicine.basePrice}</td>
//                   <td className="px-4 py-2 border-b">{medicine.measure}</td>
//                   <td className="px-4 py-2 border-b">{medicine.description}</td>
//                   <td className="p-3 border-b">
//                     <button
//                       className="text-gray-500 hover:text-teal-600"
//                       onClick={() => handleViewClick(medicine)}
//                     >
//                       <Eye />
//                     </button>
//                     <button className="ml-4 text-gray-500 hover:text-red-600">
//                       <Trash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div>
//           <button
//             className="mb-4 px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
//             onClick={() => setSelectedMedicine(null)}
//           >
//             Back to Medicines
//           </button>
//           <h2 className="text-xl font-semibold mb-4">
//             {selectedMedicine.name} - Batches
//           </h2>
//           <ul>
//             {batches?.map((batch) => (
//               <li key={batch.id} className="mb-2">
//                 {batch.name}: {batch.quantity} available
//               </li>
//             ))}
//           </ul>

//           {/* Add Batch Section */}
//           <h3 className="text-lg font-semibold mt-6">Add New Batch</h3>
//           <input
//             type="text"
//             value={batchName}
//             onChange={(e) => setBatchName(e.target.value)}
//             placeholder="Batch name"
//             className="px-4 py-2 mb-2 border rounded-lg"
//           />
//           <input
//             type="number"
//             value={batchQuantity}
//             onChange={(e) => setBatchQuantity(e.target.value)}
//             placeholder="Quantity"
//             className="px-4 py-2 mb-2 border rounded-lg"
//           />
//           <button
//             className="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
//             onClick={handleAddBatch}
//           >
//             Add Batch
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MedicineTable;



"use client"
import React, { useState, useEffect } from "react";
import { Eye, Trash } from "lucide-react";
import {
  useGetMedicinesQuery,
  useGetMedicinesAvailableQuery,
  useGetBatchesByMedicineIdQuery,
  useAddBatchsMutation,
} from "@/state/api";

const MedicineTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: medicines, error, isLoading } = useGetMedicinesQuery();
  const { data: availableMedicines } = useGetMedicinesAvailableQuery({
    page,
    limit,
  });
  const [addBatchs] = useAddBatchsMutation();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [batches, setBatches] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [batchQuantity, setBatchQuantity] = useState(0);

  // Use the hook at the top level
  const { data: batchesData } = useGetBatchesByMedicineIdQuery(
    selectedMedicine?.id,
    { skip: !selectedMedicine }
  );

  useEffect(() => {
    if (batchesData) {
      setBatches(batchesData);
    }
  }, [batchesData]);

  const handleViewClick = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleAddBatch = async () => {
    if (!batchName || batchQuantity <= 0 || !selectedMedicine) return;

    await addBatchs({
      name: batchName,
      quantity: batchQuantity,
      medicineId: selectedMedicine.id,
    });

    // Clear the form and fetch updated batches
    setBatchName("");
    setBatchQuantity(0);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      {!selectedMedicine ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search 'medicines'"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <div className="flex space-x-2">
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                <option>Sort by...</option>
              </select>
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
                <option>Gender...</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button className="px-6 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:outline-none">
              Filter
            </button>
          </div>
          <table className="w-full text-left table-auto mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Medicine</th>
                <th className="px-4 py-2 border-b">Base price</th>
                <th className="px-4 py-2 border-b">Measure</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableMedicines?.medicines?.map((medicine, index) => (
                <tr key={medicine.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{medicine.name}</td>
                  <td className="px-4 py-2 border-b">{medicine.basePrice}</td>
                  <td className="px-4 py-2 border-b">{medicine.measure}</td>
                  <td className="px-4 py-2 border-b">{medicine.description}</td>
                  <td className="p-3 border-b">
                    <button
                      className="text-gray-500 hover:text-teal-600"
                      onClick={() => handleViewClick(medicine)}
                    >
                      <Eye />
                    </button>
                    <button className="ml-4 text-gray-500 hover:text-red-600">
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <button
            className="mb-4 px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
            onClick={() => setSelectedMedicine(null)}
          >
            Back to Medicines
          </button>
          <h2 className="text-xl font-semibold mb-4">
            {selectedMedicine.name} - Batches
          </h2>
          <ul>
            {batches?.map((batch) => (
              <li key={batch.id} className="mb-2">
                {batch.name}: {batch.quantity} available
              </li>
            ))}
          </ul>

          {/* Add Batch Section */}
          <h3 className="text-lg font-semibold mt-6">Add New Batch</h3>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="Batch name"
            className="px-4 py-2 mb-2 border rounded-lg"
          />
          <input
            type="number"
            value={batchQuantity}
            onChange={(e) => setBatchQuantity(e.target.value)}
            placeholder="Quantity"
            className="px-4 py-2 mb-2 border rounded-lg"
          />
          <button
            className="px-4 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
            onClick={handleAddBatch}
          >
            Add Batch
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicineTable;