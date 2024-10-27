"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock } from "lucide-react";
import { toast } from "react-toastify"; // Assuming you are using react-toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import styles for notifications
import {
  useAddBookingAppointmentMutation,
  useAddNotificationMutation,
} from "@/state/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

function BookAppointment({ doctor }) {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [purposeVisit, setPurposeVisit] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog open state

  const [addBookingAppointment, { isLoading }] =
    useAddBookingAppointmentMutation(); // Initialize mutation

  const [addNotification] = useAddNotificationMutation(); // Initialize mutation
  const { user } = useKindeBrowserClient();

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

  const handleSubmit = async () => {
    if (!purposeVisit) {
      toast.error("Purpose of visit is required.");
      return;
    }

    const appointment = {
      patient_name: user.given_name + " " + user.family_name,
      purpose_visit: purposeVisit,
      date_of_visit: date,
      start_time: selectedTime,
      end_time: "End Time",
      doctor: doctor._id,
      patient: null,
      status: "Pending",
      description: "Description",
    };
    const notification = {
      patientId: null,
      doctorId: doctor._id,
      title: "New Appointment",
      content: `You have a new appointment with Patient ${
        user.given_name + " " + user.family_name
      } on ${date} at ${selectedTime}`,
      isRead: false,
      date,
    };
    try {
      await addBookingAppointment(appointment).unwrap(); // Execute the mutation
      await addNotification(notification).unwrap(); // Execute the mutation
      toast.success("Appointment booked successfully!");
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
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

          <div className="grid gap-4 py-4">
            <div>
              <label
                for="Purpose"
                class="block text-sm font-medium text-gray-700"
              >
                {" "}
                Purpose{" "}
              </label>

              <textarea
                id="purpose_visit"
                class="mt-2 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
                rows="4"
                placeholder="Enter any additional order notes..."
                value={purposeVisit}
                onChange={(e) => setPurposeVisit(e.target.value)}
              ></textarea>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <>
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
            </>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BookAppointment;
