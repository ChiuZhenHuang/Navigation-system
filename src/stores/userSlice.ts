import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/types/firebaseType";

const initialState = {
  token: "",
  email: "",
  userName: "",
  userId: "",
  firstName: "",
  userTotalData: <User[]>[],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = "";
    },
    setUserEmail(state, action) {
      state.email = action.payload;
    },
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setFirstName(state, action) {
      state.firstName = action.payload;
    },
    setUserTotalData(state, action) {
      state.userTotalData = action.payload;
    },
  },
});

export const {
  setToken,
  clearToken,
  setUserEmail,
  setUserName,
  setUserId,
  setFirstName,
  setUserTotalData,
} = userSlice.actions;
export default userSlice.reducer;
