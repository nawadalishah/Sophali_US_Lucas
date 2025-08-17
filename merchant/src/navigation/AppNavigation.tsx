import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  AddNewCard,
  AllOffers,
  Checkout,
  CheckoutFailed,
  CheckoutSuccess,
  ConfirmationCode,
  DishDescription,
  EditProfile,
  Filter,
  ForgotPassword,
  MainLayout,
  MyAddress,
  Order,
  OrderHistory,
  OrderTracking,
  PasswordHasBeenReset,
  PaymentMethod,
  ResetPassword,
  RestaurantMenu,
  SignIn,
  VerifyPhoneNumber,
} from '../screens';
import UserInfo from '../screens/account/UserInfo';
import UserAddress from '../screens/account/UserAddress';
import { useAppDispatch, useAppSelector } from '../redux/Store';
import Home from '../screens/dashboard/Home';
import {
  getToken,
  getMerchnatData,
  getAppLoggedStatus,
} from '../redux/authentication/authAction';
import Category from '../screens/merchant/category/category';
import MerchantOrderReceipt from '../screens/merchant/orderMerchantReceipt/orderMerchantReceipt';
import ProductI from '../screens/merchant/product/product_1';
import Menu from '../screens/profile/Menu';
import AddProduct from '../screens/merchant/product/addProuct';
import UserPaymentMethod from '../screens/account/UserPayment';
import OrdersScreen from '../screens/merchant/Order/OrderScreen';
import CouponList from '../screens/profile/couponManagement/CouponList';
import SignUp from '../screens/account/SignUp';
import SubscriberList from '../screens/profile/couponManagement/SubscriberList';
import CouponUserList from '../screens/profile/couponManagement/sendCouponList';
import TokenList from '../screens/profile/tokenManagement/TokenList';
import WithdrawToken from '../screens/profile/tokenManagement/WithdrawToken';
import AddCoupon from '../screens/profile/couponManagement/AddCoupon';
import EditProduct from '../screens/merchant/product/editProuct';
import EditCoupon from '../screens/profile/couponManagement/EditCoupon';
import NotificationScreen from '../screens/profile/NotificationsManagement/Notifications';
import Settings from '../screens/profile/Settings';
import SubMerchant from '../screens/profile/subMerchant/SubMerchantList';
import AddOnsList from '../screens/merchant/addOns/AddOnsList';
import AddAddsOns from '../screens/merchant/addOns/AddAddOns';
import EditAddOn from '../screens/merchant/addOns/editAddOn';
import AddSubMerchant from '../screens/profile/subMerchant/addSubMerchant';
import EditSubMerchant from '../screens/profile/subMerchant/editSubMerchant';
import RoleList from '../screens/profile/RoleManagement/RoleList';
import Subscriptions from '../screens/profile/Subscriptions';
import Tools from '../screens/profile/Tools';
import Transactions from '../screens/profile/Transacions';
import BusinessInfo from '../screens/profile/BusinessInfo';
import BankingInfo from '../screens/profile/BankingInfo';
import ChangePassword from '../screens/profile/ChangePassword';
import ProductDetail from '../screens/merchant/product/ProductDetail';
import Messages from '../screens/dashboard/Messages';
import Analytics from '../screens/dashboard/Analytics';
import Profile from '../screens/profile/Profile';
import CheckedInUser from '../checkinusers/CheckedInUser';
import SubNotification from '../screens/profile/NotificationsManagement/SubNotification';
import RevenueScreen from '../screens/profile/Revenue';
import WithDrawSuccess from '../screens/profile/tokenManagement/WithDrawSuccess';
import SignUpSuccess from '../screens/account/SignUpSuccess';
import SignUpFail from '../screens/account/SignUpFail';
import ForgotPasswordOTP from '../screens/account/ForgotPasswordOTP';
import OrderCompleted from '../screens/merchant/Order/OrderCompleted';
import WithdrawalReceipt from '../screens/profile/Transacions/WithdrawalReceipt';

const Stack = createStackNavigator();

export default function Navigation() {
  const dispatch = useAppDispatch();
  const [hasToken, setHasToken] = useState(false);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    checkLoginState();
  }, []);

  useEffect(() => {
    try {
      if (!user) {
        setHasToken(false);
        return;
      }
      setHasToken(true);
    } catch (error: any) {
      console.log(error);
    }
  }, [user]);

  function checkLoginState() {
    dispatch(getToken());
    dispatch(getMerchnatData());
    dispatch(getAppLoggedStatus());
  }

  if (!hasToken) {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerShown: false,
            }}
            initialRouteName="SignIn">
            <Stack.Screen name="Filter" component={Filter} />
            <Stack.Screen
              name="PasswordHasBeenReset"
              component={PasswordHasBeenReset}
            />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen
              name="ForgotPasswordOTP"
              component={ForgotPasswordOTP}
            />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUpSuccess" component={SignUpSuccess} />
            <Stack.Screen name="SignUpFail" component={SignUpFail} />

            <Stack.Screen name="UserInfoScreen" component={UserInfo} />
            <Stack.Screen name="UserPayment" component={UserPaymentMethod} />
            <Stack.Screen name="UserAddress" component={UserAddress} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
  if (hasToken) {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerShown: false,
            }}
            initialRouteName="MainLayout">
            <Stack.Screen name="MainLayout" component={MainLayout} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="DishDescription" component={DishDescription} />
            <Stack.Screen name="Chats" component={Order} />
            <Stack.Screen
              name="WithdrawalReceipt"
              component={WithdrawalReceipt}
            />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="CheckoutSuccess" component={CheckoutSuccess} />
            <Stack.Screen name="OrderHistory" component={OrderHistory} />
            <Stack.Screen name="CheckoutFailed" component={CheckoutFailed} />
            <Stack.Screen name="OrderTracking" component={OrderTracking} />
            <Stack.Screen name="AllOffers" component={AllOffers} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="AddNewCard" component={AddNewCard} />
            <Stack.Screen name="MyAddress" component={MyAddress} />
            <Stack.Screen name="CouponList" component={CouponList} />
            <Stack.Screen name="RestaurantMenu" component={RestaurantMenu} />
            <Stack.Screen name="CheckedInUser" component={CheckedInUser} />
            <Stack.Screen
              name="ConfirmationCode"
              component={ConfirmationCode}
            />
            <Stack.Screen
              name="VerifyPhoneNumber"
              component={VerifyPhoneNumber}
            />
            <Stack.Screen name="CategoryList" component={Category} />
            <Stack.Screen name="ProductList" component={ProductI} />
            <Stack.Screen name="Menu" component={Menu} />

            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen
              name="MerchantOrderReceipt"
              component={MerchantOrderReceipt}
            />
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="OrdersList" component={OrdersScreen} />
            <Stack.Screen name="OrderCompleted" component={OrderCompleted} />

            <Stack.Screen name="SubscriberList" component={SubscriberList} />

            <Stack.Screen name="TokenList" component={TokenList} />
            <Stack.Screen name="WithdrawToken" component={WithdrawToken} />
            <Stack.Screen name="WithDrawSuccess" component={WithDrawSuccess} />

            <Stack.Screen name="CouponUserList" component={CouponUserList} />

            <Stack.Screen name="AddCoupon" component={AddCoupon} />

            <Stack.Screen name="EditCoupon" component={EditCoupon} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="BusinessInfo" component={BusinessInfo} />
            <Stack.Screen name="BankingInfo" component={BankingInfo} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="SubMerchant" component={SubMerchant} />
            <Stack.Screen name="AddOnsList" component={AddOnsList} />
            <Stack.Screen name="AddAddOns" component={AddAddsOns} />
            <Stack.Screen name="EditAddOn" component={EditAddOn} />
            <Stack.Screen name="AddSubMerchant" component={AddSubMerchant} />
            <Stack.Screen name="EditSubMerchant" component={EditSubMerchant} />
            <Stack.Screen name="roleManagement" component={RoleList} />
            <Stack.Screen name="subscriptions" component={Subscriptions} />
            <Stack.Screen name="tools" component={Tools} />
            <Stack.Screen name="My Account" component={Profile} />
            {/* Accounts */}
            <Stack.Screen name="Transactions" component={Transactions} />
            {/* Sales */}
            <Stack.Screen name="Revenue" component={RevenueScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="Messages" component={Messages} />
            <Stack.Screen name="Analytics" component={Analytics} />
            <Stack.Screen name="SubNotification" component={SubNotification} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
