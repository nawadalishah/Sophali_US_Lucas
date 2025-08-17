import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { HEADERS, getRole } from '../../../utils/helpers';

export const activeOrders = createAsyncThunk(
  'merchantOrders',
  async (merchant: any, { dispatch }) => {
    try {
      const role = await getRole();
      const id = role?.id === 4 ? merchant?.parent_id : merchant?.id;
      const res = await axiosInstance.get<any>(
        `order/merchant-picknow-order?merchant_id=${id}`,
      );
      return res.data;
    } catch (e: any) {
      console.log('🚀🚀🚀  e:', e);
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get orders',
      });
    }
  },
);

export const acceptOrderAction = createAsyncThunk(
  'merchantOrders',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>(
        'merchants/orderStatus',
        data,
        HEADERS,
      );
      if (data?.status === 'closed') {
        Toast.show({
          title: 'Order Completed',
        });
      } else if (data?.status === 'cancelled') {
        Toast.show({
          title: 'order is cancelled',
        });
      } else if (data?.status === 'preparing') {
        Toast.show({
          title: 'order is preparing',
        });
      }
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to preparing order',
      });
    }
  },
);

export const cancelOrderAction = createAsyncThunk(
  'merchantOrders',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>(
        'merchants/orderStatus',
        data,
        HEADERS,
      );
      Toast.show({
        title: 'order is cancelling',
      });
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to cancel order',
      });
    }
  },
);
