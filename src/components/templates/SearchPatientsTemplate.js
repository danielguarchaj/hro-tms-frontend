import React from "react";
import { useDispatch, useSelector } from "react-redux";

import FullScreenDialog from "@organisms/FullScreenDialog";
import SearchPatientForm from "@organisms/SearchPatientForm";
import SearchPatientsResults from "@organisms/SearchPatientsResults";

import { setPatientDialogOpen } from "@redux/reducers/patients";

const SearchPatientsTemplate = () => {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setPatientDialogOpen(false));

  const { searchPatientDialogOpen } = useSelector((state) => state.patients);
  const { user } = useSelector((state) => state.auth);

  const area = user?.area.name;

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
        open={searchPatientDialogOpen}
        title={`Crear nuevo turno para ${area || ""}`}
        content={dialogContent}
        scroll="body"
      />
    </div>
  );
};

export default SearchPatientsTemplate;
