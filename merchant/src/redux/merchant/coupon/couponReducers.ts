import { createSlice } from '@reduxjs/toolkit';
import { getMerchantsAction } from '../../actions/merchantsaction';
import { getCouponUserList, getMerchantCouponAction } from './couponActions';

export interface IMerchantCouponState {
  merchantCoupons?: any;
  couponUserList?: any;
  isTokenLoading: boolean;
  isCouponLoading?: boolean;
  errors?: string;
}

const initialState: IMerchantCouponState = {
  isCouponLoading: false,
  isTokenLoading: false,
};

export const merchantCouponSlice = createSlice({
  name: 'merchantCoupons',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getMerchantCouponAction.pending, state => {
        state.isCouponLoading = true;
      })
      .addCase(getMerchantCouponAction.fulfilled, (state, action) => {
        state.isCouponLoading = false;
        state.merchantCoupons = action.payload;
      })
      .addCase(getMerchantCouponAction.rejected, state => {
        state.isCouponLoading = false;
      });
  },
});

export const couponUserListSlice = createSlice({
  name: 'couponUserList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCouponUserList.pending, state => {
        state.isTokenLoading = true;
      })
      .addCase(getCouponUserList.fulfilled, (state, action) => {
        state.isTokenLoading = false;
        state.couponUserList = action.payload;
      })
      .addCase(getCouponUserList.rejected, state => {
        state.isTokenLoading = false;
      });
  },
});

const merchantCouponReducer = merchantCouponSlice.reducer;
const couponUserListReducer = couponUserListSlice.reducer;

export { merchantCouponReducer, couponUserListReducer };
