import { createSlice } from '@reduxjs/toolkit';
import { subMerchantAction } from './subMerchantAction';

export interface ISubMerchantsState {
  userList?: any;
  loadingList: boolean;
  errors?: string;
}

const initialState: ISubMerchantsState = { loadingList: false };

export const subMerchant = createSlice({
  name: 'list',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get All categories
      .addCase(subMerchantAction.pending, state => {
        state.loadingList = true;
      })
      .addCase(subMerchantAction.fulfilled, (state, action) => {
        state.loadingList = false;
        state.userList = action.payload;
      })
      .addCase(subMerchantAction.rejected, state => {
        state.loadingList = false;
      });
  },
});

const UserListReducer = subMerchant.reducer;

export default UserListReducer;
