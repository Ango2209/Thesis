"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactDOMServer from "react-dom/server"; // Đảm bảo bạn đã cài thư viện này
import InvoiceContent from "./InvoiceContent";
import { formatDateToVietnamTime } from "@/lib/dateUtils";

const PaymentModal = ({ isOpen, onClose, medicalTestDetail, refetch, updateMedicalTest }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const { service, doctor, patient, createdAt } = medicalTestDetail;

  // Example invoice code
  const invoiceCode = "INV001";

  const handlePrintInvoice = () => {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const printWindow = window.open("", "", `width=${width},height=${height},top=${top},left=${left}`);
    const invoiceContent = ReactDOMServer.renderToString(<InvoiceContent invoiceCode={invoiceCode} patient={patient} doctor={doctor} service={service} paymentMethod={paymentMethod} />);

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>${invoiceContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleConfirmPrint = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <h3 className="text-lg font-semibold">Do you want to print the invoice?</h3>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-gray-300 p-2 rounded"
              onClick={() => {
                closeToast();
                onClose();
              }}
            >
              No, thanks
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => {
                closeToast();
                onClose();
                handlePrintInvoice();
              }}
            >
              Yes, print it
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const handleSubmit = async () => {
    try {
      await updateMedicalTest({ id: medicalTestDetail._id, updateMedicalTestDto: { status: "paid" } }).unwrap();
      toast.success("Payment success");
      refetch();
      //To do: create invoice
      //....
      //
      handleConfirmPrint();
    } catch (err) {
      toast.error("Failed to payment. Please try again.");
      console.error("Error payment service test:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mx-4 md:mx-8 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => {
            toast.dismiss();
            onClose();
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h1 className="text-2xl font-semibold text-center mb-6">Request Medical Test Detail</h1>

        <div className="flex justify-between mb-4">
          {/* Bên trái: Thông tin bệnh nhân */}
          <div className="w-1/2 pr-2 bg-blue-50 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Patient Information</h2>
            <div className="flex justify-between py-2">
              <span className="font-medium">Name:</span>
              <span>{patient.fullname}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Patient Code:</span>
              <span>{patient.patient_id}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Phone:</span>
              <span>{patient.phone}</span>
            </div>
          </div>

          {/* Bên phải: Thông tin bác sĩ */}
          <div className="w-1/2 pl-2 bg-green-50 p-4 rounded-lg shadow-md ml-4">
            {" "}
            {/* Thêm margin-left */}
            <h2 className="text-lg font-semibold">Doctor Information</h2>
            <div className="flex justify-between py-2">
              <span className="font-medium">Name:</span>
              <span>{doctor.fullname}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Doctor Code:</span>
              <span>{doctor.doctor_id}</span>
            </div>
          </div>
        </div>

        {/* Ngày hẹn */}
        <div className="py-4">
          <h2 className="text-lg font-semibold">Create At</h2>
          <div className="flex justify-between py-2">
            <span className="font-medium">Date:</span>
            <span>{formatDateToVietnamTime(createdAt)}</span>
          </div>
        </div>

        {/* Dịch vụ */}
        <div className="py-4">
          <h2 className="text-lg font-semibold">Service Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-300 text-left py-2">Service</th>
                  <th className="border-b border-gray-300 text-left py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-300 py-2">{service.name}</td>
                  <td className="border-b border-gray-300 py-2">{service.price}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Phương thức thanh toán */}
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

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition"
            onClick={() => {
              toast.dismiss();
              onClose();
            }}
          >
            Cancel
          </button>
          <button className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition" onClick={handleSubmit}>
            Confirm Payment
            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
