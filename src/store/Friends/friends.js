import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const friends = createAsyncThunk('/friend', async ({ token }) => {
  try {
    const response = await axios.get(
      'https://r01ck4rh-405.inc1.devtunnels.ms/auth/friends',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response && response.data) {
      return response.data.data;
    } else {
      console.log('no data recievd ');
    }
  } catch (error) {
    console.log(error);

    return error;
  }
});

const initialState = {
  loading: true,
  error: null,
  list: [],
};

const friendsDATA = createSlice({
  name: 'friendGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(friends.fulfilled, (state, action) => {
        (state.loading = false), (state.list = action.payload);
      })
      .addCase(friends.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(friends.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      });
  },
});

export default friendsDATA.reducer;
