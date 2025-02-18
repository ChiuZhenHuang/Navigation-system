import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  email: "",
  userName: "",
  userId: "",
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
  },
});

export const { setToken, clearToken, setUserEmail, setUserName, setUserId } =
  userSlice.actions;
export default userSlice.reducer;
