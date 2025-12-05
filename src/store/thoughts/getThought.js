import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const thought = createAsyncThunk(
  'thought',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://sc-net.onrender.com/auth/api/thoughts/feed'
      );

      if (response && response.data) {
        console.log(response.data);
        return response.data;
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error fetching thoughts:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  feed: [],
};

const ThoughtSlice = createSlice({
  name: 'babyGirl',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(thought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thought.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(thought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ThoughtSlice.reducer;
