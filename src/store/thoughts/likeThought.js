import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Like/Unlike a thought
export const likeThought = createAsyncThunk(
  'likeThought/post',
  async ({ thoughtId, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      if (!thoughtId) {
        throw new Error('Thought ID is required');
      }

      const response = await axios.post(
        `https://sc-net.onrender.com/api/thoughts/${thoughtId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        console.log('Thought like toggled:', response.data);
        return {
          thoughtId,
          thought: response.data.thought,
          isLiked: response.data.isLiked,
        };
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error liking thought:', error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  likedThoughts: {},
};

const likeThoughtSlice = createSlice({
  name: 'likeThought',
  initialState,
  reducers: {
    clearLikeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(likeThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeThought.fulfilled, (state, action) => {
        state.loading = false;
        const { thoughtId, thought, isLiked } = action.payload;
        state.likedThoughts[thoughtId] = {
          thought,
          isLiked,
        };
      })
      .addCase(likeThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLikeError } = likeThoughtSlice.actions;
export default likeThoughtSlice.reducer;
