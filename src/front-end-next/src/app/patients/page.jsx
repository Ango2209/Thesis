import CreateButton from "../(components)/CreateButton/CreateButton";
import PatientTable from "./PatientTable";

const Patients = () => {
  return (
    <div className="container mx-auto p-6 md:p-8 lg:p-10">
      <PatientTable className="w-full" />
      <CreateButton href="/patients/create" />
    </div>
  );
};

export default Patients;
