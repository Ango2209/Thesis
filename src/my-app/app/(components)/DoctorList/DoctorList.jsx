import Image from "next/image";
import React from "react";

function DoctorList() {
  const doctorList = [
    {
      id: 1,
      image: "https://cdn-icons-png.flaticon.com/512/2810/2810101.png",
      title: "Cardiologist",
      name: "Dr. John Doe",
      yearOfExp: "15 years of experience",
      address: "123 Heartbeat Street, New York, NY",
    },
    {
      id: 2,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095137.png",
      title: "Dentist",
      name: "Dr. Jane Smith",
      yearOfExp: "10 years of experience",
      address: "456 Smile Avenue, Los Angeles, CA",
    },
    {
      id: 3,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095128.png",
      title: "Neurologist",
      name: "Dr. Sam Brown",
      yearOfExp: "8 years of experience",
      address: "789 Brainy Blvd, Chicago, IL",
    },
    {
      id: 4,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095135.png",
      title: "Orthopedic",
      name: "Dr. Emily White",
      yearOfExp: "12 years of experience",
      address: "321 Bone Road, Houston, TX",
    },
    {
      id: 5,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095120.png",
      title: "General Doctor",
      name: "Dr. Michael Green",
      yearOfExp: "20 years of experience",
      address: "654 Health Lane, Miami, FL",
    },
  ];

  return (
    <div className="mb-10 px-8">
      <h2 className="font-bold text-xl">Popular Doctors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-4">
        {doctorList?.length>0?
          doctorList.map((doctor, index) => (
            <div
              className="border-[1px] rounded-lg p-3 cursor-pointer "
              key={index}
            >
              <Image
                src={doctor.image}
                alt="doctor"
                width={500}
                height={200}
                className="h-[200px] w-full object-cover rounded-lg"
              />
              <div className="mt-3 items-baseline flex flex-col gap-1">
                <h2 className="text-[10px] bg-blue-100 p-1 rounded-full px-2 text-primary">
                  {doctor.title}
                </h2>
                <h2 className="font-bold">{doctor.name}</h2>
                <h2 className="text-primary text-sm">{doctor.yearOfExp}</h2>
                <h2 className="text-gray-500 text-sm">{doctor.address}</h2>
                <h2
                  className="p-2 px-3 border-[1px] border-primary text-primary
                 rounded-full w-full text-center text-[11px] mt-2 cursor-pointer
                 hover:bg-primary hover:text-white"
                >
                  Book Now
                </h2>
              </div>
            </div>
          ))
          :
          [1,2,3,4,5,6].map((item,index)=>{
            
            return <div key={index} className="h-[220px] bg-slate-200 w-full rounded-lg animate-pulse">
            
            </div>
          })
     }
      </div>
    </div>
  );
}

export default DoctorList;
