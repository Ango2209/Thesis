'use client'
import DoctorList from '@/app/(components)/DoctorList/DoctorList'
import React, { useEffect } from 'react'

function Search({params}) {
  const doctorList = [
    {
      id: 1,
      image: "https://cdn-icons-png.flaticon.com/512/2810/2810101.png",
      title: "Cardiologist",
      name: "Dr. John Doe",
      yearOfExp: "15 years of experience",
      address: "123 Heartbeat Street, New York, NY",
      category:'Dentist',
    },
    {
      id: 2,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095137.png",
      title: "Dentist",
      name: "Dr. Jane Smith",
      yearOfExp: "10 years of experience",
      address: "456 Smile Avenue, Los Angeles, CA",
      category:'Dentist',
    },
    {
      id: 3,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095128.png",
      title: "Neurologist",
      name: "Dr. Sam Brown",
      yearOfExp: "8 years of experience",
      address: "789 Brainy Blvd, Chicago, IL",
      category:'Heart',
    },
    {
      id: 4,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095135.png",
      title: "Orthopedic",
      name: "Dr. Emily White",
      yearOfExp: "12 years of experience",
      address: "321 Bone Road, Houston, TX",
      category:'Lung',
    },
    {
      id: 5,
      image: "https://cdn-icons-png.flaticon.com/512/3095/3095120.png",
      title: "General Doctor",
      name: "Dr. Michael Green",
      yearOfExp: "20 years of experience",
      address: "654 Health Lane, Miami, FL",
      category:'Lung',
    },
  ];
  return (
    <div>
      <DoctorList doctorList={doctorList}/>
    </div>
  )
}

export default Search