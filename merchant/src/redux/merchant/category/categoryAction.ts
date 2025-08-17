import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import axios, { Axios } from 'axios';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { getRole } from '../../../utils/helpers';

export const categoryAction = createAsyncThunk(
  'category',
  async (data: any, { dispatch }) => {
    const role = await getRole();
    const id = role?.id === 4 ? data?.parent_id : data?.id;
    try {
      const res = await axiosInstance.get<any>(
        `categories/list?added_by=${id}`,
      );
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get category',
      });
    }
  },
);
