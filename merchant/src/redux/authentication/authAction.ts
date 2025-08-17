import { createAsyncThunk } from '@reduxjs/toolkit';
// @ts-ignore
import axios, { Axios } from 'axios';
import {
  IAuthUser,
  IRegister,
  ISignIn,
  ISignUp,
  ISignUpResponse,
} from '../../interfaces/dtos';
import { axiosInstance } from '../../config/axios';
import { Toast } from 'native-base';
import { setSignUpError } from '../setErrorSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HEADERS = {
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
};

export const signUpAction = createAsyncThunk(
  'auth/signUpAction',
  async (form: any, { dispatch }) => {
    try {
      const res = await axiosInstance.post<any>('merchants/add', form, HEADERS);
      Toast.show({
        title: 'Register successfully',
      });
      return res.data;
    } catch (e: any) {
      console.log(e, 'error');
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to register',
      });
    }
  },
);

export const signInAction = createAsyncThunk(
  'auth/signInAction',
  async (form: ISignIn) => {
    try {
      const res = await axiosInstance.post<IAuthUser>('login', form, HEADERS);
      if (res?.data?.token) {
        await AsyncStorage.setItem('merchant-token', res.data?.token);
      }
      const response = await axiosInstance.get<any>('setting/admin/1');
      if (response?.data) {
        await AsyncStorage.setItem('adminData', JSON.stringify(response.data));
      }
      await AsyncStorage.setItem('merchantData', JSON.stringify(res.data));
      await AsyncStorage.setItem(
        'role',
        JSON.stringify({ id: res.data?.role?.id, name: res.data?.role?.name }),
      );
      await AsyncStorage.setItem('merchantAppLoggedStatus', '1');
      return res.data;
    } catch (e: any) {
      console.log(e.message);
      Toast.show({
        title: e?.response?.data?.message || 'Unable to login',
      });
    }
  },
);

export const getToken = createAsyncThunk('auth/getToken', async () => {
  try {
    const token = await AsyncStorage.getItem('merchant-token');
    return token;
  } catch (error: any) {
    console.log('Error getting token:', error);
  }
});

export const getRole = createAsyncThunk('auth/getRole', async () => {
  try {
    const role = await AsyncStorage.getItem('role');
    return JSON.parse(role as string);
  } catch (error: any) {
    console.log('Error getting Role:', error);
    return null;
  }
});

export const getMerchnatData = createAsyncThunk(
  'auth/getMerchnatData',
  async () => {
    try {
      const user = await AsyncStorage.getItem('merchantData');
      return JSON.parse(user as string);
    } catch (error: any) {
      console.log('Error getting user:', error);
      return '';
    }
  },
);
export const getAdminData = createAsyncThunk('auth/getAdminData', async () => {
  try {
    const Admin = await AsyncStorage.getItem('adminData');
    console.log('Admin', Admin);
    return JSON.parse(Admin as string);
  } catch (error: any) {
    console.log('Error getting user:', error);
    return '';
  }
});

export const getAppLoggedStatus = createAsyncThunk(
  'auth/getAppLoggedStatus',
  async () => {
    try {
      const user = await AsyncStorage.getItem('merchantAppLoggedStatus');
      return user ?? '';
    } catch (error: any) {
      console.log('Error getting logged status:', error);
      return '';
    }
  },
);

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async userId => {
    try {
      const response = await axiosInstance.get<IAuthUser>(
        `user-logged-info?id=${userId}`,
      );
      return response.data;
    } catch (error) {
      console.log('Error getting logged status:', error, error?.message);
      return null;
    }
  },
);
