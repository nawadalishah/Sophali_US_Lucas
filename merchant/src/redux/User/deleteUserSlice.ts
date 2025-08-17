import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import { axiosInstance } from '../../config/axios';

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('user-deactivate-account', {
        user_id: data.id,
      });
      return res.data;
    } catch (e: any) {
      console.log(e, 'error');
    }
  },
);

const deleteUserSlice = createSlice({
  name: 'deleteUser',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetDeleteUser: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(deleteUser.pending, state => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetDeleteUser } = deleteUserSlice.actions;

export default deleteUserSlice.reducer;
