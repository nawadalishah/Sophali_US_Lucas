import { createAsyncThunk } from '@reduxjs/toolkit';
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { getRole } from '../../../utils/helpers';

export const getAddOnsActions = createAsyncThunk(
  'addOns',
  async (data: any, { dispatch }: any) => {
    try {
      const role = await getRole();
      const id = role?.id === 4 ? data?.parent_id : data?.id;
      console.log('id ==', id);
      const res = await axiosInstance.get<any>(`addons/list?added_by=${id}`);
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get addOns',
      });
    }
  },
);
