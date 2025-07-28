import { createSlice } from "@reduxjs/toolkit";

const tournamentSlice = createSlice({
  name: "tournament",
  initialState: {
    tournaments: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTournaments: (state, action) => {
      state.tournaments = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTournaments, setLoading, setError } = tournamentSlice.actions;
export default tournamentSlice.reducer;
