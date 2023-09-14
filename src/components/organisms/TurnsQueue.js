import { useSelector, useDispatch } from "react-redux";
import { Typography, Alert, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { useEffect } from "react";
import {
  getTurns,
  setSnackbarFailedTurnShow,
  setSnackbarSuccessTurnShow,
} from "@redux/reducers/turns";
import { getAreas } from "@redux/reducers/auth";
import { APP_URLS } from "@routes";

import { StyledTableCell } from "@utils/styles";

import TurnActionMenu from "./TurnActionMenu";

const buildTableHeader = () => {
  const columns = [
    "Orden",
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

const TurnsQueue = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTurns());
    dispatch(getAreas());
  }, [dispatch]);

  const {
    fetchingTurnsStatus,
    turnQueue,
    snackbarFailedTurnShow,
    snackbarSuccessTurnShow,
    creatingTurnStatus,
  } = useSelector((state) => state.turns);

  const handleCloseSnackbarSuccess = () =>
    dispatch(setSnackbarSuccessTurnShow(false));

  const handleCloseSnackbarError = () =>
    dispatch(setSnackbarFailedTurnShow(false));

  if (turnQueue.length === 0 && fetchingTurnsStatus !== "loading") {
    return (
      <Alert
        severity="warning"
        sx={{ margin: "0 auto", width: "30rem", marginTop: "3rem" }}
      >
        No se han generado turnos para el dia de hoy
      </Alert>
    );
  }

  if (fetchingTurnsStatus === "failed") {
    return (
      <Alert
        variant="filled"
        severity="error"
        sx={{ margin: "0 auto", width: "30rem", marginTop: "3rem" }}
      >
        Error al cargar los turnos del dia, intente de nuevo
      </Alert>
    );
  }

  if (fetchingTurnsStatus === "loading") {
    return (
      <Box
        sx={{
          width: "75%",
          margin: "0 auto",
          textAlign: "center",
          marginTop: "3rem",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
          CARGANDO TURNOS DEL DIA
        </Typography>
        <LinearProgress color="warning" />
      </Box>
    );
  }

  const buildTableContent = () => {
    return turnQueue.map((turn, index) => (
      <TurnActionMenu
        turn={turn}
        index={index}
        key={"TurnActionMenuKey" + index}
      />
    ));
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ padding: "0!important" }}>
        <Box
          sx={{
            "& .MuiTextField-root": { marginBottom: 1, width: "100%" },
            textAlign: "left",
          }}
          noValidate
          autoComplete="off"
        >
          {creatingTurnStatus === "loading" && (
            <Snackbar open={true} message="Creando turno" />
          )}
          <Snackbar
            open={snackbarSuccessTurnShow}
            autoHideDuration={6000}
            onClose={handleCloseSnackbarSuccess}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbarSuccess}
              severity="success"
              sx={{ width: "100%" }}
              variant="filled"
            >
              Turno creado correctamente
            </Alert>
          </Snackbar>
          <Snackbar
            open={snackbarFailedTurnShow}
            autoHideDuration={6000}
            onClose={handleCloseSnackbarError}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbarError}
              severity="error"
              sx={{ width: "100%" }}
              variant="filled"
            >
              Error al crear el turno, intente de nuevo
            </Alert>
          </Snackbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem",
              paddingBottom: "0",
              paddingTop: "0.25rem",
            }}
          >
            <Typography variant="subtitle2">
              Pacientes en cola: {turnQueue.length}
            </Typography>
            <Typography variant="subtitle2">
              <Link
                href={APP_URLS.queue}
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                Mostrar sala de espera <OpenInNew />
              </Link>
            </Typography>
          </Box>
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

export default TurnsQueue;
