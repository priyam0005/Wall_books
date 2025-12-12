import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching a thought
export const fetchThought = createAsyncThunk(
  'thoughts/fetchThought',
  async (thoughtId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/thoughts/${thoughtId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch thought');
    }
  }
);

// Async thunk for liking a thought
export const likeThought = createAsyncThunk(
  'thoughts/likeThought',
  async (thoughtId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/thoughts/${thoughtId}/like`);
      return { thoughtId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to like thought');
    }
  }
);

const thoughtsSlice = createSlice({
  name: 'thoughts',
  initialState: {
    thoughts: {},
    loading: false,
    error: null,
    likeLoading: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic like update
    optimisticLike: (state, action) => {
      const { thoughtId } = action.payload;
      if (state.thoughts[thoughtId]) {
        state.thoughts[thoughtId].liked = !state.thoughts[thoughtId].liked;
        state.thoughts[thoughtId].likesCount = state.thoughts[thoughtId].liked
          ? state.thoughts[thoughtId].likesCount + 1
          : state.thoughts[thoughtId].likesCount - 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch thought
      .addCase(fetchThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThought.fulfilled, (state, action) => {
        state.loading = false;
        state.thoughts[action.payload.id] = action.payload;
      })
      .addCase(fetchThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like thought
      .addCase(likeThought.pending, (state, action) => {
        state.likeLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(likeThought.fulfilled, (state, action) => {
        const { thoughtId, data } = action.payload;
        state.likeLoading[thoughtId] = false;
        if (state.thoughts[thoughtId]) {
          state.thoughts[thoughtId].liked = data.liked;
          state.thoughts[thoughtId].likesCount = data.likesCount;
        }
      })
      .addCase(likeThought.rejected, (state, action) => {
        state.likeLoading[action.meta.arg] = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, optimisticLike } = thoughtsSlice.actions;

// Selectors
export const selectThought = (state, thoughtId) =>
  state.thoughts.thoughts[thoughtId];
export const selectThoughtsLoading = (state) => state.thoughts.loading;
export const selectLikeLoading = (state, thoughtId) =>
  state.thoughts.likeLoading[thoughtId] || false;
export const selectError = (state) => state.thoughts.error;

export default thoughtsSlice.reducer;
