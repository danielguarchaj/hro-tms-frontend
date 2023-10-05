import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchingResourceStatuses } from "@utils/constants";
import { ENDPOINTS } from "@routes";
import { sortByProperty } from "../../utils/helpers";

const { turns } = ENDPOINTS;

const initialState = {
  creatingTurnStatus: fetchingResourceStatuses,
  createTurnStatus: null,
  createdTurn: null,
  turnQueue: [],
  fetchingTurnsStatus: fetchingResourceStatuses,
  snackbarFailedTurnShow: false,
  snackbarSuccessTurnShow: false,
  updatingTurnStatus: fetchingResourceStatuses,
  updateTurnStatus: null,
  snackbarFailedTurnUpdateShow: false,
  snackbarSuccessTurnUpdateShow: false,
  report: {
    searchForm: {
      fromDate: "",
      toDate: "",
    },
    turns: [],
    fetchingReportStatus: fetchingResourceStatuses,
  },
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
    setSnackbarFailedTurnUpdateShow: (state, { payload }) => {
      state.snackbarFailedTurnUpdateShow = payload;
    },
    setSnackbarSuccessTurnUpdateShow: (state, { payload }) => {
      state.snackbarSuccessTurnUpdateShow = payload;
    },
    updateInputReportField: (state, { payload: { field, value } }) => {
      state.report.searchForm[field] = value;
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
          if (
            (status === 200 && turnQueue?.length !== undefined) ||
            turnQueue?.length >= 0
          ) {
            state.fetchingTurnsStatus = "succeeded";
            const sortedTurns = sortByProperty(turnQueue, "numero");
            state.turnQueue = sortedTurns;
            localStorage.setItem("turns", JSON.stringify(state.turnQueue));
            return;
          }
          state.fetchingTurnsStatus = "failed";
        }
      )
      .addCase(getTurns.rejected, (state) => {
        state.fetchingTurnsStatus = "failed";
      })
      .addCase(updateTurnStatus.pending, (state) => {
        state.updatingTurnStatus = "loading";
      })
      .addCase(updateTurnStatus.fulfilled, (state, { payload }) => {
        const { updatedTurn, status } = payload;
        state.updateTurnStatus = status;
        if (status === 200) {
          state.updatingTurnStatus = "succeeded";
          state.snackbarSuccessTurnUpdateShow = true;
          const filteredTurns = state.turnQueue.filter(
            (turn) => turn._id !== updatedTurn._id
          );
          filteredTurns.push(updatedTurn);
          const sortedTurns = sortByProperty(filteredTurns, "numero");
          state.turnQueue = sortedTurns;
          localStorage.setItem("turns", JSON.stringify(state.turnQueue));
          return;
        }
        state.snackbarFailedTurnUpdateShow = true;
        state.updatingTurnStatus = "failed";
      })
      .addCase(updateTurnStatus.rejected, (state) => {
        state.snackbarFailedTurnUpdateShow = true;
        state.updatingTurnStatus = "failed";
      })
      .addCase(getTurnsReport.pending, (state) => {
        state.report.fetchingReportStatus = "loading";
      })
      .addCase(
        getTurnsReport.fulfilled,
        (state, { payload: { turns, status } }) => {
          if (
            (status === 200 && turns?.length !== undefined) ||
            turns?.length >= 0
          ) {
            state.report.fetchingReportStatus = "succeeded";
            // const sortedturns = sortByProperty(turns, "date");
            // state.turns = sortedturns;
            state.report.turns = turns;
            return;
          }
          state.report.fetchingReportStatus = "failed";
        }
      )
      .addCase(getTurnsReport.rejected, (state) => {
        state.report.fetchingReportStatus = "failed";
      });
  },
});

export const {
  setSnackbarFailedTurnShow,
  setSnackbarSuccessTurnShow,
  setSnackbarFailedTurnUpdateShow,
  setSnackbarSuccessTurnUpdateShow,
  updateInputReportField,
} = turnsSlice.actions;

export default turnsSlice.reducer;

export const createTurn = createAsyncThunk(
  "turns/createTurn",
  async ({ payload, token }) => {
    try {
      const {
        data: {
          data: { turn: newTurn },
        },
        status,
      } = await axios.post(turns.createTurn, payload, {
        headers: {
          Authorization: token,
        },
      });
      return { newTurn, status };
    } catch (error) {
      return {
        status: error.response.status,
      };
    }
  }
);

export const getTurns = createAsyncThunk("turns/getTurns", async (token) => {
  try {
    const response = await axios.get(turns.getTurns, {
      headers: {
        Authorization: token,
      },
    });
    if (JSON.stringify(response.data) === "{}" || !response.data) {
      return {
        status: 400,
      };
    }
    return { turnQueue: response.data, status: response.status };
  } catch (error) {
    return {
      status: error?.response?.status || 500,
    };
  }
});

export const updateTurnStatus = createAsyncThunk(
  "turns/updateTurnStatus",
  async ({ payload, token }) => {
    try {
      const response = await axios.put(turns.updateTurnStatus, payload, {
        headers: {
          Authorization: token,
        },
      });
      return { updatedTurn: response.data, status: response.status };
    } catch (error) {
      return {
        status: error.response.status,
      };
    }
  }
);

export const getTurnsReport = createAsyncThunk(
  "turns/getTurnsReport",
  async ({ token, queryParams }) => {
    try {
      const response = await axios.get(
        `${turns.getTurnsReport}?${queryParams}`,
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
      return { turns: response.data, status: response.status };
    } catch (error) {
      return {
        status: error?.response?.status || 500,
      };
    }
  }
);

export const getTurnsReportCsv = createAsyncThunk(
  "turns/getTurnsReportCsv",
  async ({ token, queryParams }) => {
    try {
      const response = await axios.get(
        `${turns.getTurnsReportCsv}?${queryParams}`,
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
      a.download = `reporte-turnos-hro.csv`;
      a.click();
    } catch (error) {
      return {
        status: error?.response?.status || 500,
      };
    }
  }
);
