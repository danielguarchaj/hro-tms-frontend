import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material/";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import {
  DatePicker,
  TimeField,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { useSelector, useDispatch } from "react-redux";
import {
  setAppointmentDialogFormOpen,
  setFullScreenDialogOpen,
} from "@redux/reducers/admin";
import {
  updateInput as updateAppointmentFormInput,
  createAppointment,
} from "@redux/reducers/appointments";
import { buildDateFromPicker, buildTimeFromPicker } from "@utils/helpers";

const AppointmentDialogForm = ({ patient = null, appointment = null }) => {
  const dispatch = useDispatch();
  const {
    appointmentEventForm: { date, startTime, endTime, description },
  } = useSelector((state) => state.appointments);
  const { user, token } = useSelector((state) => state.auth);
  const area = user?.area?.name || "";
  const subject = `${patient?.nombres || ""} ${patient?.apellidos || ""} - ${
    patient?.noHistoriaClinica
  }`;

  const { appointmentDialogFormOpen } = useSelector((state) => state.admin);

  const handleClose = () => {
    dispatch(setAppointmentDialogFormOpen(false));
  };

  const handleSaveAppointment = () => {
    const method = appointment ? "PUT" : "POST";
    const payload = {
      subject,
      date,
      startTime,
      endTime,
      description,
      location: area,
    };
    dispatch(createAppointment({ method, payload, token }));
    dispatch(setAppointmentDialogFormOpen(false));
    dispatch(setFullScreenDialogOpen({ open: false, location: "" }));
  };

  return (
    <div>
      <Dialog open={appointmentDialogFormOpen} onClose={handleClose} fullWidth>
        <DialogTitle>Crear cita</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Paciente"
            type="text"
            fullWidth
            variant="outlined"
            value={subject}
            disabled
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateField", "TimeField"]}>
              <DemoItem label="Fecha">
                <DatePicker
                  format="DD/MM/YYYY"
                  onChange={(newValue) =>
                    dispatch(
                      updateAppointmentFormInput({
                        field: "date",
                        value: buildDateFromPicker(newValue),
                      })
                    )
                  }
                />
              </DemoItem>
              <DemoItem label="Hora: desde">
                <TimeField
                  onChange={(newValue) =>
                    dispatch(
                      updateAppointmentFormInput({
                        field: "startTime",
                        value: buildTimeFromPicker(newValue),
                      })
                    )
                  }
                />
              </DemoItem>
              <DemoItem label="Hora: hasta">
                <TimeField
                  onChange={(newValue) =>
                    dispatch(
                      updateAppointmentFormInput({
                        field: "endTime",
                        value: buildTimeFromPicker(newValue),
                      })
                    )
                  }
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
          <TextField
            label="Notas"
            fullWidth
            sx={{ marginTop: 3 }}
            value={description}
            onChange={(e) =>
              dispatch(
                updateAppointmentFormInput({
                  field: "description",
                  value: e.target.value,
                })
              )
            }
          />
          <TextField
            margin="dense"
            label="Area"
            type="text"
            fullWidth
            variant="outlined"
            value={area}
            disabled
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSaveAppointment}
            disabled={!date || !startTime || !endTime}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentDialogForm;
