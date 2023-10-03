import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchingResourceStatuses } from "@utils/constants";
import { ENDPOINTS } from "@routes";

const { patients } = ENDPOINTS;

const initialState = {
  fetchingPatientsStatus: fetchingResourceStatuses,
  searchForm: {
    clinicalHistory: "",
    firstName: "",
    firstLastname: "",
    secondName: "",
    secondLastname: "",
    thirdLastname: "",
  },
  searchResult: [],
  searchResultStatus: null,
};

export const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    updateInput: (state, { payload: { field, value } }) => {
      state.searchForm[field] = value;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPatients.pending, (state) => {
        state.fetchingPatientsStatus = "loading";
      })
      .addCase(
        getPatients.fulfilled,
        (state, { payload: { patients, status, searchBy } }) => {
          state.searchResultStatus = status;
          if (status === 200) {
            state.fetchingPatientsStatus = "succeeded";
            if (searchBy === "names") {
              state.searchResult = patients.data.map((patient) => ({
                ...patient,
                noHistoriaClinica: patient.historia_Clinica,
                sexo: "",
                nombrePadre: patient.padre,
                nombreMadre: patient.madre,
                nombre_Resposable: "",
              }));
              return;
            }
            state.searchResult = patients.data;
            return;
          }
          state.fetchingPatientsStatus = "failed";
        }
      )
      .addCase(getPatients.rejected, (state, { payload: { status } }) => {
        state.fetchingPatientsStatus = "failed";
        state.searchResultStatus = status;
      });
  },
});

export const { updateInput } = patientsSlice.actions;
export default patientsSlice.reducer;

export const getPatients = createAsyncThunk(
  "patients/getPatients",
  async ({ payload, token }) => {
    try {
      const { data, status } = await axios.post(
        patients.searchPatient,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return { patients: data, status, searchBy: payload.searchBy };
    } catch (error) {
      return {
        status: error.response.status,
      };
    }
  }
);
