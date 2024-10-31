"use client";
import { useGetAppointmentsPatientIdQuery,useGetMedicalRecordsQuery,useUpdateAppointmentDateMutation } from "@/state/api";
import { CalendarIcon, ClockIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";



export default function MyBookings() {
  const router = useRouter();
  if (typeof window !== "undefined") {
    const patient = localStorage.getItem("Patient");

    if (!patient) {
      router.push('/login');
      return null; 
    }
  }
  
  const user = JSON.parse(localStorage.getItem("Patient"))
  const [activeDialog, setActiveDialog] = useState(null);
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [updateAppointmentDate] = useUpdateAppointmentDateMutation(); 
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
 
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

  const openDialog = (dialogType, booking) => {
    setActiveDialog(dialogType); 
      setSelectedBooking(booking); 
    
  };

  const handleCancel = async()=>{

  }

  const handleReschedule = async () => {
    try {
      await updateAppointmentDate({ id: selectedBooking?._id, data: { date_of_visit: date, start_time: selectedTime } }).unwrap();
      toast.success(`Rescheduled to: ${date.toLocaleDateString()} at ${selectedTime}`);
      refetch()
      closeDialog();
    } catch (error) {
      console.error("Failed to reschedule:", error);
    }
  };
  const closeDialog = () => {
    setActiveDialog(null); // Close the dialog
  };
  const {
    data: bookings,
    refetch,
    error,
    isLoading,
  } = useGetAppointmentsPatientIdQuery(user._id);

  // const {
  //   data: medical_records,
  // }= useGetMedicalRecordsQuery(user._id)

  const medical_records = [
    {
      record_date: new Date('2023-01-01'),
      diagnosis: "Flu",
      notes: "Patient showed symptoms of flu.",
      complaint: "Fever and cough",
      treatment: "Rest and hydration",
      vital_signs: "BP: 120/80, Temp: 101°F",
      prescriptions: ["Paracetamol", "Cough Syrup"],
      attachments: [],
      doctor: "60d5ec49f1b2c8b1f8c8e4b1" // Example ObjectId
    },
    {
      record_date: new Date('2023-02-15'),
      diagnosis: "Allergy",
      notes: "Patient has seasonal allergies.",
      complaint: "Sneezing and itchy eyes",
      treatment: "Antihistamines",
      vital_signs: "BP: 118/76, Temp: 98.6°F",
      prescriptions: ["Antihistamine"],
      attachments: [],
      doctor: "60d5ec49f1b2c8b1f8c8e4b2" // Example ObjectId
    }
  ];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading bookings</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      {bookings && bookings.length > 0 ? (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="p-6 bg-white shadow-md rounded-lg transition-transform transform"
            >
              <div className="flex justify-between">
                {/* Doctor Info */}
                <div className="flex items-start space-x-6 mt-4 ml-16">
                  <img
                    src={`https://i.pravatar.cc/150?img=${booking._id}`}
                    alt={booking.doctor.fullname}
                    className="w-20 h-20 rounded-full border"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Dr. {booking.doctor.fullname}
                    </h3>
                    <p className="text-gray-600">
                      DOB: {new Date(booking.doctor.dob).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      Address: {booking.doctor.address}
                    </p>
                    <p className="text-gray-600">
                      Phone: {booking.doctor.phone}
                    </p>
                    <p className="text-gray-600">
                      Email: {booking.doctor.email}
                    </p>
                  </div>
                </div>
                {/* Patient Info */}
                <div className="flex justify-between items-center mb-4 mr-16">
                  <div>
                    <p className="text-gray-600 flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2" /> Date of Visit:{" "}
                      {new Date(booking.date_of_visit).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2" /> Start Time:{" "}
                      {booking.start_time} 
                    </p>
                    <p className="text-gray-600">
                      Purpose of Visit: {booking.purpose_visit}
                    </p>
                  </div>
                  <div
                    className={`ml-12 px-3 py-1 rounded-full font-semibold text-sm ${
                      booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              </div>
              {/* Booking Status & Description */}
              <div className="mt-4">
                <p className="text-gray-600">
                  Description: {booking.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-4">
                {booking.status === "Pending" ? (
                  <button
                    onClick={() => openDialog('reschedule', booking)} // Open Reschedule dialog
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Reschedule
                  </button>
                ) : (
                  <button
                    onClick={() => openDialog('viewMedicalRecords')} // Open View Medical Records dialog
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    View Medical Records
                  </button>
                )}
                <button
                  onClick={() => openDialog('cancel')} // Open Cancel dialog
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>

              {/* Dialogs */}
              <Dialog open={activeDialog === "reschedule"} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
       
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                  {/* Calendar */}
                  <div className="flex flex-col gap-3 items-baseline">
                    <h2 className="flex gap-2 items-center">
                      <CalendarDays className="text-primary h-5 w-5" />
                    </h2>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={isPastDay}
                    />
                  </div>

                  {/* Time slot */}
                  <div className="mt-3">
                    <h2 className="flex gap-2 items-center mb-3">
                      <Clock className="text-primary h-5 w-5" />
                      Select Time Slot
                    </h2>
                    <div className="grid grid-cols-3 gap-3 border rounded-lg">
                      {timeSlot.map((item, index) => {
                        return (
                          <h2
                            key={index}
                            onClick={() => setSelectedTime(item.time)}
                            className={`p-2 border text-center hover:bg-primary hover:text-white cursor-pointer rounded-full ${
                              item.time == selectedTime
                                ? "bg-primary text-white"
                                : ""
                            }`}
                          >
                            {item.time}
                          </h2>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleReschedule}>Confirm Reschedule</Button>
            <Button onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Medical Records Dialog */}
      <Dialog open={activeDialog === "viewMedicalRecords"} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medical Records</DialogTitle>
            <DialogDescription>
              {isLoading ? (
                <p>Loading records...</p>
              ) : (
              <ul className="space-y-4">
                {medical_records.map((record, index) => (
                  <li key={index} className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
                    <div className="flex flex-col">
                      <div className="mb-2">
                        <strong>Date:</strong> <span className="text-gray-700">{record.record_date.toLocaleDateString()}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Diagnosis:</strong> <span className="text-gray-700">{record.diagnosis}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Notes:</strong> <span className="text-gray-700">{record.notes}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Complaint:</strong> <span className="text-gray-700">{record.complaint}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Treatment:</strong> <span className="text-gray-700">{record.treatment}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Vital Signs:</strong> <span className="text-gray-700">{record.vital_signs}</span>
                      </div>
                      <div className="mb-2">
                        <strong>Prescriptions:</strong> <span className="text-gray-700">{record.prescriptions.join(", ")}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={activeDialog === "cancel"} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCancel}>Confirm Cancel</Button>
            <Button onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You have no bookings.</p>
      )}
    </div>
  );
}
