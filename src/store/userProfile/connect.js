import axios from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export const connected = createAsyncThunk(
  'user/connecteded',
  async ({ token, Reciever_Id }, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:405/auth/reqList/${Reciever_Id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data) {
        console.log(response.data, 'response recieved');
        const result = response.data;

        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  loading: true,
  error: null,
  response: false,
};

const Myconnected = createSlice({
  name: 'connect',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connected.fulfilled, (state, action) => {
        (state.response = true), (state.error = null);
      })

      .addCase(connected.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(connected.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default Myconnected.reducer;
