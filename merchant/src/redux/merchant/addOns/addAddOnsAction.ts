import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { HEADERS } from '../../../utils/helpers';

export const addProductAction = createAsyncThunk(
  'Addproduct',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('product/add', data, HEADERS);
      Toast.show({
        title: 'Added product successfully',
      });
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to add product',
      });
    }
  },
);

export const uploadAction = createAsyncThunk(
  'imageUpload',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('add', data, HEADERS);
      Toast.show({
        title: 'image upload successfully',
      });
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to upload image',
      });
    }
  },
);

export const addAddOnsAction = createAsyncThunk(
  'AddAddOns',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('addons/add', data, HEADERS);
      Toast.show({
        title: 'Added addOns successfully',
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

export const editAddOnsAction = createAsyncThunk(
  'EditAddOns',
  async (data: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('addons/update', data, HEADERS);
      Toast.show({
        title: 'Edit addOns successfully',
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
