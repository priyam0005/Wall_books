import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
let result = null;
const token = localStorage.getItem('auth');

export const userProfile = createAsyncThunk(
  'My/Profile',

  async ({ token }, thunkAPI) => {
    try {
      if (!token) {
        console.log('token is missing');
      }
      const response = await axios.get(
        `https://r01ck4rh-405.inc1.devtunnels.ms/auth/userProfile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data && response.data.data) {
        console.log('got the response');
        console.log(response.data.data);

        result = response.data.data;

        localStorage.setItem('noob', JSON.stringify(result)); // Just call the function

        // If you want to log what was saved, retrieve it explicitly
        console.log(
          'Data saved to localStorage:',
          JSON.parse(localStorage.getItem('noob'))
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  loading: true,
  error: null,
  profile: JSON.parse(localStorage.getItem('noob')),
};

const NOProfile = createSlice({
  name: 'lizzie',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(userProfile.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(userProfile.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.profile = null;
      });
  },
});

export default NOProfile.reducer;
