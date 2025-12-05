import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createThought = createAsyncThunk(
  'createThought/post',
  async ({ token, content }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const response = await axios.post(
        'https://sc-net.onrender.com/auth/api/thoughts',
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response && response.data) {
        console.log('Thought created:', response.data);
        return response.data;
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error creating thought:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  createdThought: null,
};

const CreateThoughtSlice = createSlice({
  name: 'createThought',
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.error = null;
    },
    clearCreatedThought: (state) => {
      state.createdThought = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThought.fulfilled, (state, action) => {
        state.loading = false;
        state.createdThought = action.payload;
      })
      .addCase(createThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCreateError, clearCreatedThought } =
  CreateThoughtSlice.actions;
export default CreateThoughtSlice.reducer;
