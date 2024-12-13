"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock } from "lucide-react";
import { toast } from "react-toastify"; // Assuming you are using react-toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import styles for notifications
import { useAddBookingAppointmentMutation, useAddNotificationMutation } from "@/state/api";
import QrCodeModal from "./QrCodeModal";

function BookAppointment({ doctor, type }) {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [purposeVisit, setPurposeVisit] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog open state
  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false);
  const [addBookingAppointment, { isLoading }] = useAddBookingAppointmentMutation(); // Initialize mutation
  const [appointment, setAppointment] = useState("");
  const [addNotification] = useAddNotificationMutation(); // Initialize mutation
  const user = JSON.parse(localStorage.getItem("Patient"));

  const openQrCodeModal = () => setIsOpenQrCodeModal(true);
  const closeQrCodeModal = () => setIsOpenQrCodeModal(false);

  const getTime = () => {
    const timeList = [];

    for (let i = 10; i <= 12; i++) {
      timeList.push({
        time: i + ":00 AM",
      });
      timeList.push({
        time: i + ":30 AM",
      });
    }
    for (let i = 1; i <= 6; i++) {
      timeList.push({
        time: i + ":00 PM",
      });
      timeList.push({
        time: i + ":30 PM",
      });
    }
    setTimeSlot(timeList);
  };

  useEffect(() => {
    getTime();
  }, []);

  const isPastDay = (day) => {
    return day < new Date();
  };

  const handleSelectDate = (selectedDate) => {
    // Chuyển đổi ngày được chọn về múi giờ UTC+7
    const vnDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);

    // setDate sẽ lưu giá trị đã điều chỉnh
    setDate(vnDate);
  };

  const handleSubmit = async () => {
    if (!purposeVisit) {
      toast.error("Purpose of visit is required.");
      return;
    }

    const appointment = {
      patient_name: user.fullname,
      purpose_visit: purposeVisit,
      date_of_visit: date,
      start_time: selectedTime,
      doctor: doctor._id,
      patient: user._id,
      status: "awaiting tranfer",
      description: "General Medicine'",
      price: type?.price,
    };

    try {
      const data = await addBookingAppointment(appointment).unwrap(); // Execute the mutation
      setAppointment(data);
      openQrCodeModal();
      setDialogOpen(false); // Close the modal on success
    } catch (error) {
      // Handle error (e.g., display an error message)
      toast.error("Error booking appointment. Please try again.");
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>
          <Button className="mt-4">Book Appointment</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl w-full overflow-y-auto max-h-[calc(100vh-4rem)] p-4">
          <DialogHeader>
            <DialogTitle className="text-center">Book Appointment</DialogTitle>
            {/* Price and Type Display */}
            <div className="flex flex-col items-center mb-5">
              <h2 className="font-bold text-2xl text-primary">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(type?.price || 0)}</h2>
              <p className="text-sm text-gray-500">{type?.name || "Appointment Type"}</p>
            </div>
          </DialogHeader>

          <DialogDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="flex flex-col items-center gap-4">
                <h2 className="flex items-center gap-2 text-lg">
                  <CalendarDays className="text-primary h-5 w-5" />
                  Select a Date
                </h2>
                <Calendar mode="single" selected={date} onSelect={handleSelectDate} className="rounded-md border shadow-sm w-full max-w-xs md:max-w-sm" disabled={isPastDay} />
              </div>

              {/* Time Slot Selection */}
              <div className="flex flex-col items-center gap-4">
                <h2 className="flex items-center gap-2 text-lg">
                  <Clock className="text-primary h-5 w-5" />
                  Select Time Slot
                </h2>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {timeSlot.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedTime(item.time)}
                      className={`p-2 text-center border rounded-lg cursor-pointer transition ${item.time === selectedTime ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                    >
                      {item.time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogDescription>

          {/* Purpose of Visit Section */}
          <div className="mt-5">
            <label htmlFor="purpose_visit" className="block text-sm font-medium text-gray-700">
              Purpose
            </label>
            <textarea
              id="purpose_visit"
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-2"
              rows="4"
              placeholder="Enter any additional notes or purpose..."
              value={purposeVisit}
              onChange={(e) => setPurposeVisit(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-6">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                className="text-red-500 border-red-500"
                variant="outline"
                onClick={() => setDialogOpen(false)} // Close dialog on Cancel
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={handleSubmit} // Call handleSubmit on click
                disabled={!(date && selectedTime && purposeVisit)} // Disable if required fields are missing
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
        {isOpenQrCodeModal ? (
          <QrCodeModal isOpen={isOpenQrCodeModal} onClose={closeQrCodeModal} appointment={appointment} patient={user} date={date} selectedTime={selectedTime} doctor={doctor} />
        ) : (
          ""
        )}
      </Dialog>
    </>
  );
}

export default BookAppointment;
