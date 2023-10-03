import { createSlice } from "@reduxjs/toolkit";
import { TURN_STATUS } from "@utils/constants";

const initialState = {
  currentIndex: 0,
  filterParameter: TURN_STATUS.onQueue,
  fullScreenDialogOpen: false,
  fullScreenDialogOpenAt: "",
  appointmentDialogFormOpen: false,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setIndex: (state, { payload: { index } }) => {
      state.currentIndex = index;
    },
    setFilterParameter: (state, { payload }) => {
      state.filterParameter = payload;
    },
    setFullScreenDialogOpen: (state, { payload: { open, location } }) => {
      state.fullScreenDialogOpen = open;
      state.fullScreenDialogOpenAt = location;
    },
    setAppointmentDialogFormOpen: (state, { payload }) => {
      state.appointmentDialogFormOpen = payload;
    },
  },
});

export const { setIndex, setFilterParameter, setFullScreenDialogOpen, setAppointmentDialogFormOpen } =
  adminSlice.actions;
export default adminSlice.reducer;
