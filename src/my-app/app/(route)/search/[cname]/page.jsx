'use client'
import DoctorList from '@/app/(components)/DoctorList/DoctorList'
import React, { useEffect } from 'react'
import { useGetDoctorsQuery } from "@/state/api";

function Search({params}) {

  const { data: doctorList, error, isLoading } = useGetDoctorsQuery();

  return (
    <div>
      <DoctorList doctorList={doctorList}/>
    </div>
  )
}

export default Search