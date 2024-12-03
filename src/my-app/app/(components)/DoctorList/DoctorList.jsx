"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

function DoctorList({ doctorList, heading = "Popular Doctors" }) {
  const router = useRouter();

  return (
    <div className="mb-10 px-4 sm:px-8 md:px-16 lg:px-24">
      <h2 className="font-bold text-xl">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        {" "}
        {/* Changed to 5 columns */}
        {doctorList?.length > 0
          ? doctorList.map((doctor, index) => (
              <div
                className="border-[1px] rounded-lg p-3 cursor-pointer "
                key={index}
              >
                <Image
                  src={doctor?.avatar}
                  alt="doctor"
                  width={150} // Adjusted width
                  height={200} // Adjusted height
                  className="h-[400px] w-full object-cover rounded-lg" // Adjusted height
                />
                <div className="mt-3 items-baseline flex flex-col gap-1">
                  <h2 className="text-[10px] bg-blue-100 p-1 rounded-full px-2 text-primary">
                    {doctor.specialized}
                  </h2>
                  <h2 className="font-bold">{doctor.fullname}</h2>
                  <h2 className="text-primary text-sm">{doctor.yearOfExp}</h2>
                  <h2 className="text-gray-500 text-sm">{doctor.phone}</h2>
                  {/* add on click event to navigate to doctor details page */}
                  <Button
                    onClick={() => router.push(`/details/${doctor._id}`)}
                    className="p-2 px-3 border-[1px] border-primary text-primary
                 rounded-full w-full text-center text-[11px] mt-2 cursor-pointer
                 hover:bg-slate-600 hover:text-white text-white"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))
          : [1, 2, 3, 4, 5, 6].map((item, index) => {
              return (
                <div
                  key={index}
                  className="h-[220px] bg-slate-200 w-full rounded-lg animate-pulse"
                ></div>
              );
            })}
      </div>
    </div>
  );
}

export default DoctorList;
