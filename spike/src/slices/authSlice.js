import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,             // no longer needed with cookies, but keep for API fallback
  user: null,
  loading: true,           // 👈 start in loading state until /auth/me resolves
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      console.log("Setting token:", action.payload);
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser: (state, action) => {
      console.log("Setting user:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;  // ✅ mark auth check complete
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      console.log("Clearing auth state");
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setToken, setUser, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
