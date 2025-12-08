import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteThought = createAsyncThunk(
  'deleteThought/delete',
  async ({ thoughtId, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      if (!thoughtId) {
        throw new Error('Thought ID is required');
      }

      const response = await axios.delete(
        `https://sc-net.onrender.com/auth/api/thoughts/${thoughtId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        console.log('Thought deleted:', response.data);
        return { thoughtId, ...response.data };
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error deleting thought:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  deletedThoughtId: null,
  success: false,
};

const DeleteThoughtSlice = createSlice({
  name: 'deleteThought',
  initialState,
  reducers: {
    clearDeleteError: (state) => {
      state.error = null;
    },
    clearDeleteSuccess: (state) => {
      state.success = false;
      state.deletedThoughtId = null;
    },
    resetDeleteState: (state) => {
      state.loading = false;
      state.error = null;
      state.deletedThoughtId = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteThought.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteThought.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedThoughtId = action.payload.thoughtId;
        state.success = true;
      })
      .addCase(deleteThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearDeleteError, clearDeleteSuccess, resetDeleteState } =
  DeleteThoughtSlice.actions;
export default DeleteThoughtSlice.reducer;
