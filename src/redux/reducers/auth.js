import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { decodeJwt } from "@utils/helpers";
import { fetchingResourceStatuses } from "@utils/constants";
import { ENDPOINTS } from "@routes";

const { auth } = ENDPOINTS;

const initialState = {
  token: "",
  tokenStatus: fetchingResourceStatuses,
  sessionExpired: false,
  username: "",
  password: "",
  areas: [],
  fetchingAreasStatus: fetchingResourceStatuses,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateInput: (state, { payload: { field, value } }) => {
      state[field] = value;
    },
    logout: (state) => ({
      ...state,
      ...initialState,
    }),
  },
  extraReducers(builder) {
    builder
      .addCase(getAccessToken.pending, (state) => {
        state.tokenStatus = "loading";
        state.token = "";
      })
      .addCase(
        getAccessToken.fulfilled,
        (state, { payload: { token, status } }) => {
          if (status === 200) {
            state.tokenStatus = "succeeded";
            state.token = token;
            state.sessionExpired = false;
            state.username = "";
            state.password = "";
            const jwtData = decodeJwt(token);
            const user = jwtData?.user;
            state.user = user;
            return;
          }
          state.tokenStatus = "failed";
          state.token = "";
        }
      )
      .addCase(getAccessToken.rejected, (state) => {
        state.tokenStatus = "failed";
        state.token = "";
      })
      .addCase(getAreas.pending, (state) => {
        state.fetchingAreasStatus = "loading";
      })
      .addCase(getAreas.fulfilled, (state, { payload: { areas, status } }) => {
        state.searchResultStatus = status;
        if (status === 200) {
          state.fetchingAreasStatus = "succeeded";
          state.areas = areas.data;
          return;
        }
        state.fetchingAreasStatus = "failed";
      })
      .addCase(getAreas.rejected, (state, { payload: { status } }) => {
        state.fetchingAreasStatus = "failed";
        state.searchResultStatus = status;
      });
  },
});

export const { updateInput, logout } = authSlice.actions;
export default authSlice.reducer;

export const getAccessToken = createAsyncThunk(
  "auth/getAccessToken",
  async (payload) => {
    const {
      data: { token },
      status,
    } = await axios.post(auth.getAuthenticationToken, payload);
    return { token, status };
  }
);

export const getAreas = createAsyncThunk("auth/getAreas", async () => {
  try {
    const { data, status } = await axios.get(auth.getAreas);
    return { areas: data, status };
  } catch (error) {
    return {
      status: error.response.status,
    };
  }
});
