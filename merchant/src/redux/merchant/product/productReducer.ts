import { createSlice } from '@reduxjs/toolkit';
import { productAction } from './productAction';

export interface IMerchantsState {
  products?: any;
  isProductLoading: boolean;
  errors?: string;
}

const initialState: IMerchantsState = { isProductLoading: false };

export const product = createSlice({
  name: 'merchants',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get All product
      .addCase(productAction.pending, state => {
        state.isProductLoading = true;
      })
      .addCase(productAction.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.products = action.payload;
      })
      .addCase(productAction.rejected, state => {
        state.isProductLoading = false;
      });
  },
});

const productReducer = product.reducer;

export default productReducer;
