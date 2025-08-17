import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { HEADERS } from '../../../utils/helpers';

export const addCategoryAction = createAsyncThunk(
  'AddCategory',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('category/add', data, HEADERS);
      Toast.show({
        title: 'Added category successfully',
      });
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to add category',
      });
    }
  },
);

export const editCategoryAction = createAsyncThunk(
  'EditCategory',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>(
        'category/update',
        data,
        HEADERS,
      );
      Toast.show({
        title: 'Edit category successfully',
      });
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to edit category',
      });
    }
  },
);
