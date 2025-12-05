import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('auth');
console.log(token);
let result = null;

export const PostUser = createAsyncThunk(
  'user/post',

  async ({ profilePic, displayName, bio, mood }, thunkAPI) => {
    try {
      const response = await axios.put(
        'https://sc-net.onrender.com/auth/userProfile',

        { profilePic, displayName, bio, mood },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        console.log('data recieved at backend ');
        console.log(response.data);
        result = response.data;
        localStorage.setItem('profile', JSON.stringify(response.data));
        return response.data;
      }

      if (!response) {
        thunkAPI.rejectWithValue('respone not found');
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  token: localStorage.getItem('auth'),
  loading: true,
  error: null,
  profile: JSON.parse(localStorage.getItem('profile')),
};

const userProfile = createSlice({
  name: 'UserProfile',
  initialState,
  reducers: {
    extraReducers: (builder) => {
      builder
        .addcase(PostUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addcase(PostUser.fulfilled, (state, action) => {
          (state.loading = false), (state.token = action.paylaod.token);
          state.profile = action.paylaod.profile;
        })
        .addcase(PostUser.rejected, (state) => {
          (state.profile = null),
            (state.token = null((state.loading = false))),
            (state.error = action.paylaod);
        });
    },
  },
});

export default userProfile.reducer;
