import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authentication/authReducer';
import addOnsReducer from './merchant/addOns/addOnsReducer';
import categoryReducer from './merchant/category/categoryReducer';
import {
  couponUserListReducer,
  merchantCouponReducer,
} from './merchant/coupon/couponReducers';
import merchantPurchaseOrderReceiptReducer from './merchant/orderReceipt/orderReceiptReducers';
import productReducer from './merchant/product/productReducer';
import UserListReducer from './merchant/subMerchant/subMerchantReducer';
import merchantTokenReducer from './merchant/token/tokenReducers';
import merchantReducer from './merchantsSlice';
import activeOrderReducer from './orders/activeOrders/activeOrderReducer';
import errorReducer from './setErrorSlice';
import userListReducer from './User/userReducers';
import deleteUserSlice from './User/deleteUserSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    merchants: merchantReducer,
    activeOrders: activeOrderReducer,
    category: categoryReducer,
    product: productReducer,
    merchantToken: merchantTokenReducer,
    merchantCoupon: merchantCouponReducer,
    couponUserList: couponUserListReducer,
    merchantPurchaseOrderReceipt: merchantPurchaseOrderReceiptReducer,
    userList: userListReducer,
    subMerchantList: UserListReducer,
    addOns: addOnsReducer,
    error: errorReducer,
    deleteUser: deleteUserSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
