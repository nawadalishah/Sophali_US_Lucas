import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { HEADERS } from '../../../utils/helpers';

export const getMerchantTokens = createAsyncThunk(
  'merchantTokenData',
  async (id: any, { dispatch }) => {
    try {
      const res = await axiosInstance.get<any>(
        `merchants/merchant-consumed-token?merchant_id=${id}`,
      );
      return res.data;
    } catch (e: any) {
      console.log('error ====', e);
      Toast.show({
        title: e?.response?.data?.message || 'Cannot get merchant tokens',
      });
    }
  },
);

export const addMerchantTokens = createAsyncThunk(
  'merchantTokenData',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>(
        'merchantwithdrawalrequest/add',
        data,
        HEADERS,
      );
      Toast.show({
        title:
          'Withdrawal went for approval you will soon receive notification regarding your withdrawal',
      });
      return res.data;
    } catch (e: any) {
      console.log('error ====', e);
      Toast.show({
        title: e?.response?.data?.message || 'Cannot add merchant tokens',
      });
    }
  },
);

export const applyMerchantWithdrawal = createAsyncThunk(
  'merchantTokenData',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>(
        'merchants/withdrawal/apply',
        data,
        HEADERS,
      );
      // Toast.show({
      //   title:
      //     'Withdrawal went for approval you will soon receive notification regarding your withdrawal',
      // });
      return res.data;
    } catch (e: any) {
      console.log('error ====', e);
      Toast.show({
        title: e?.response?.data?.message || 'Cannot add merchant tokens',
      });
    }
  },
);
