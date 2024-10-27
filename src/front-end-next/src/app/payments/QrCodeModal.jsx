"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactDOMServer from "react-dom/server";
import InvoiceContent from "./InvoiceContent";
import { formatDateToVietnamTime } from "@/lib/dateUtils";
import useSWR from "swr";

const QrCodeModal = ({ isOpen, onClose, medicalTestDetail, refetch, updateMedicalTest, confirmButton }) => {
  const { service, doctor, patient, createdAt } = medicalTestDetail;
  const [pollingActive, setPollingActice] = useState(true);
  // Example invoice code
  const invoiceCode = "INV001";

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const handlePrintInvoice = async () => {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const printWindow = window.open("", "", `width=${width},height=${height},top=${top},left=${left}`);
    const invoiceContent = ReactDOMServer.renderToString(
      <InvoiceContent invoiceCode={invoiceCode} patient={patient} doctor={doctor} service={service} paymentMethod={"Bank Tranfer"} appointmentDate={"test"} />
    );

    printWindow?.document.write(`
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
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
  };

  // Sử dụng SWR với polling mỗi 5 giây (5000ms)
  const { data, error, isValidating } = useSWR(
    pollingActive ? process.env.NEXT_PUBLIC_API_CHECK_BANK : null,
    fetcher,
    { refreshInterval: pollingActive ? 5000 : 0 } // Kiểm tra mỗi 5 giây
  );

  const completeTransfer = async () => {
    await updateMedicalTest({ id: medicalTestDetail._id, updateMedicalTestDto: { status: "paid" } }).unwrap();
    toast.success("Payment success");
    onClose();
    handlePrintInvoice();
    refetch();
  };

  if (data) {
    console.log(data);
    const lastPaid = data.data[data.data.length - 1];
    const lastPrice = lastPaid["Giá trị"];
    const lastContent = lastPaid["Mô tả"];
    if (service?.price >= lastPrice && lastContent.includes(medicalTestDetail.medicalTestId)) {
      setPollingActice(false);
      completeTransfer();
    }
  }

  const handleSubmit = async () => {
    try {
      //To do: create invoice
      //....
      //
      completeTransfer();
    } catch (err) {
      toast.error("Failed to payment. Please try again.");
      console.error("Error payment service test:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mx-4 md:mx-8 relative">
        <img
          src={`https://img.vietqr.io/image/${process.env.NEXT_PUBLIC_BANK_ID}-${process.env.NEXT_PUBLIC_ACCOUNT_NO}-print.png?amount=${service.price}&addInfo=${medicalTestDetail.medicalTestId}&accountName=${process.env.NEXT_PUBLIC_ACCOUNT_NAME}`}
          alt="Qr code"
        />
        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition"
            onClick={() => {
              toast.dismiss();
              onClose();
            }}
          >
            Close
          </button>
          {confirmButton && (
            <button className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition" onClick={handleSubmit}>
              Confirm Payment
              <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
