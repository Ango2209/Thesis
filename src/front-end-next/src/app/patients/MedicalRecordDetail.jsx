import React from "react";

const MedicalRecordDetail = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">12 May 2021</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-2xl hover:text-red-700"
          >
            x
          </button>
        </div>

        <div className=" space-y-4">
          <Field
            label="Complaint"
            value="Bleeding Gums, Toothache, bad breath"
          />
          <Field label="Diagnosis" value="Gingivitis, Caries, Periodontitis" />
          <Field
            label="Treatment"
            value="Filling, Post&Core, Implant, Extraction"
          />
          <Field
            label="Vital Signs"
            value="Blood Pressure: 120/80 mmHg, Pulse Rate: 80 bpm, Respiratory Rate: 16 bpm, Temperature: 36.5 °C, Oxygen Saturation: 98%"
          />

          <div>
            <h3 className="font-bold mb-2">Prescriptions</h3>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Item Price (Tsh)</th>
                  <th className="text-left p-2">Dosage</th>
                  <th className="text-left p-2">Instruction</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Amount (Tsh)</th>
                </tr>
              </thead>
              <tbody>
                <PrescriptionRow
                  item="Paracetamol"
                  price={1000}
                  dosage="1 - M/A/E"
                  instruction="After meal"
                  quantity={1}
                  amount={1000}
                />
                <PrescriptionRow
                  item="Amoxicillin"
                  price={2300}
                  dosage="2 - M/A/E"
                  instruction="After meal"
                  quantity={2}
                  amount={4600}
                />
                <PrescriptionRow
                  item="Ibuprofen"
                  price={5000}
                  dosage="3 - M/A/E"
                  instruction="Before meal"
                  quantity={3}
                  amount={15000}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <span className="font-bold">{label}:</span>
    <span className="ml-2">{value}</span>
  </div>
);

const PrescriptionRow = ({
  item,
  price,
  dosage,
  instruction,
  quantity,
  amount,
}) => (
  <tr className="border-b">
    <td className="p-2">{item}</td>
    <td className="p-2">{price}</td>
    <td className="p-2">{dosage}</td>
    <td className="p-2">{instruction}</td>
    <td className="p-2">{quantity}</td>
    <td className="p-2">{amount}</td>
  </tr>
);

export default MedicalRecordDetail;
