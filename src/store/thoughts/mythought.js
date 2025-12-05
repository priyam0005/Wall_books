import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUserThoughts = createAsyncThunk(
  'getUserThoughts/get',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await axios.get(
        `https://sc-net.onrender.com/auth/api/thoughts/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        console.log('User thoughts fetched:', response.data);
        return response.data.thoughts;
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error fetching user thoughts:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  thoughts: [],
};

const GetUserThoughtsSlice = createSlice({
  name: 'getUserThoughts',
  initialState,
  reducers: {
    clearGetError: (state) => {
      state.error = null;
    },
    clearThoughts: (state) => {
      state.thoughts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserThoughts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserThoughts.fulfilled, (state, action) => {
        state.loading = false;
        state.thoughts = action.payload;
      })
      .addCase(getUserThoughts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGetError, clearThoughts } = GetUserThoughtsSlice.actions;
export default GetUserThoughtsSlice.reducer;
