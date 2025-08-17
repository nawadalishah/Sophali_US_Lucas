import { createSlice } from '@reduxjs/toolkit';
import { getAddOnsActions } from './addOnsAction';

export interface IAddOnsState {
  addOnsList?: any;
  isAddOnsLoading: boolean;
  errors?: string;
}

const initialState: IAddOnsState = { isAddOnsLoading: false };

export const addOns = createSlice({
  name: 'merchants',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get All product
      .addCase(getAddOnsActions.pending, state => {
        state.isAddOnsLoading = true;
      })
      .addCase(getAddOnsActions.fulfilled, (state, action) => {
        state.isAddOnsLoading = false;
        state.addOnsList = action.payload;
      })
      .addCase(getAddOnsActions.rejected, state => {
        state.isAddOnsLoading = false;
      });
  },
});

const addOnsReducer = addOns.reducer;

export default addOnsReducer;
