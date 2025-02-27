import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/stores/userSlice";
import RecordSlice from "@/stores/recordSlice";
import CarTypesSlice from "@/stores/carTypesSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    record: RecordSlice,
    carTypes: CarTypesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
