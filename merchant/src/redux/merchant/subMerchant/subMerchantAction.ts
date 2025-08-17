import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { HEADERS } from '../../../utils/helpers';

export const subMerchantAction = createAsyncThunk(
  'subMerchant',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('/users/list', data, HEADERS);

      return res.data;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get subMerchant',
      });
    }
  },
);
