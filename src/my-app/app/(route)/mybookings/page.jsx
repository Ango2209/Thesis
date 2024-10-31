"use client";
import { useGetAppointmentsPatientIdQuery, useGetMedicalRecordsQuery, useUpdateAppointmentDateMutation } from "@/state/api";
import { CalendarIcon, ClockIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function MyBookings() {
  const router = useRouter();
  const [activeDialog, setActiveDialog] = useState(null);
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [updateAppointmentDate] = useUpdateAppointmentDateMutation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const patient = localStorage.getItem("Patient");
      if (!patient) {
        router.push("/login");
        return;
      }
      setUser(JSON.parse(patient));
    }
  }, [router]);

  const getTime = () => {
    const timeList = [];
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: i + ":00 AM" });
      timeList.push({ time: i + ":30 AM" });
    }
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: i + ":00 PM" });
      timeList.push({ time: i + ":30 PM" });
    }
    setTimeSlot(timeList);
  };

  useEffect(() => {
    getTime();
  }, []);

  const isPastDay = (day) => day < new Date();

  const openDialog = (dialogType, booking) => {
    setActiveDialog(dialogType);
    setSelectedBooking(booking);
  };

  const handleCancel = async () => {
    // Cancel logic
  };

  const handleReschedule = async () => {
    try {
      await updateAppointmentDate({ id: selectedBooking?._id, data: { date_of_visit: date, start_time: selectedTime } }).unwrap();
      toast.success(`Rescheduled to: ${date.toLocaleDateString()} at ${selectedTime}`);
      refetch();
      closeDialog();
    } catch (error) {
      console.error("Failed to reschedule:", error);
    }
  };

  const closeDialog = () => setActiveDialog(null);

  const { data: bookings, refetch, error, isLoading } = useGetAppointmentsPatientIdQuery(user?._id);

  const medical_records = [
    {
      record_date: new Date("2023-01-01"),
      diagnosis: "Flu",
      notes: "Patient showed symptoms of flu.",
      complaint: "Fever and cough",
      treatment: "Rest and hydration",
      vital_signs: "BP: 120/80, Temp: 101°F",
      prescriptions: ["Paracetamol", "Cough Syrup"],
      attachments: [],
      doctor: "60d5ec49f1b2c8b1f8c8e4b1", // Example ObjectId
    },
    {
      record_date: new Date("2023-02-15"),
      diagnosis: "Allergy",
      notes: "Patient has seasonal allergies.",
      complaint: "Sneezing and itchy eyes",
      treatment: "Antihistamines",
      vital_signs: "BP: 118/76, Temp: 98.6°F",
      prescriptions: ["Antihistamine"],
      attachments: [],
      doctor: "60d5ec49f1b2c8b1f8c8e4b2", // Example ObjectId
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      {bookings && bookings.length > 0 ? (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <li key={booking._id} className="p-6 bg-white shadow-md rounded-lg transition-transform transform">
              <div className="flex justify-between">
                <div className="flex items-start space-x-6 mt-4 ml-16">
                  <img src={`https://i.pravatar.cc/150?img=${booking._id}`} alt={booking.doctor.fullname} className="w-20 h-20 rounded-full border" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Dr. {booking.doctor.fullname}</h3>
                    <p className="text-gray-600">DOB: {new Date(booking.doctor.dob).toLocaleDateString()}</p>
                    <p className="text-gray-600">Address: {booking.doctor.address}</p>
                    <p className="text-gray-600">Phone: {booking.doctor.phone}</p>
                    <p className="text-gray-600">Email: {booking.doctor.email}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4 mr-16">
                  <div>
                    <p className="text-gray-600 flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" /> Date of Visit: {new Date(booking.date_of_visit).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2" /> Start Time: {booking.start_time}
                    </p>
                    <p className="text-gray-600">Purpose of Visit: {booking.purpose_visit}</p>
                  </div>
                  <div className={`ml-12 px-3 py-1 rounded-full font-semibold text-sm ${booking.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}>
                    {booking.status}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">Description: {booking.description}</p>
              </div>
              <div className="mt-4 flex space-x-4">
                {booking.status === "Pending" ? (
                  <button onClick={() => openDialog("reschedule", booking)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Reschedule
                  </button>
                ) : (
                  <button onClick={() => openDialog("viewMedicalRecords")} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                    View Medical Records
                  </button>
                )}
                <button onClick={() => openDialog("cancel")} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                  Cancel
                </button>
              </div>

              {/* Dialogs */}
              <Dialog open={activeDialog === "reschedule"} onOpenChange={closeDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reschedule Appointment</DialogTitle>
                    <DialogDescription>{/* Calendar and Time Selection */}</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={handleReschedule}>Confirm Reschedule</Button>
                    <Button onClick={closeDialog}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Additional Dialogs for Medical Records and Cancellation */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have no bookings.</p>
      )}
    </div>
  );
}
