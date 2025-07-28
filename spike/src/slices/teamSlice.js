import { createSlice } from '@reduxjs/toolkit';

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    team: null,
    loading: false,
    error: null,
  },
  reducers: {
    setTeam(state, action) {
      state.team = action.payload;
    },
    setTeamLoading(state, action) {
      state.loading = action.payload;
    },
    setTeamError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setTeam, setTeamLoading, setTeamError } = teamSlice.actions;
export default teamSlice.reducer;
