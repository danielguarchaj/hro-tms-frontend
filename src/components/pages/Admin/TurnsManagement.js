import TurnsQueue from "@organisms/TurnsQueue";
import SearchPatientsTemplate from "@templates/SearchPatientsTemplate";
// import TurnsBottomNavigation from "@organisms/TurnsBottomNavigation";

const TurnsManagement = () => {
  return (
    <>
      {/* <TurnsBottomNavigation /> */}
      <TurnsQueue />
      <SearchPatientsTemplate />
    </>
  );
};

export default TurnsManagement;
