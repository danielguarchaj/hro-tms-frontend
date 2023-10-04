import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  setSnackbarFailedAppointmentShow,
  setSnackbarSuccessAppointmentShow,
} from "@redux/reducers/appointments";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { updateQueryInput } from "@redux/reducers/appointments";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { buildDateFromPicker, formatDate } from "@utils/helpers";
import { ScreenSearchDesktop, FileDownload } from "@mui/icons-material";
import { StyledTableCell, StyledTableRow } from "@utils/styles";
import {
  getAppointments,
  getAppointmentsCsv,
} from "@redux/reducers/appointments";
import LoadingButton from "@mui/lab/LoadingButton";

const buildTableHeader = () => {
  const columns = [
    "Paciente",
    "Fecha",
    "Hora Inicio",
    "Hora Fin",
    "Lugar",
    "Notas",
  ];
  return columns.map((column, index) => (
    <StyledTableCell align="left" key={`StyledTableCellKeyCell-${index}`}>
      {column}
    </StyledTableCell>
  ));
};

const AppointmentsQuery = () => {
  const dispatch = useDispatch();
  const {
    snackbarFailedAppointmentShow,
    snackbarSuccessAppointmentShow,
    appointmentFetchingStatus,
    appointmentsQueryForm: { fromDate, toDate },
    appointments,
  } = useSelector((state) => state.appointments);
  const { token } = useSelector((state) => state.auth);

  const handleGetAppointments = () => {
    const queryParams = `fromDate=${fromDate}&toDate=${toDate}`;
    dispatch(getAppointments({ token, queryParams }));
  };

  const handleGetAppointmentsCsv = (targetCalendar = "outlook") => {
    const queryParams = `fromDate=${fromDate}&toDate=${toDate}&targetCalendar=${targetCalendar}`;
    dispatch(getAppointmentsCsv({ token, queryParams, targetCalendar }));
  };

  const loadingAppointments = appointmentFetchingStatus === "loading";

  const buildTableContent = () => {
    return appointments.map((aptmnt) => {
      return (
        <StyledTableRow key={`${aptmnt._id}-StyledTableRow-Key`}>
          <StyledTableCell component="th" scope="row">
            {aptmnt.subject}
          </StyledTableCell>
          <StyledTableCell component="th" scope="row">
            {formatDate(aptmnt.date)}
          </StyledTableCell>
          <StyledTableCell align="center">{aptmnt.startTime}</StyledTableCell>
          <StyledTableCell align="center">{aptmnt.endTime}</StyledTableCell>
          <StyledTableCell align="center">{aptmnt.location}</StyledTableCell>
          <StyledTableCell align="center">{aptmnt.description}</StyledTableCell>
        </StyledTableRow>
      );
    });
  };

  const disableButtons = !fromDate || !toDate;

  return (
    <Card variant="outlined" sx={{ marginTop: 0.3 }}>
      <CardContent sx={{ padding: "0!important" }}>
        <Box
          sx={{
            "& .MuiTextField-root": { marginBottom: 1, width: "100%" },
            textAlign: "left",
          }}
        >
          <Snackbar
            open={loadingAppointments}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ transform: "translate(750%, 0px) !important" }}
          >
            <Alert severity="info" sx={{ width: "100%" }} variant="filled">
              Cargando citas
            </Alert>
          </Snackbar>
          <Snackbar
            open={snackbarSuccessAppointmentShow}
            autoHideDuration={6000}
            onClose={() => dispatch(setSnackbarSuccessAppointmentShow(false))}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ transform: "translate(450%, 0px) !important" }}
          >
            <Alert
              onClose={() => dispatch(setSnackbarSuccessAppointmentShow(false))}
              severity="success"
              sx={{ width: "100%" }}
              variant="filled"
            >
              Cita creada correctamente
            </Alert>
          </Snackbar>
          <Snackbar
            open={snackbarFailedAppointmentShow}
            autoHideDuration={6000}
            onClose={() => dispatch(setSnackbarFailedAppointmentShow(false))}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ transform: "translate(350%, 0px) !important" }}
          >
            <Alert
              onClose={() => dispatch(setSnackbarFailedAppointmentShow(false))}
              severity="error"
              sx={{ width: "100%" }}
              variant="filled"
            >
              Error al guardar la cita, intente de nuevo
            </Alert>
          </Snackbar>
          <Box
            sx={{
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateField", "TimeField"]}>
                <DemoItem label="Fecha de inicio">
                  <DatePicker
                    format="DD/MM/YYYY"
                    onChange={(newValue) =>
                      dispatch(
                        updateQueryInput({
                          field: "fromDate",
                          value: buildDateFromPicker(newValue),
                        })
                      )
                    }
                  />
                </DemoItem>
                <DemoItem label="Fecha fin">
                  <DatePicker
                    format="DD/MM/YYYY"
                    onChange={(newValue) =>
                      dispatch(
                        updateQueryInput({
                          field: "toDate",
                          value: buildDateFromPicker(newValue),
                        })
                      )
                    }
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
            <Stack direction="row" spacing={2} sx={{ maxHeight: "3rem" }}>
              <LoadingButton
                onClick={handleGetAppointments}
                variant="outlined"
                startIcon={<ScreenSearchDesktop />}
                loading={loadingAppointments}
                disabled={disableButtons}
              >
                Ver en pantalla
              </LoadingButton>
              <LoadingButton
                onClick={() => handleGetAppointmentsCsv("google")}
                loading={loadingAppointments}
                variant="contained"
                endIcon={<FileDownload />}
                disabled={disableButtons}
              >
                Descargar csv Google
              </LoadingButton>
              <LoadingButton
                onClick={() => handleGetAppointmentsCsv("outlook")}
                loading={loadingAppointments}
                variant="contained"
                endIcon={<FileDownload />}
                disabled={disableButtons}
              >
                Descargar csv Outlook
              </LoadingButton>
            </Stack>
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

export default AppointmentsQuery;
