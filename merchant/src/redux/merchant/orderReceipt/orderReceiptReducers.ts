import { createSlice } from '@reduxjs/toolkit';
import { orderReceiptAction } from './orderReceiptActions';

export interface IMerchantPurchaseOrderReceiptState {
  merchantPurchaseOrderReceipt?: any;
  loading: boolean;
  errors?: string;
}

const initialState: IMerchantPurchaseOrderReceiptState = { loading: false };

export const merchantPurchaseOrderReceipt = createSlice({
  name: 'merchants',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get All OrderReceiptState
      .addCase(orderReceiptAction.pending, state => {
        state.loading = true;
      })
      .addCase(orderReceiptAction.fulfilled, (state, action) => {
        state.loading = false;
        state.merchantPurchaseOrderReceipt = action.payload;
      })
      .addCase(orderReceiptAction.rejected, state => {
        state.loading = false;
      });
  },
});

const merchantPurchaseOrderReceiptReducer =
  merchantPurchaseOrderReceipt.reducer;

export default merchantPurchaseOrderReceiptReducer;
