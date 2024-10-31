"use client";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import BookAppointment from "./BookAppointment";
import { useRouter } from "next/navigation";
import { useGetDoctorByIdQuery } from "@/state/api";

function DoctorDetail({ recordId }) {
  const router = useRouter();
  if (typeof window !== "undefined") {
    const patient = localStorage.getItem("Patient");

    if (!patient) {
      router.push('/login');
      return null; 
    }
  }
  
  const { data: doctor, error, isLoading } = useGetDoctorByIdQuery(recordId);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 border-[1px] p-5 mt-5 rounded-lg">
        {/*Doctor Image*/}
        <div>
          {doctor && (
            <Image
              src={`/${doctor?.avatar}`}
              width={200}
              height={200}
              alt="doctor-image"
              className="rounded-lg h-[270px] object-cover"
            />
          )}
        </div>
        {/*Doctor Info*/}
        <div className="col-span-2 mt-5 flex flex-col gap-3 items-baseline">
          <h2 className="font-bold text-2xl">{doctor?.fullname}</h2>
          <h2 className="flex gap-2 text-gray-500 text-md">
            <GraduationCap />
            <span>7 yearOfExp</span>
          </h2>
          <h2 className="text-md flex gap-2 text-gray-500">
            <MapPin />
            <span>{doctor?.address}</span>
          </h2>
          <h2 className="text-[10px] bg-blue-100 p-1 rounded-full px-2 text-primary ">
            Dentist
          </h2>

          <BookAppointment doctor={doctor} />
        </div>
      </div>
      <div className="p-3 border-[1px] rounded-lg mt-5">
        <h2 className="font-bold text-[20px]">About me</h2>
        <p className="text-gray-500 tracking-wide mt-2">
         { `I am Dr. ${doctor?.fullname}, a dedicated and compassionate healthcare
          professional with over ${doctor?.year_of_experience} years of experience in ${doctor?.specialized}.
          My approach to medicine combines cutting-edge medical
          treatments with a holistic view of patient care, ensuring that each
          individual receives personalized attention. I specialize in [mention
          key areas of expertise or focus, such as cardiology, pediatrics,
          etc.], and I am passionate about helping my patients achieve optimal
          health and well-being. My philosophy centers around understanding my
          patients&apos; unique needs, fostering open communication, and empowering
          them with the knowledge they need to make informed decisions about
          their health.`}
        </p>
      </div>
    </>
  );
}

export default DoctorDetail;
