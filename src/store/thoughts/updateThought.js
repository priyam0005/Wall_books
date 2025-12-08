import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateThought = createAsyncThunk(
  'updateThought/put',
  async ({ thoughtId, thoughtData, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      if (!thoughtId) {
        throw new Error('Thought ID is required');
      }

      const response = await axios.put(
        `https://sc-net.onrender.com/auth/api/thoughts/${thoughtId}`,
        thoughtData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        console.log('Thought updated:', response.data);
        return response.data;
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error updating thought:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  updatedThought: null,
  success: false,
};

const UpdateThoughtSlice = createSlice({
  name: 'updateThought',
  initialState,
  reducers: {
    clearUpdateError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.success = false;
      state.updatedThought = null;
    },
    resetUpdateState: (state) => {
      state.loading = false;
      state.error = null;
      state.updatedThought = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateThought.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateThought.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedThought = action.payload;
        state.success = true;
      })
      .addCase(updateThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearUpdateError, clearUpdateSuccess, resetUpdateState } =
  UpdateThoughtSlice.actions;
export default UpdateThoughtSlice.reducer;
