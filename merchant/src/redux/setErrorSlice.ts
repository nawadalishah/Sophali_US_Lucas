import { createSlice } from '@reduxjs/toolkit';

interface IErrorState {
  error: boolean;
}

const initialState: IErrorState = {
  error: false,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setSignUpError: state => {
      state.error = true;
    },
  },
});

const errorReducer = errorSlice.reducer;
export const { setSignUpError } = errorSlice.actions;
export default errorReducer;
