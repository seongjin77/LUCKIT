import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCookie } from '../cookie';

const initialState = {
  snspost: [],
  status: 'idle',
  endpoint : true
};

export const AxiosSnsPost = createAsyncThunk('snspost/AxiosSnsPost', async (URL) => {
  const token = getCookie('Access Token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  };
  const res = await axios(URL, config);

  return res.data.post;
});

export const snsPostSlice = createSlice({
  name: 'getSnsPost',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AxiosSnsPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(AxiosSnsPost.fulfilled, (state, action) => {
          // console.log('이전길이확인',state.snspost.length);
          // console.log('현재길이확인',action.payload.length);
        if(action.payload.length === state.snspost.length) state.endpoint = true
        else state.endpoint = false
        state.status = 'success';
        state.snspost = action.payload;
      })
      .addCase(AxiosSnsPost.rejected, (state) => {
        state.state = 'fail';
      });
  },
});
