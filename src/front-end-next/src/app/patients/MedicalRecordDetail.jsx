import React from "react";

const MedicalRecordDetail = ({ isOpen, onClose, record }) => {
  if (!isOpen) return null;
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" onClick={handleBackgroundClick}>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{formatDate(record.record_date)}</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-2xl hover:text-red-700">
            x
          </button>
        </div>

        <div className=" space-y-4">
          <Field label="Complaint" value={record?.complaint} />
          <Field label="Diagnosis" value={record?.diagnosis} />
          <Field label="Treatment" value={record?.treatment} />
          <Field label="Vital Signs" value={record?.vital_signs} />

          <div>
            <h3 className="font-bold mb-2">Prescriptions</h3>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Item Price (Tsh)</th>
                  <th className="text-left p-2">Dosage</th>
                  <th className="text-left p-2">Instraction</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Amount (Tsh)</th>
                </tr>
              </thead>
              <tbody>
                {record.prescriptions.map((p, index) => (
                  <PrescriptionRow key={index} item={p.itemName} price={p.itemPrice} dosage={p.dosage} instraction={p.instraction} quantity={p.quantity} amount={p.amount} />
                ))}
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

const PrescriptionRow = ({ item, price, dosage, instraction, quantity, amount }) => (
  <tr className="border-b">
    <td className="p-2">{item}</td>
    <td className="p-2">{price}</td>
    <td className="p-2">{dosage}</td>
    <td className="p-2">{instraction}</td>
    <td className="p-2">{quantity}</td>
    <td className="p-2">{amount}</td>
  </tr>
);

export default MedicalRecordDetail;
