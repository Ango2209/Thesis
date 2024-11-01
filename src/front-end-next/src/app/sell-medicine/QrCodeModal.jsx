"use client";
import { useChangeToPaidMutation } from "@/state/api";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

const QrCodeModal = ({ isOpen, onClose, invoice, unlockMedicines }) => {
  const [pollingActive, setPollingActice] = useState(true);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [changeToPaid] = useChangeToPaidMutation();
  const [payting, setPayting] = useState(false);

  // Sử dụng SWR với polling mỗi 2 giây (2000ms)
  const { data, error, isValidating } = useSWR(
    pollingActive ? process.env.NEXT_PUBLIC_API_CHECK_BANK : null,
    fetcher,
    { refreshInterval: pollingActive ? 2000 : 0 } // Kiểm tra mỗi 5 giây
  );

  const completeTransfer = async () => {
    setPayting(true);
    const medicinesToUnlock = invoice.medicines.map((med) => ({
      medicineId: med.medicineId,
      quantityToUnlock: med.quantity,
    }));
    console.log(medicinesToUnlock);
    await changeToPaid(invoice._id);
    const rs = await unlockMedicines(medicinesToUnlock).unwrap();
    console.log(rs);
    toast.success("Payment success");
    onClose();
    setPayting(false);
  };

  if (data) {
    const lastPaid = data.data[data.data.length - 1];
    const lastPrice = lastPaid["Giá trị"];
    const lastContent = lastPaid["Mô tả"];
    if (lastPrice >= invoice?.totalAmount && lastContent.includes(invoice.invoiceId)) {
      setPollingActice(false);
      completeTransfer();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mx-4 md:mx-8 relative">
        <img
          src={`https://img.vietqr.io/image/${process.env.NEXT_PUBLIC_BANK_ID}-${process.env.NEXT_PUBLIC_ACCOUNT_NO}-print.png?amount=${invoice.totalAmount}&addInfo=${invoice.invoiceId}&accountName=${process.env.NEXT_PUBLIC_ACCOUNT_NAME}`}
          alt="Qr code"
        />
        {payting ? <p className="text-center text-green-200">Payment successful, waiting for redirection in a moment</p> : ""}
        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition"
            onClick={() => {
              toast.dismiss();
              onClose();
            }}
            disabled={payting}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeModal;
