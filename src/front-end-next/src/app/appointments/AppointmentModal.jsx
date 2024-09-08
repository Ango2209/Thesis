import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AppointmentModal = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-green-400 to-green-700 p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">
                {appointment.patientName}
              </h2>
              <p className="text-lg opacity-90">{appointment.purpose}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Date" value={appointment.date} icon="🗓️" />
                <InfoItem
                  label="Time"
                  value={`${appointment.startTime} - ${appointment.endTime}`}
                  icon="⏰"
                />
                <InfoItem label="Doctor" value={appointment.doctor} icon="👨‍⚕️" />
                <InfoItem label="Status" value={appointment.status} icon="🚦" />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="bg-gray-100 p-3 rounded-lg">
                  {appointment.description}
                </p>
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full 
                           hover:from-green-600 hover:to-green-700 transition duration-300 ease-in-out 
                           transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-center space-x-2">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default AppointmentModal;
