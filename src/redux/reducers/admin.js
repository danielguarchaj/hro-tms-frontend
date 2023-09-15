import { createSlice } from "@reduxjs/toolkit";
import { TURN_STATUS } from "@utils/constants";

const initialState = {
  currentIndex: 0,
  filterParameter: TURN_STATUS.onQueue,
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
  },
});

export const { setIndex, setFilterParameter } = adminSlice.actions;
export default adminSlice.reducer;
