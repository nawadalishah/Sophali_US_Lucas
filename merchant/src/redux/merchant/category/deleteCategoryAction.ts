import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { HEADERS } from '../../../utils/helpers';

export const deleteCategoryAction = createAsyncThunk(
  'AddCategory',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>(
        'category/delete',
        data,
        HEADERS,
      );
      Toast.show({
        title: 'Delete category successfully',
      });
      return { ...res.data, status: 200 };
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to delete category',
      });
    }
  },
);
