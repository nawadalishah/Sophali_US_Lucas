import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRole } from '../../../utils/helpers';
import { axiosInstance } from '../../../config/axios';
import { setSignUpError } from '../../setErrorSlice';
import { Toast } from 'native-base';

export const productAction = createAsyncThunk(
  'product',
  async (
    { data, isSubProduct }: { data: any; isSubProduct: boolean },
    { dispatch },
  ) => {
    try {
      const role = await getRole();
      const id = role?.id === 4 ? data?.parent_id : data?.id;
      const isSubProductParam = isSubProduct ? '&isSubProduct=true' : '';
      const res = await axiosInstance.get<any>(
        `products/all?merchant_id=${id}${isSubProductParam}`,
      );
      return res.data;
    } catch (e: any) {
      dispatch(setSignUpError());
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get product',
      });
    }
  },
);
