import { createSlice } from '@reduxjs/toolkit';
import { getUserList } from './userActions';

export interface IUserListState {
  UserList?: any;
  isUserLoading: boolean;
  errors?: string;
}

const initialState: IUserListState = { isUserLoading: false };

export const userListSlice = createSlice({
  name: 'userListData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserList.pending, state => {
        state.isUserLoading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.UserList = action.payload;
      })
      .addCase(getUserList.rejected, state => {
        state.isUserLoading = false;
      });
  },
});

const userListReducer = userListSlice.reducer;

export default userListReducer;
