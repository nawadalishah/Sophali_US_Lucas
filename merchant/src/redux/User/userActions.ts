import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../config/axios';
import { getRole } from '../../utils/helpers';

export const getUserList = createAsyncThunk(
  'userList',
  async (data: any, { dispatch }) => {
    try {
      const role = await getRole();
      const id = role?.id === 4 ? data?.parent_id : data?.id;
      const res = await axiosInstance.get<any>(
        `users/user-subscribed-merchants/${id}`,
      );
      return res.data;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get user list',
      });
    }
  },
);
