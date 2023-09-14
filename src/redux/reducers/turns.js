import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchingResourceStatuses } from "@utils/constants";
import { ENDPOINTS } from "@routes";

const { turns } = ENDPOINTS;

const initialState = {
  creatingTurnStatus: fetchingResourceStatuses,
  createdTurn: null,
  createTurnStatus: null,
  turnQueue: [],
  fetchingTurnsStatus: fetchingResourceStatuses,
  snackbarFailedTurnShow: false,
  snackbarSuccessTurnShow: false,
};

export const turnsSlice = createSlice({
  name: "turns",
  initialState,
  reducers: {
    setSnackbarFailedTurnShow: (state, { payload }) => {
      state.snackbarFailedTurnShow = payload;
    },
    setSnackbarSuccessTurnShow: (state, { payload }) => {
      state.snackbarSuccessTurnShow = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createTurn.pending, (state) => {
        state.creatingTurnStatus = "loading";
      })
      .addCase(
        createTurn.fulfilled,
        (state, { payload: { newTurn, status } }) => {
          state.createTurnStatus = status;
          if (status === 201) {
            state.creatingTurnStatus = "succeeded";
            state.snackbarSuccessTurnShow = true;
            state.createdTurn = newTurn;
            state.turnQueue.push(newTurn);
            localStorage.setItem("turns", JSON.stringify(state.turnQueue));
            return;
          }
          state.snackbarFailedTurnShow = true;
          state.creatingTurnStatus = "failed";
        }
      )
      .addCase(createTurn.rejected, (state) => {
        state.snackbarFailedTurnShow = true;
        state.creatingTurnStatus = "failed";
      })
      .addCase(getTurns.pending, (state) => {
        state.fetchingTurnsStatus = "loading";
      })
      .addCase(
        getTurns.fulfilled,
        (state, { payload: { turnQueue, status } }) => {
          if (status === 200) {
            state.fetchingTurnsStatus = "succeeded";
            state.turnQueue = turnQueue;
            localStorage.setItem("turns", JSON.stringify(state.turnQueue));
            return;
          }
          state.fetchingTurnsStatus = "failed";
        }
      )
      .addCase(getTurns.rejected, (state, { payload: { status } }) => {
        state.fetchingTurnsStatus = "failed";
      });
  },
});

export const { setSnackbarFailedTurnShow, setSnackbarSuccessTurnShow } =
  turnsSlice.actions;

export default turnsSlice.reducer;

export const createTurn = createAsyncThunk(
  "turns/createTurn",
  async (payload) => {
    try {
      const {
        data: {
          data: { turn: newTurn },
        },
        status,
      } = await axios.post(turns.createTurn, payload);
      return { newTurn, status };
    } catch (error) {
      return {
        status: error.response.status,
      };
    }
  }
);

export const getTurns = createAsyncThunk("turns/getTurns", async () => {
  try {
    const response = await axios.get(turns.getTurns);
    if (JSON.stringify(response.data) === "{}" || !response.data) {
      return {
        status: 400,
      };
    }
    return { turnQueue: response.data, status: response.status };
  } catch (error) {
    return {
      status: error.response.status,
    };
  }
});