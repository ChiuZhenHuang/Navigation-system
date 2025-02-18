import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalRecord: [],
};

const recordSlice = createSlice({
  name: "record",
  initialState: initialState,
  reducers: {
    setTotalRecord(state, action) {
      state.totalRecord = action.payload;
    },
  },
});

export const { setTotalRecord } = recordSlice.actions;
export default recordSlice.reducer;
