import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchingResourceStatuses } from "@utils/constants";
import { ENDPOINTS } from "@routes";

const { appointments } = ENDPOINTS;

// Subject,           Start Date,     Start Time,   End Date,      End Time,     All Day Event,    Description,    Location
// Nombres paciente (se muestra en form con input disabled y se arma automaticamente)
                    //  date            time          date           time          false             Notas           Area (Se muestra igual que subject)

// Event 1,2023-10-10,09:00 AM,2023-10-10,10:30 AM,False,Description of event 1,Location 1

const initialState = {
  appointmentOperationStatus: fetchingResourceStatuses,
  appointmentEventForm: {
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  },
  snackbarFailedAppointmentShow: false,
  snackbarSuccessAppointmentShow: false,
};

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    updateInput: (state, { payload: { field, value } }) => {
      console.log(field, value);
      state.appointmentEventForm[field] = value;
    },
    setSnackbarFailedAppointmentShow: (state, { payload }) => {
      state.snackbarFailedAppointmentShow = payload;
    },
    setSnackbarSuccessAppointmentShow: (state, { payload }) => {
      state.snackbarSuccessAppointmentShow = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.appointmentOperationStatus = "loading";
      })
      .addCase(
        createAppointment.fulfilled,
        (state, { payload: { status } }) => {
          if (status === 200) {
            state.appointmentOperationStatus = "succeeded";
            state.snackbarSuccessAppointmentShow = true;
            return;
          }
          state.appointmentOperationStatus = "failed";
          state.snackbarFailedAppointmentShow = true;
        }
      )
      .addCase(createAppointment.rejected, (state) => {
        state.appointmentOperationStatus = "failed";
      });
  },
});

export const { updateInput } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;

export const createAppointment = createAsyncThunk(
  "appointments/createAppointment",
  async ({ payload, token, method }) => {
    try {
      let axiosRequest;
      if (method === "POST") {
        axiosRequest = axios.post;
      }
      if (method === "PUT") {
        axiosRequest = axios.put;
      }
      const { status } = await axiosRequest(
        appointments.createAppointment,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return { status };
    } catch (error) {
      return {
        status: error.response.status || 500,
      };
    }
  }
);
