import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentIndex: 0,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setIndex: (state, { payload: { index } }) => {
      state.currentIndex = index;
    },
  },
});

export const { setIndex } = adminSlice.actions;
export default adminSlice.reducer;
