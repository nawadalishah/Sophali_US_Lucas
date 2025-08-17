import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { HEADERS } from '../../../utils/helpers';

export const deleteAddOnsAction = createAsyncThunk(
  'DeleteAddOns',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('addons/delete', data, HEADERS);
      Toast.show({
        title: 'Delete addons successfully',
      });
      return { ...res.data, status: 200 };
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to addOns category',
      });
    }
  },
);
