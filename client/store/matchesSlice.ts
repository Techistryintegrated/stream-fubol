import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Match {
  gmid: number | null;
  league: string;
  leagueLogo: string;
  time: string;
  stime: string;
  teamA: string;
  teamB: string;
  logoA: string;
  logoB: string;
  iplay: boolean;
  status: string;
  statusCode?: string;
  statusType?: string;
  score?: string;
}

interface MatchesState {
  liveMatches: Match[];
  filteredLiveMatches: Match[];
  upcomingMatches: Match[];
  searchQuery: string;
  selectedLeague: string | null;
  selectedMatchId: number | null;
  loadingLive: boolean;
  loadingUpcoming: boolean;
}

const initialState: MatchesState = {
  liveMatches: [],
  filteredLiveMatches: [],
  upcomingMatches: [],
  searchQuery: '',
  selectedLeague: null,
  selectedMatchId: null,
  loadingLive: false,
  loadingUpcoming: false,
};

export const fetchLiveMatches = createAsyncThunk<Match[], void>(
  'matches/fetchLive',
  async () => {
    const res = await fetch('/api/stream/match_list');
    const json = await res.json();
    if (!Array.isArray(json))
      throw new Error('Expected match list to be an array');
    return json as Match[];
  }
);

export const fetchUpcomingMatches = createAsyncThunk<Match[], string>(
  'matches/fetchUpcoming',
  async (date) => {
    const res = await fetch(`/api/stream/upcoming_matches?date=${date}`);
    const json = await res.json();
    return (json.matches as Match[]) ?? [];
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      filterLive(state);
    },
    setSelectedLeague(state, action: PayloadAction<string | null>) {
      state.selectedLeague = action.payload;
      filterLive(state);
    },
    setSelectedMatch(state, action: PayloadAction<number>) {
      state.selectedMatchId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Live matches
      .addCase(fetchLiveMatches.pending, (state) => {
        state.loadingLive = true;
      })
      .addCase(fetchLiveMatches.fulfilled, (state, { payload }) => {
        state.loadingLive = false;
        state.liveMatches = payload;
        filterLive(state);
      })
      .addCase(fetchLiveMatches.rejected, (state) => {
        state.loadingLive = false;
      })

      // Upcoming matches
      .addCase(fetchUpcomingMatches.pending, (state) => {
        state.loadingUpcoming = true;
      })
      .addCase(fetchUpcomingMatches.fulfilled, (state, { payload }) => {
        state.loadingUpcoming = false;
        state.upcomingMatches = payload;
      })
      .addCase(fetchUpcomingMatches.rejected, (state) => {
        state.loadingUpcoming = false;
      });
  },
});

function filterLive(state: MatchesState) {
  state.filteredLiveMatches = state.liveMatches.filter((match) => {
    const bySearch =
      match.teamA.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      match.teamB.toLowerCase().includes(state.searchQuery.toLowerCase());
    const byLeague = state.selectedLeague
      ? match.league === state.selectedLeague
      : true;
    return bySearch && byLeague;
  });
}

export const { setSearchQuery, setSelectedLeague, setSelectedMatch } =
  matchesSlice.actions;

export default matchesSlice.reducer;
