import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

function CategorySearch() {
  const categoryList = [
    {
      id: 1,
      name: "Dentist",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767016.png",
    },
    {
      id: 2,
      name: "Cardiologist",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767028.png",
    },
    {
      id: 3,
      name: "Orthopedic",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767004.png",
    },
    {
      id: 4,
      name: "Neurologist",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767025.png",
    },
    {
      id: 5,
      name: "Otology",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767005.png",
    },
    {
      id: 6,
      name: "General Doctor",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767026.png",
    },
    {
      id: 7,
      name: "Surgeon",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767012.png",
    },
    {
      id: 8,
      name: "Psychotropic",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767018.png",
    },
    {
      id: 9,
      name: "Eye Specialist",
      icons: "https://cdn-icons-png.flaticon.com/512/2767/2767013.png",
    },
  ];

  return (
    <div className="mb-10 items-center flex flex-col gap-4">
      <h2 className="font-bold text-4xl tracking-wide">
        Search <span className="text-primary">Doctors</span>
      </h2>
      <h2 className="text-gray-500 text-xl">
        Search Your Doctor and Book Appointment in one click
      </h2>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="email" placeholder="Email" />
        <Button type="submit">Search</Button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 mt-5 lg:grid-cols-6">
        {categoryList.map((category, index) => (
          <div
            key={index}
            className="flex flex-col text-center cursor-pointer
            items-center p-5 bg-blue-50 m-2 rounded-lg gap-2 
            hover:scale-110 transition-all ease-in-out"
          >
            <Image src={category.icons} alt="icon" width={50} height={50} />
            <label className="text-blue-600 text-sm">{category.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySearch;
