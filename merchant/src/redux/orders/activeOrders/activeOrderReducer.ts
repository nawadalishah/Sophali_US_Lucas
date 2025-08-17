import { createSlice } from '@reduxjs/toolkit';
import { activeOrders } from './activeOrderAction';

export interface IMerchantsState {
  orders?: any;
  loadingOrder: boolean;
  errors?: string;
}

const initialState: IMerchantsState = { loadingOrder: false };

export const activeOrder = createSlice({
  name: 'merchants',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get All Merchants
      .addCase(activeOrders.pending, state => {
        state.loadingOrder = true;
      })
      .addCase(activeOrders.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.orders = action.payload;
      })
      .addCase(activeOrders.rejected, state => {
        state.loadingOrder = false;
      });
  },
});

const activeOrderReducer = activeOrder.reducer;

export default activeOrderReducer;
