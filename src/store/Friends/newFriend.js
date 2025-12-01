import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const Friends = createAsyncThunk('/nooob', async ({ id }, thunkAPI) => {
  try {
    if (!id) {
      console.log('no id is recieved ');
    }

    const response = await axios.get(
      `https://r01ck4rh-405.inc1.devtunnels.ms/auth/friendList/${id}`
    );

    if (response && response.data) {
      console.log('the response have beeen recieved ');
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.log('the error is : ', error);
  }
});

const initialState = {
  loading: true,
  list: [],
  error: null,
};

const mitra = createSlice({
  name: 'friendslist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Friends.fulfilled, (state, action) => {
        (state.loading = false), (state.list = action.payload);
      })
      .addCase(Friends.pending, (state, action) => {
        (state.loading = true), (state.list = []), (state.error = null);
      })
      .addCase(Friends.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default mitra.reducer;
