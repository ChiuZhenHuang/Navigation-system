import { createSlice } from "@reduxjs/toolkit";
import type { CarTypesData } from "@/types/carTypes";

const initialState = {
  carTypes: [] as CarTypesData[],
};

const carTypesSlice = createSlice({
  name: "carTypes",
  initialState: initialState,
  reducers: {
    setCarTypes(state, action) {
      state.carTypes = action.payload;
    },
  },
});

export const { setCarTypes } = carTypesSlice.actions;
export default carTypesSlice.reducer;
