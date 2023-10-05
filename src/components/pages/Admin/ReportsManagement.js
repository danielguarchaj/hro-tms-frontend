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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { updateInputReportField } from "@redux/reducers/turns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { buildDateFromPicker, formatDateTime } from "@utils/helpers";
import { ScreenSearchDesktop, FileDownload } from "@mui/icons-material";
import { StyledTableCell, StyledTableRow } from "@utils/styles";
import { getTurnsReport, getTurnsReportCsv } from "@redux/reducers/turns";
import LoadingButton from "@mui/lab/LoadingButton";

const buildTableHeader = () => {
  const columns = [
    "Id Turno",
    "# Historia clinica",
    "Nombres",
    "Apellidos",
    "Sexo",
    "Fecha y hora de creacion",
    "Estado",
    "Area",
    "Numero de turno",
    "Fecha y hora de ultima actualizacion",
  ];
  return columns.map((column, index) => (
    <StyledTableCell align="left" key={`StyledTableCellKeyCell-${index}`}>
      {column}
    </StyledTableCell>
  ));
};

const ReportsManagement = () => {
  const dispatch = useDispatch();
  const {
    report: {
      searchForm: { fromDate, toDate },
      turns,
      fetchingReportStatus,
    },
  } = useSelector((state) => state.turns);
  const { token } = useSelector((state) => state.auth);

  const handleGetTurnsReport = () => {
    const queryParams = `fromDate=${fromDate}&toDate=${toDate}`;
    dispatch(getTurnsReport({ token, queryParams }));
  };

  const handleGetTurnsReportCsv = () => {
    const queryParams = `fromDate=${fromDate}&toDate=${toDate}`;
    dispatch(getTurnsReportCsv({ token, queryParams }));
  };

  const loadingTurns = fetchingReportStatus === "loading";

  const buildTableContent = () =>
    turns.map((turn) => (
      <StyledTableRow key={`${turn._id}-StyledTableRow-Key`}>
        <StyledTableCell component="th" scope="row">
          {turn._id}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {turn.noHistoriaClinica}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {turn.nombres}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {turn.apellidos}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {turn.sexo}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {formatDateTime(turn.timestamp)}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {turn.status}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {turn.areaName}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {turn.numero}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {formatDateTime(turn.updatedAt)}
        </StyledTableCell>
      </StyledTableRow>
    ));

  const disableButtons = !fromDate || !toDate;
  const reportRecords = buildTableContent();

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
            open={loadingTurns}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{ transform: "translate(1500%, 0px) !important" }}
          >
            <Alert severity="info" sx={{ width: "100%" }} variant="filled">
              Cargando reporte de turnos
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
                        updateInputReportField({
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
                        updateInputReportField({
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
                onClick={handleGetTurnsReport}
                variant="outlined"
                startIcon={<ScreenSearchDesktop />}
                loading={loadingTurns}
                disabled={disableButtons}
              >
                Ver en pantalla
              </LoadingButton>
              <LoadingButton
                onClick={handleGetTurnsReportCsv}
                loading={loadingTurns}
                variant="contained"
                endIcon={<FileDownload />}
                disabled={disableButtons}
              >
                Descargar csv
              </LoadingButton>
            </Stack>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>{buildTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{reportRecords}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportsManagement;
