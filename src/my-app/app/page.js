import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./(components)/Hero/Hero";
import CategorySearch from "./(components)/CategorySearch/CategorySearch";
import DoctorList from "./(components)/DoctorList/DoctorList";

export default function Home() {
  return (
    <div>
      <Hero />

      {/*Search bar + Category*/}
      <CategorySearch />

      {/*Popular Doctor List*/}
      <DoctorList />
    </div>
  );
}
