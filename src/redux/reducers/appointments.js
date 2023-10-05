import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchingResourceStatuses } from "@utils/constants";
import { ENDPOINTS } from "@routes";
import { cleanStringForEvent, sortByProperty } from "@utils/helpers";

const { appointments } = ENDPOINTS;

const initialState = {
  appointmentOperationStatus: fetchingResourceStatuses,
  appointmentEventForm: {
    date: "",
    startTime: "",
    endTime: "",
    description: "",
  },
  appointmentsQueryForm: {
    fromDate: "",
    toDate: "",
  },
  snackbarFailedAppointmentShow: false,
  snackbarSuccessAppointmentShow: false,
  snackbarFailedGetAppointmentShow: false,
  snackbarSuccessGetAppointmentShow: false,
  appointmentFetchingStatus: fetchingResourceStatuses,
  appointments: [],
};

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    updateInput: (state, { payload: { field, value } }) => {
      state.appointmentEventForm[field] = cleanStringForEvent(value);
    },
    updateQueryInput: (state, { payload: { field, value } }) => {
      state.appointmentsQueryForm[field] = value;
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
          if (status === 201) {
            state.appointmentOperationStatus = "succeeded";
            state.snackbarSuccessAppointmentShow = true;
            state.appointmentEventForm = initialState.appointmentEventForm;
            return;
          }
          state.appointmentOperationStatus = "failed";
          state.snackbarFailedAppointmentShow = true;
        }
      )
      .addCase(createAppointment.rejected, (state) => {
        state.appointmentOperationStatus = "failed";
      })
      .addCase(getAppointments.pending, (state) => {
        state.appointmentFetchingStatus = "loading";
      })
      .addCase(
        getAppointments.fulfilled,
        (state, { payload: { appointments, status } }) => {
          if (
            (status === 200 && appointments?.length !== undefined) ||
            appointments?.length >= 0
          ) {
            state.appointmentFetchingStatus = "succeeded";
            const sortedAppointments = sortByProperty(appointments, "date");
            state.appointments = sortedAppointments;
            return;
          }
          state.appointmentFetchingStatus = "failed";
        }
      )
      .addCase(getAppointments.rejected, (state) => {
        state.appointmentFetchingStatus = "failed";
      });
  },
});

export const {
  updateInput,
  updateQueryInput,
  setSnackbarFailedAppointmentShow,
  setSnackbarSuccessAppointmentShow,
} = appointmentsSlice.actions;
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

export const getAppointments = createAsyncThunk(
  "appointments/getAppointments",
  async ({ token, queryParams }) => {
    try {
      const response = await axios.get(
        `${appointments.getAppointments}?${queryParams}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (JSON.stringify(response.data) === "{}" || !response.data) {
        return {
          status: 400,
        };
      }
      return { appointments: response.data, status: response.status };
    } catch (error) {
      return {
        status: error?.response?.status || 500,
      };
    }
  }
);

export const getAppointmentsCsv = createAsyncThunk(
  "appointments/getAppointmentsCsv",
  async ({ token, queryParams, targetCalendar }) => {
    try {
      const response = await axios.get(
        `${appointments.getAppointmentsCsv}?${queryParams}`,
        {
          headers: {
            Authorization: token,
          },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `citas-hro-${targetCalendar}.csv`;
      a.click();
    } catch (error) {
      return {
        status: error?.response?.status || 500,
      };
    }
  }
);
