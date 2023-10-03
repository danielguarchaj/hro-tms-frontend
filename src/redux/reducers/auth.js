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
  user: null,
  showErrorSnackbar: false,
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
    setShowErrorSnackbar: (state, { payload }) => {
      state.showErrorSnackbar = payload;
    },
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
          if (status === 200 && token) {
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
          state.showErrorSnackbar = true;
        }
      )
      .addCase(getAccessToken.rejected, (state) => {
        state.tokenStatus = "failed";
        state.token = "";
        state.showErrorSnackbar = true;
      })
  },
});

export const { updateInput, logout, setShowErrorSnackbar } = authSlice.actions;
export default authSlice.reducer;

export const getAccessToken = createAsyncThunk(
  "auth/getAccessToken",
  async (payload) => {
    try {
      const {
        data: { token, status: statusFromData },
        status: statusFromResponse,
      } = await axios.post(auth.getAuthenticationToken, payload);
      return { token, status: statusFromData || statusFromResponse || 400 };
    } catch (error) {
      return { error: error, status: error.status || 500 };
    }
  }
);