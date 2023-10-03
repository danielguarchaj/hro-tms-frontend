import React from "react";
import { useDispatch, useSelector } from "react-redux";

import FullScreenDialog from "@organisms/FullScreenDialog";
import  SearchPatientForm from "@organisms/SearchPatientForm";
import SearchPatientsResults from "@organisms/SearchPatientsResults";

import { setFullScreenDialogOpen } from "@redux/reducers/admin";

const SearchPatientsTemplate = () => {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setFullScreenDialogOpen({ open: false, location: "" }));

  const { fullScreenDialogOpen, fullScreenDialogOpenAt } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  const area = user?.area?.name || "";
  const titleMap = {
    queue: `Crear nuevo turno para ${area || ""}`,
    appointments: `Crear nueva cita para ${area || ""}`,
  }
  const title = titleMap[fullScreenDialogOpenAt] || "";

  const dialogContent = (
    <>
      <SearchPatientForm />
      <SearchPatientsResults />
    </>
  );

  return (
    <div>
      <FullScreenDialog
        handleClose={handleClose}
        open={fullScreenDialogOpen}
        title={title}
        content={dialogContent}
        scroll="body"
      />
    </div>
  );
};

export default SearchPatientsTemplate;
