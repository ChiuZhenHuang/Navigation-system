import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/stores/userSlice";
import RecordSlice from "@/stores/recordSlice";
import CarTypesSlice from "@/stores/carTypesSlice";
import { firebaseApi } from "@/services/firebaseApi";

const store = configureStore({
  reducer: {
    user: userSlice,
    record: RecordSlice,
    carTypes: CarTypesSlice,
    [firebaseApi.reducerPath]: firebaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   // 忽略這些 action 和 path 的序列化檢查
      //   ignoredActions: [
      //     "firebaseApi/executeMutation/fulfilled",
      //     "firebaseApi/executeQuery/fulfilled",
      //     "user/setUserId",
      //     "user/setToken",
      //   ],
      //   ignoredPaths: ["firebaseApi.mutations", "firebaseApi.queries"],
      // },
    }).concat(firebaseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
