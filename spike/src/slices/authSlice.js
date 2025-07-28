import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      console.log('Setting token:', action.payload); // Debug log
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser: (state, action) => {
      console.log('Setting user:', action.payload); // Debug log
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      console.log('Clearing auth state'); // Debug log
      state.token = null;
      state.user = null;
      state.loading = false;
      state.isAuthenticated = false;
    },
  },
});

export const { setToken, setUser, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
