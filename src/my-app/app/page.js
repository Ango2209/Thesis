"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./(components)/Hero/Hero";
import CategorySearch from "./(components)/CategorySearch/CategorySearch";
import DoctorList from "./(components)/DoctorList/DoctorList";
import { useGetDoctorsQuery } from "@/state/api";
import BlogList from "./(components)/BlogList/BlogList";

export default function Home() {
  const { data: doctorList, error, isLoading } = useGetDoctorsQuery();
  return (
    <div>
      <Hero />

      {/*Search bar + Category*/}
      <CategorySearch />

      {/*Popular Doctor List*/}
      <DoctorList doctorList={doctorList} />

      {/*Blog List*/}
      <BlogList />
    </div>
  );
}
