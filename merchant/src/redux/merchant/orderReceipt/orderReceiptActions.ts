import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import axios, { Axios } from 'axios';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';

export const orderReceiptAction = createAsyncThunk(
  'orderReceiptAction',
  async (id: any, { dispatch }) => {
    try {
      const res = await axiosInstance.get<any>(
        `receipt/merchant-purchase-order-m-receipt?order_id=${id}`,
      );
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get orderReceipt',
      });
    }
  },
);
