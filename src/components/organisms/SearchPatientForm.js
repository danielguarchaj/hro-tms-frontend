import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import {
  updateInput as updateInputPatient,
  getPatients,
} from "@redux/reducers/patients";
import { onlyDigits } from "../../utils/helpers";

const SearchPatientForm = () => {
  const dispatch = useDispatch();
  const [radioValue, setRadioValue] = useState("clinicalHistory");

  const {
    searchForm: {
      clinicalHistory,
      firstName,
      firstLastname,
      secondName,
      secondLastname,
      thirdLastname,
    },
    fetchingPatientsStatus,
  } = useSelector((state) => state.patients);

  const { token } = useSelector((state) => state.auth);

  const handleChangeRadio = (event) => {
    setRadioValue(event.target.value);
  };

  const handleChangeSearchInput = (field, value) => {
    dispatch(updateInputPatient({ field, value }));
  };

  const validClinicalHistory = onlyDigits(clinicalHistory);
  const validNamesParams = firstName && firstLastname;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fetchingPatientsStatus === "loading") {
      return;
    }
    if (validClinicalHistory && radioValue === "clinicalHistory") {
      dispatch(
        getPatients({
          payload: {
            searchBy: radioValue,
            clinicalHistory,
          },
          token,
        })
      );
      return;
    }
    if (validNamesParams && radioValue === "names") {
      dispatch(
        getPatients({
          payload: {
            searchBy: radioValue,
            queryParams: {
              PrimerNombre: firstName,
              PrimerApellido: firstLastname,
              SegundoNombre: secondName,
              SegundoApellido: secondLastname,
              TercerApellido: thirdLastname,
            },
          },
          token,
        })
      );
      return;
    }
  };

  return (
    <Card variant="outlined" sx={{ overflow: "unset" }}>
      <CardContent sx={{ paddingBottom: "0.5rem!important" }}>
        <div
          style={{
            textAlign: "left",
          }}
        >
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={radioValue}
              onChange={handleChangeRadio}
            >
              <FormLabel
                id="demo-controlled-radio-buttons-group"
                style={{ marginRight: "1rem" }}
              >
                Buscar por
              </FormLabel>
              <FormControlLabel
                value="clinicalHistory"
                control={<Radio />}
                label="Historia Clinica"
              />
              <FormControlLabel
                value="names"
                control={<Radio />}
                label="Nombres"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              marginBottom: "0.5rem",
            }}
          >
            {radioValue === "clinicalHistory" && (
              <TextField
                value={clinicalHistory}
                onChange={(e) =>
                  handleChangeSearchInput("clinicalHistory", e.target.value)
                }
                label="Historia Clinica"
                size="small"
                error={!validClinicalHistory}
                helperText={
                  !validClinicalHistory ? "Ingrese unicamente numeros" : ""
                }
                sx={{ marginRight: "1rem" }}
              />
            )}
            {radioValue === "names" && (
              <>
                <TextField
                  id="textFieldFirstName"
                  sx={{ width: "100%", marginRight: "0.5rem" }}
                  value={firstName}
                  onChange={(e) =>
                    handleChangeSearchInput("firstName", e.target.value)
                  }
                  label="Primer nombre"
                  size="small"
                  error={!firstName}
                  helperText={!firstName ? "Ingrese el primer nombre" : ""}
                />
                <TextField
                  id="textFieldFirstLastName"
                  sx={{ width: "100%", marginRight: "0.5rem" }}
                  value={firstLastname}
                  onChange={(e) =>
                    handleChangeSearchInput("firstLastname", e.target.value)
                  }
                  label="Primer apellido"
                  size="small"
                  error={!firstLastname}
                  helperText={
                    !firstLastname ? "Ingrese el primer apellido" : ""
                  }
                />
                <TextField
                  sx={{ width: "100%", marginRight: "0.5rem" }}
                  value={secondName}
                  onChange={(e) =>
                    handleChangeSearchInput("secondName", e.target.value)
                  }
                  label="Segundo nombre"
                  size="small"
                />
                <TextField
                  sx={{ width: "100%", marginRight: "0.5rem" }}
                  value={secondLastname}
                  onChange={(e) =>
                    handleChangeSearchInput("secondLastname", e.target.value)
                  }
                  label="Segundo apellido"
                  size="small"
                />
                <TextField
                  sx={{ width: "100%", marginRight: "0.5rem" }}
                  value={thirdLastname}
                  onChange={(e) =>
                    handleChangeSearchInput("thirdLastname", e.target.value)
                  }
                  label="Tercer apellido"
                  size="small"
                />
              </>
            )}
            <Button
              sx={{ maxHeight: "40px", maxWidth: "330px" }}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={fetchingPatientsStatus === "loading"}
            >
              Buscar paciente
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchPatientForm;
