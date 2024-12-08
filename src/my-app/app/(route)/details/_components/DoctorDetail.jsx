"use client";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import BookAppointment from "./BookAppointment";
import { useRouter } from "next/navigation";
import { useGetDoctorByIdQuery } from "@/state/api";

function DoctorDetail({ recordId }) {
  const { data: doctor, error, isLoading } = useGetDoctorByIdQuery(recordId);
  const appointmentTypes = [
    {
      id: "general",
      name: "General Consultation",
      price: 100000,
    },
    {
      id: "service",
      name: "Service Consultation",
      price: 200000,
    },
    // Add more types as needed
  ];

  // Default to the first type in the array
  const [appointmentType, setAppointmentType] = useState(appointmentTypes[0]?.id || "");

  const router = useRouter();
  if (typeof window !== "undefined") {
    const patient = localStorage.getItem("Patient");

    if (!patient) {
      router.push("/login");
      return null;
    }
  }

  // Find the selected appointment type object
  const selectedType = appointmentTypes.find((type) => type.id === appointmentType);

  const handleAppointmentTypeChange = (e) => {
    setAppointmentType(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Doctor Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-[1px] p-5 mt-5 rounded-lg">
        {/* Doctor Image */}
        <div className="flex justify-center md:justify-start">
          {doctor && <Image src={`${doctor?.avatar}`} width={200} height={200} alt="doctor-image" className="rounded-lg object-cover h-[300px] w-[300px]" />}
        </div>
        {/* Doctor Info */}
        <div className="col-span-2 mt-5 flex flex-col gap-3 items-start">
          <h2 className="font-bold text-2xl">{doctor?.fullname}</h2>
          <h2 className="flex gap-2 text-gray-500 text-md">
            <GraduationCap />
            <span>{doctor?.years_of_experience} years of experience</span>
          </h2>
          <h2 className="text-md flex gap-2 text-gray-500">
            <MapPin />
            <span>{doctor?.address}</span>
          </h2>
          <h2 className="text-[10px] bg-blue-100 p-1 rounded-full px-2 text-primary">{doctor?.specialized || "Dentist"}</h2>
          {/* Appointment Type */}
          <div className="p-3 border-[1px] rounded-lg mt-5">
            <h2 className="font-bold text-[20px] mb-3">Select Appointment Type</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {appointmentTypes?.map((type) => (
                <label
                  key={type.id}
                  className="flex flex-col items-center justify-center border-2 rounded-lg py-4 px-6 cursor-pointer hover:bg-orange-50 transition text-center hover:border-orange-500 focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-500"
                >
                  <input type="radio" value={type.id} checked={appointmentType === type.id} onChange={handleAppointmentTypeChange} className="hidden" />
                  <div className={appointmentType === type.id ? "text-orange-600" : "text-gray-700"}>
                    <p className="text-sm font-medium">{type.name}</p>
                    <p className="font-bold text-lg">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(type.price)}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Pass the full selected type object */}
          <BookAppointment doctor={doctor} type={selectedType} />
        </div>
      </div>

      {/* About Section */}
      <div className="p-3 border-[1px] rounded-lg mt-5">
        <h2 className="font-bold text-[20px]">About Me</h2>
        <p className="text-gray-500 tracking-wide mt-2">
          {`I am Dr. ${doctor?.fullname}, a dedicated and compassionate healthcare professional with over ${doctor?.years_of_experience} years of experience in ${
            doctor?.specialized
          }. My approach to medicine combines cutting-edge medical treatments with a holistic view of patient care, ensuring that each individual receives personalized attention. I specialize in ${
            doctor?.specialized || "[key areas of expertise, e.g., cardiology, pediatrics]"
          }, and I am passionate about helping my patients achieve optimal health and well-being. My philosophy centers around understanding my patients' unique needs, fostering open communication, and empowering them with the knowledge they need to make informed decisions about their health.`}
        </p>
      </div>
    </div>
  );
}

export default DoctorDetail;
