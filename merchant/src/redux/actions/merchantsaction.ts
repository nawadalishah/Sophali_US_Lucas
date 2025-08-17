import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../config/axios';
import { IMerchantsResponse } from '../../interfaces/dtos';
import { Toast } from 'native-base';
import { HEADERS } from '../../utils/helpers';

export const getMerchantsAction = createAsyncThunk(
  'merchants/all',
  async () => {
    try {
      const res = await axiosInstance.post<IMerchantsResponse>(
        'merchants/list',
        {},
        HEADERS,
      );
      return res.data;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get merchants',
      });
    }
  },
);
