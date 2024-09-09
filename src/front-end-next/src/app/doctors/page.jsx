import CreateButton from "../(components)/CreateButton/CreateButton";
import DoctorTable from "./DoctorTable";

const Doctors = () => {
  return (
    <div className="container mx-auto p-6">
      <DoctorTable />
      <CreateButton href="/doctors/create" />
    </div>
  );
};

export default Doctors;
