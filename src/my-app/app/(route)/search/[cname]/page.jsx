'use client'
import DoctorList from '@/app/(components)/DoctorList/DoctorList'
import React, { useEffect } from 'react'

function Search({params}) {
  const doctorList = [
    {
      id: 1,
      image: "/team-1.jpg",
      title: "Cardiologist",
      name: "Dr. John Doe",
      yearOfExp: "15 years of experience",
      address: "123 Heartbeat Street, New York, NY",
    },
    {
      id: 2,
      image: "/team-2.jpg",
      title: "Dentist",
      name: "Dr. Jane Smith",
      yearOfExp: "10 years of experience",
      address: "456 Smile Avenue, Los Angeles, CA",
    },
    {
      id: 3,
      image: "/team-3.jpg",
      title: "Neurologist",
      name: "Dr. Sam Brown",
      yearOfExp: "8 years of experience",
      address: "789 Brainy Blvd, Chicago, IL",
    },
    {
      id: 4,
      image: "/team-4.jpg",
      title: "Orthopedic",
      name: "Dr. Emily White",
      yearOfExp: "12 years of experience",
      address: "321 Bone Road, Houston, TX",
    },
    {
      id: 5,
      image: "/team-1.jpg",
      title: "General Doctor",
      name: "Dr. Michael Green",
      yearOfExp: "20 years of experience",
      address: "654 Health Lane, Miami, FL",
    },
    {
      id: 6,
      image: "/team-1.jpg",
      title: "General Doctor",
      name: "Dr. Michael Green",
      yearOfExp: "20 years of experience",
      address: "654 Health Lane, Miami, FL",
    },
  ];
  return (
    <div>
      <DoctorList doctorList={doctorList}/>
    </div>
  )
}

export default Search