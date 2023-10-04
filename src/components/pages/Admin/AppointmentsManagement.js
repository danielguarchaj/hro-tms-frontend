import SearchPatientsTemplate from "@templates/SearchPatientsTemplate";
import AppointmentsQuery from "@organisms/AppointmentsQuery";

const AppointmentsManagement = () => {
  return (
    <>
      <AppointmentsQuery />
      <SearchPatientsTemplate />
    </>
  );
};

export default AppointmentsManagement;
