import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { HEADERS, getRole } from '../../../utils/helpers';

export const getMerchantCouponAction = createAsyncThunk(
  'merchantTokens',
  async (data: any, { dispatch }) => {
    try {
      const role = await getRole();
      const id = role?.id === 4 ? data?.parent_id : data?.id;
      const res = await axiosInstance.get<any>(
        `coupon/all?merchant_id=${id}&isTemplate=true`,
      );
      return res.data;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get merchant coupon',
      });
    }
  },
);

export const getCouponUserList = createAsyncThunk(
  'CouponUserList',
  async (data: any, { dispatch }) => {
    try {
      console.log('params ==', data);
      const res = await axiosInstance.get<any>(
        `couponuser/merchant-coupon-user-list/${data.userId}?coupon_id=${data.couponId}`,
      );
      return res.data;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get coupon user list',
      });
    }
  },
);

export const sendCouponAction = createAsyncThunk(
  'sendCoupon',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>(
        'coupon/send-coupon-users',
        data,
        HEADERS,
      );
      Toast.show({
        title: 'Send Coupon successfully',
      });
      return res.data;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to send coupon',
      });
    }
  },
);
