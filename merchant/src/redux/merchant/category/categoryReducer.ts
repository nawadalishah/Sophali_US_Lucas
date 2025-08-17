import { createSlice } from '@reduxjs/toolkit';
import { categoryAction } from './categoryAction';

export interface IMerchantsState {
  categories?: any;
  loading: boolean;
  errors?: string;
}

const initialState: IMerchantsState = { loading: false };

export const category = createSlice({
  name: 'merchants',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get All categories
      .addCase(categoryAction.pending, state => {
        state.loading = true;
      })
      .addCase(categoryAction.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(categoryAction.rejected, state => {
        state.loading = false;
      });
  },
});

const categoryReducer = category.reducer;

export default categoryReducer;
