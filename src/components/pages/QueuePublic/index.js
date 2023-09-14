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
import { useEffect, useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
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

const buildTableHeader = () => {
  const columns = [
    "Historia Clinica",
    "Nombre completo",
    "Genero",
    "Padre",
    "Madre",
    "Responsable",
  ];
  return columns.map((column, index) => (
    <StyledTableCell align="left" key={`StyledTableCellKeyCell-${index}`}>
      {column}
    </StyledTableCell>
  ));
};

const QueuePublic = () => {
  const existingTurns = localStorage.getItem("turns") || "[]";
  const [turns, setTurns] = useState(JSON.parse(existingTurns));

  // Define a function to handle changes in localStorage
  const handleLocalStorageChange = (e) => {
    // Handle the change, e.newValue contains the updated value
    console.log(`localStorage changed: ${e.newValue} ${e}`);
    if (e.key === "turns") {
      setTurns(JSON.parse(e.newValue));
    }
  };

  useEffect(() => {
    // Add an event listener for the 'storage' event on the window object
    window.addEventListener("storage", handleLocalStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  return (
    <div>
      {/* <h1>WebSocket Messages</h1> */}
      <h1>Localstorage listening changes</h1>
      <ul>
        {turns.map((message, index) => (
          <li key={index}>{JSON.stringify(message)}</li>
        ))}
      </ul>
    </div>
  );

  if ([].length === 0 && "fetchingTurnsStatus" !== "loading") {
    return (
      <Alert variant="filled" severity="error">
        No se han generado turnos para el dia de hoy
      </Alert>
    );
  }

  if ("fetchingTurnsStatus" === "failed") {
    return (
      <Alert variant="filled" severity="error">
        Error al cargar los turnos del dia, intente de nuevo
      </Alert>
    );
  }

  if ("fetchingTurnsStatus" === "loading") {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h6">CARGANDO TURNOS DEL DIA</Typography>
        <CircularProgress />
      </Box>
    );
  }

  // const handleClickPatient = (turn) => {
  //   const { noHistoriaClinica, nombres, apellidos } = turn;
  //   if (
  //     window.confirm(
  //       `Crear cita para paciente ${noHistoriaClinica} - ${nombres} - ${apellidos}`
  //     )
  //   ) {
  //     dispatch(createTurn(patient));
  //   }
  // };

  const buildTableContent = () => {
    return [].map((turn, index) => (
      <StyledTableRow
        key={`${turn.codigo}-StyledTableRow-Public-Key-${index}`}
        // onClick={() => handleClickPatient(turn)}
        sx={{
          "&:hover": {
            backgroundColor: "lightblue",
            cursor: "pointer",
          },
        }}
      >
        <StyledTableCell component="th" scope="row">
          {turn.noHistoriaClinica}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {`${turn.nombres} ${turn.apellidos}`}
        </StyledTableCell>
        <StyledTableCell align="right">{turn.sexo}</StyledTableCell>
        <StyledTableCell align="right">{turn.nombrePadre}</StyledTableCell>
        <StyledTableCell align="right">{turn.nombreMadre}</StyledTableCell>
        <StyledTableCell align="right">
          {turn.nombre_Resposable}
        </StyledTableCell>
      </StyledTableRow>
    ));
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
          <Typography variant="subtitle2">
            MOSTRANDO Pacientes en cola: {[].length}
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>{buildTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{buildTableContent()}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QueuePublic;
