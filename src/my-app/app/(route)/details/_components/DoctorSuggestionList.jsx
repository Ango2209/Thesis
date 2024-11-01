"use client";
import { useGetDoctorsQuery } from "@/state/api";
import Image from "next/image";
import React from "react";

function DoctorSuggestionList() {
  const { data: doctorList, error, isLoading } = useGetDoctorsQuery();
  return (
    <div className="p-4 border-[1px] mt-5 md:ml-5 ">
      <h2 className="mb-3 font-bold">Suggestion</h2>
      {doctorList?.map((doctor) => (
        <div
          key={doctor.id}
          className="mb-4 p-3 shadow-sm w-full cursor-pointer hover:bg-slate-100 rounded-lg flex items-center gap-3"
        >
          <Image
            src={`${doctor.avatar}`}
            width={64}
            height={64}
            alt="doctor"
            className="w-[70px] h-[90px] object-cover rounded-full"
          />
          <div>
            <h2 className="font-bold">{doctor.name}</h2>
            <h2 className="text-gray-500">{doctor.yearOfExp}</h2>
            <h2 className="text-gray-500">{doctor.address}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DoctorSuggestionList;
