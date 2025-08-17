import { createSlice } from '@reduxjs/toolkit';
import {
  IAuthUser,
  IRegister,
  IStepOne,
  IStepTwo,
} from '../../interfaces/dtos';
import {
  fetchUserData,
  getAdminData,
  getMerchnatData,
  getToken,
  signInAction,
  signUpAction,
} from './authAction';

export interface IAuthState {
  user?: IAuthUser;
  stepOne: IStepOne;
  register: IRegister;
  stepTwo: IStepTwo;
  token?: string;
  loading: boolean;
  errors?: string;
  Admin?: string;
}

const initialState: IAuthState = {
  register: { email: '', password: '' },
  stepOne: {
    firstName: '',
    lastName: '',
    contactPerson: '',
    companyContact: 0,
    companyName: '',
  },
  stepTwo: {
    address: '',
  },
  loading: false,
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action) => {
      state.register = action.payload;
    },
    stepOne: (state, action) => {
      state.stepOne = action.payload;
    },
    stepTwo: (state, action) => {
      state.stepTwo = action.payload;
    },
    signOut: state => {
      state.token = undefined;
      state.user = undefined;
    },
    setSignIn: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signUpAction.pending, state => {
        state.loading = true;
      })
      .addCase(signUpAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpAction.rejected, state => {
        state.loading = false;
      })
      .addCase(signInAction.pending, state => {
        state.loading = true;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload?.token;
      })
      .addCase(signInAction.rejected, state => {
        state.loading = false;
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.token = action.payload ?? '';
      })
      .addCase(getMerchnatData.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getAdminData.fulfilled, (state, action) => {
        state.Admin = action.payload;
      })
      .addCase(fetchUserData.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload || state.user;
      })
      .addCase(fetchUserData.rejected, state => {
        state.loading = false;
      });
  },
});

const authReducer = authSlice.reducer;
export const { register, stepOne, signOut, setSignIn } = authSlice.actions;

export default authReducer;
