"use client";
import { useAddNotificationMutation, useCreateInvoiceMutation, useUpdateAppointmentStatusMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

const QrCodeModal = ({ isOpen, onClose, appointment, confirmButton = true, patient, date, selectedTime, doctor }) => {
  const [pollingActive, setPollingActive] = useState(true);
  const [paying, setPaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Countdown timer in seconds (5 minutes)
  const [redirectCountdown, setRedirectCountdown] = useState(null); // Countdown for redirection after success
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  const [createInvoice, { isLoading: isLoadingCreate }] = useCreateInvoiceMutation();
  const [addNotification] = useAddNotificationMutation();
  const router = useRouter();

  const fetcher = (url) => fetch(url).then((res) => res.json());

  // Polling for payment status every 2 seconds
  const { data, error, isValidating } = useSWR(pollingActive ? process.env.NEXT_PUBLIC_API_CHECK_BANK : null, fetcher, { refreshInterval: pollingActive ? 2000 : 0 });

  // Handle countdown timer for payment time
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose(); // Close modal when timer reaches 0
          toast.warning("Time expired. Please try again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount or modal close
  }, [isOpen, onClose]);

  // Handle countdown timer for redirection
  useEffect(() => {
    if (redirectCountdown === null) return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/mybookings");
          onClose();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectCountdown, onClose]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const completeTransfer = async () => {
    setPaying(true);
    setPollingActive(false);
    setRedirectCountdown(10);
    await updateAppointmentStatus({ id: appointment?._id, status: "booked" }).unwrap();
    const params = {
      patientId: patient._id,
      userId: "648d7c4f9a3f5a001e2c8e75", //test
      invoiceType: "booked",
      paymentMethod: "transfer",
      status: "paid",
      totalAmount: appointment?.price,
      createdAt: Date.now(),
    };
    await createInvoice(params).unwrap();
    const notification = {
      patientId: null,
      doctorId: doctor._id,
      title: "New Appointment",
      content: `You have a new appointment with Patient ${patient.fullname} on ${date} at ${selectedTime}`,
      isRead: false,
      date,
    };
    await addNotification(notification).unwrap();
    toast.success("Payment successful!");
  };

  // Check payment status
  if (data) {
    const lastPaid = data.data[data.data.length - 1];
    const lastPrice = lastPaid["Giá trị"];
    const lastContent = lastPaid["Mô tả"];
    if (lastPrice >= appointment?.price && lastContent.includes(appointment.appointmentId)) {
      completeTransfer();
    }
  }

  const handleSubmit = () => {};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mx-4 md:mx-8 relative">
        <img
          src={`https://img.vietqr.io/image/${process.env.NEXT_PUBLIC_BANK_ID}-${process.env.NEXT_PUBLIC_ACCOUNT_NO}-print.png?amount=${appointment.price}&addInfo=${appointment.appointmentId}&accountName=${process.env.NEXT_PUBLIC_ACCOUNT_NAME}`}
          alt="Qr code"
          className="w-full"
        />
        {!paying && redirectCountdown === null && <p className="text-center text-red-600 font-medium mt-4">You need to complete the payment within {formatTime(timeLeft)}.</p>}
        {paying && redirectCountdown === null && <p className="text-center text-green-600 mt-2">Payment successful! Waiting for redirection...</p>}
        {paying && redirectCountdown !== null && <p className="text-center text-green-600 mt-2">Payment successful! Redirecting in {redirectCountdown} seconds...</p>}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition"
            onClick={() => {
              toast.dismiss();
              onClose();
            }}
            disabled={paying && redirectCountdown !== null} // Disable close button during redirection countdown
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
