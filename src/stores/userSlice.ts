import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  email: "",
  userName: "",
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
  },
});

export const { setToken, clearToken, setUserEmail, setUserName } =
  userSlice.actions;
export default userSlice.reducer;
