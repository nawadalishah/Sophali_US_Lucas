import { createSlice } from '@reduxjs/toolkit';
import { getMerchantTokens } from './tokenActions';

export interface IMerchantTokenState {
  merchantTokens?: any;
  isTokenLoading: boolean;
  errors?: string;
}

const initialState: IMerchantTokenState = { isTokenLoading: false };

export const merchantTokenSlice = createSlice({
  name: 'userTokens',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getMerchantTokens.pending, state => {
        state.isTokenLoading = true;
      })
      .addCase(getMerchantTokens.fulfilled, (state, action) => {
        state.isTokenLoading = false;
        state.merchantTokens = action.payload;
      })
      .addCase(getMerchantTokens.rejected, state => {
        state.isTokenLoading = false;
      });
  },
});

const merchantTokenReducer = merchantTokenSlice.reducer;

export default merchantTokenReducer;
