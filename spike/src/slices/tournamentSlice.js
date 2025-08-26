import { createSlice } from "@reduxjs/toolkit";

const tournamentSlice = createSlice({
  name: "tournament",
  initialState: {
    tournaments: [],
    loading: false,
    error: null,
    connected: false,   // ✅ socket connection state
  },
  reducers: {
    setTournaments: (state, action) => {
      state.tournaments = action.payload;
    },
    addTournament: (state, action) => {
      // ✅ Push new tournament in real-time from socket
      state.tournaments.push(action.payload);
    },
    updateTournament: (state, action) => {
      // ✅ If any tournament gets updated (optional)
      const index = state.tournaments.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tournaments[index] = action.payload;
      }
    },
    deleteTournament: (state, action) => {
      // ✅ If a tournament is deleted (optional)
      state.tournaments = state.tournaments.filter(
        (t) => t._id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setConnected: (state, action) => {
      // ✅ to track socket connection
      state.connected = action.payload;
    },
  },
});

export const { 
  setTournaments, 
  addTournament, 
  updateTournament, 
  deleteTournament, 
  setLoading, 
  setError, 
  setConnected 
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
