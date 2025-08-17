import { IMerchantsResponse } from '../interfaces/dtos';
import { createSlice } from '@reduxjs/toolkit';
import { getMerchantsAction } from './actions/merchantsaction';

export interface IMerchantsState {
  merchants?: IMerchantsResponse;
  loading: boolean;
  errors?: string;
}

const initialState: IMerchantsState = { loading: false };

export const merchantsSlice = createSlice({
  name: 'merchants',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get All Merchants
      .addCase(getMerchantsAction.pending, state => {
        state.loading = true;
      })
      .addCase(getMerchantsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.merchants = action.payload;
      })
      .addCase(getMerchantsAction.rejected, state => {
        state.loading = false;
      });
  },
});

const merchantReducer = merchantsSlice.reducer;

export default merchantReducer;
