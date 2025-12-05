//THIS STORE GENERALLY RETREIVE THE DATA OF REQUESTLIST FROM THE BACKEND

import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const Reqlist = createAsyncThunk(
  '/naah',

  async ({ token }) => {
    try {
      const response = await axios.get(
        'https://r01ck4rh-405.inc1.devtunnels.ms/auth/userReq',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        console.log(response.data.data[0]);
        const result = response.data.data[0].receivedRequestsDetails;
        return result;
      }
    } catch (error) {
      console.error('Error fetching request list:', error); // Use console.error for errors
      // Re-throw to be caught by the .rejected action
      throw error;
    }
  }
);

export const ReqAction = createAsyncThunk(
  '/ReqAction',
  async ({ token, type, senderId }) => {
    try {
      const response = await axios.post(
        `https://r01ck4rh-405.inc1.devtunnels.ms/auth/${type}`,
        {
          senderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        console.log('data recived ', response.data);

        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

const initialState = {
  loading: true,
  error: null,
  list: [],
  type: 'friend_request',
};

const ConnectV = createSlice({
  name: 'falana',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(Reqlist.fulfilled, (state, action) => {
        (state.loading = false), (state.parinam = action.payload);
        state.type = 'friend_request';
        state.list = action.payload;
      })

      .addCase(Reqlist.pending, (state) => {
        state.loading = true;
        state.type = 'friend_request';
        state.fuck = [];
      })

      .addCase(Reqlist.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })

      .addCase(ReqAction.fulfilled, (state, action) => {
        state.loading = false;
        const { senderId } = action.meta.arg;
        state.list = state.list.filter((user) => user.userId !== senderId);
      })
      .addCase(ReqAction.pending, (state) => {
        state.error = null;
        state.loading = true;
      })

      .addCase(ReqAction.rejected, (state) => {
        state.loading = false;
        state.error = action.paylaod;
      });
  },
});

export default ConnectV.reducer;
