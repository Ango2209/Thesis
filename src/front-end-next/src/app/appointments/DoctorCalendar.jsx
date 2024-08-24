import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppointmentModal from "./AppointmentModal";

const localizer = momentLocalizer(moment);

const DoctorCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const events = [
    {
      title: "Minah Mmassy - Teeth Whitening",
      start: new Date(2024, 7, 24, 12, 0),
      end: new Date(2024, 7, 24, 13, 0),
      patientName: "Minah Mmassy",
      purpose: "Teeth Whitening",
      date: "08/24/2024",
      startTime: "12:00 PM",
      endTime: "1:00 PM",
      doctor: "Hugo Lloris",
      status: "Scheduled",
      description: "She is coming for checkup",
    },
    // Add more events as needed
  ];

  const handleEventClick = (event) => {
    setSelectedAppointment(event);
    setModalOpen(true);
  };

  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={handleEventClick}
      />
      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default DoctorCalendar;
