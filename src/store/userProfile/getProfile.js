import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

let result = null;

export const ShowProfile = createAsyncThunk(
  'Show/Profile',
  async ({ userId }, thunkAPI) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `https://sc-net.onrender.com/auth/Profile/${userId}`
      );

      if (response) {
        console.log(response.data);
        result = response.data;
        localStorage.setItem('userPro', JSON.stringify(response.data));
        return result;
      } else {
        thunkAPI.rejectWithValue('response not recived baby girl');
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  loading: true,
  error: null,
  UserProfile: JSON.parse(localStorage.getItem('userPro')),
};

const User = createSlice({
  name: 'babyGirl',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ShowProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.UserProfile = action.payload;
      })
      .addCase(ShowProfile.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(ShowProfile.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.UserProfile = null;
      });
  },
});

export default User.reducer;
