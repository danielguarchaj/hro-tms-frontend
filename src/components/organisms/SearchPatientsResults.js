import { useSelector, useDispatch } from "react-redux";
import { Typography, Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { createTurn } from "@redux/reducers/turns";
import { setPatientDialogOpen } from "@redux/reducers/patients";

import TableSkeletonLoader from "@molecules/TableSkeletonLoader";

import {
  cleanAndCapitalizeParagraph,
  cleanClinicHistory,
} from "@utils/helpers";

import {
  HTTP_STATUS_CODE_CONTENT_TOO_LARGE,
  HTTP_STATUS_CODE_NOT_FOUND,
  MAX_PATIENTS_SEARCH_RESULTS_ALLOWED,
} from "@utils/constants";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const SKELETON_PLACEHOLDER_ROWS = 12;

const columns = [
  "Historia Clinica",
  "Nombre completo",
  "Genero",
  "Padre",
  "Madre",
  "Responsable",
];

const buildTableHeader = () => {
  return columns.map((column, index) => (
    <StyledTableCell
      align="center"
      key={`${column.codigo}-StyledTableCellKeyCell-${index}`}
    >
      {column}
    </StyledTableCell>
  ));
};

const SearchPatientsResults = () => {
  const dispatch = useDispatch();
  const { fetchingPatientsStatus, searchResult, searchResultStatus } =
    useSelector((state) => state.patients);
  const { user, token } = useSelector((state) => state.auth);

  const areaName = user?.area?.name || "";
  const areaId = user?.area?.id || null;

  if (
    searchResultStatus === HTTP_STATUS_CODE_CONTENT_TOO_LARGE &&
    fetchingPatientsStatus !== "loading"
  ) {
    return (
      <Alert
        variant="filled"
        severity="error"
        sx={{ marginLeft: "1rem", marginRight: "1rem" }}
      >
        Se encontraron más de {MAX_PATIENTS_SEARCH_RESULTS_ALLOWED} pacientes
        con los datos ingresados, agregue más detalles a la búsqueda
      </Alert>
    );
  }

  if (
    searchResultStatus === HTTP_STATUS_CODE_NOT_FOUND &&
    fetchingPatientsStatus !== "loading"
  ) {
    return (
      <Alert
        variant="filled"
        severity="error"
        sx={{ marginLeft: "1rem", marginRight: "1rem" }}
      >
        No se encontraron pacientes con los datos ingresados
      </Alert>
    );
  }

  if (fetchingPatientsStatus === "failed") {
    return (
      <Alert variant="filled" severity="error">
        Error en la busqueda de pacientes, intente de nuevo
      </Alert>
    );
  }

  const handleClickPatient = (patient) => {
    const { noHistoriaClinica, nombres, apellidos } = patient;
    if (
      window.confirm(
        `Crear cita para paciente ${noHistoriaClinica} - ${nombres} - ${apellidos}`
      )
    ) {
      dispatch(
        createTurn({ payload: { ...patient, areaName, areaId }, token })
      );
      dispatch(setPatientDialogOpen(false));
    }
  };

  const totalPatientsFound = searchResult.length;

  const buildTableContent = () => {
    return searchResult.map((patient) => {
      const cleanedClinicHistory = cleanClinicHistory(
        patient.noHistoriaClinica
      );
      const cleanedNames = cleanAndCapitalizeParagraph(patient.nombres);
      const cleanedLastnames = cleanAndCapitalizeParagraph(patient.apellidos);
      return (
        <StyledTableRow
          key={`${patient.codigo}-StyledTableRow-Key`}
          onClick={() =>
            handleClickPatient({
              ...patient,
              noHistoriaClinica: cleanedClinicHistory,
              nombres: cleanedNames,
              apellidos: cleanedLastnames,
            })
          }
          sx={{
            "&:hover": {
              backgroundColor: "lightblue",
              cursor: "pointer",
            },
          }}
        >
          <StyledTableCell component="th" scope="row">
            {cleanedClinicHistory}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {`${cleanedNames} ${cleanedLastnames}`}
          </StyledTableCell>
          <StyledTableCell align="center">{patient.sexo}</StyledTableCell>
          <StyledTableCell align="center">
            {patient.nombrePadre}
          </StyledTableCell>
          <StyledTableCell align="center">
            {patient.nombreMadre}
          </StyledTableCell>
          <StyledTableCell align="center">
            {patient.nombre_Resposable}
          </StyledTableCell>
        </StyledTableRow>
      );
    });
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ padding: "0!important" }}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { marginBottom: 1, width: "100%" },
            textAlign: "left",
          }}
          noValidate
          autoComplete="off"
        >
          {fetchingPatientsStatus !== "loading" && (
            <Typography variant="subtitle2">
              Resultado: {totalPatientsFound} pacientes
            </Typography>
          )}
          {fetchingPatientsStatus === "loading" && (
            <Typography variant="subtitle2">
              Buscando pacientes <CircularProgress size={15} />
            </Typography>
          )}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>{buildTableHeader()}</TableRow>
              </TableHead>
              <TableBody>
                {fetchingPatientsStatus === "loading" ? (
                  <TableSkeletonLoader
                    rowsCount={SKELETON_PLACEHOLDER_ROWS}
                    columnsCount={columns.length}
                  />
                ) : (
                  buildTableContent()
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SearchPatientsResults;
