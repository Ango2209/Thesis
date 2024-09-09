import CreateButton from "../(components)/CreateButton/CreateButton";
import PatientTable from "./PatientTable";

const Patients = () => {
  return (
    <div className="container mx-auto p-6">
      <PatientTable />
      <CreateButton href="/patients/create" />
    </div>
  );
};

export default Patients;
