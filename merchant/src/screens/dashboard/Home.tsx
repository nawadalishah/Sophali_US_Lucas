import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { AnalyticsSvg, TransactionSvg } from '../../svg';
import { useAppDispatch, useAppSelector } from '../../redux/Store';

import { axiosInstance } from '../../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardMainPage } from '../../components';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import TopNavigation from '../../components/TopNavigation';
import { pusherEventHandler } from '../../utils';
import Styles from '../../utils/styles';
import { scaleFont, scaleSize } from '../../utils/mixins';
import { RESIZE_MODE } from '../../constants/theme';
import {
  CashRegisterIcon,
  KOBIcon,
  MenuIcon,
  PickUpIcon,
  RolesIcon,
} from '../../utils/icons';
import {
  isMenuAllowed,
  isMerchantOrderAllowed,
  isSubMerchant,
} from '../../utils/helpers';
import images from '../../constants/images';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const loading = useAppSelector(state => state.activeOrders.loadingOrder);
  const [merchantSettings, setMerchantSettings] = useState<any>({});
  const [settings, setSettings] = useState<any>({});
  const [orderCount, setOrderCount] = useState<any>(0);
  const [productCount, setProductCount] = useState<string>('0');
  const [categoryCount, setCategoryCount] = useState<string>('0');
  const [previousDayEarn, setPreviousDayEarn] = useState<string>('0');
  const [previousDayCount, setPreviousDayCount] = useState<string>('0');
  const [balance, setBalance] = useState<string>('0');
  const [pendingOrders, setPendingOrders] = useState<any>('0');
  const [completedOrder, setCompletedOrders] = useState<any>({
    orderClosed: '0',
    orderPrepared: '0',
  });
  const [notification, setNotification] = useState<any>(false);
  const [loadingState, setLoadingState] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const userData = user;
  const isFocused = useIsFocused();
  const isComponentMounted = useRef(false);
  const isSubMerchantRole = isSubMerchant(user?.role?.name);
  const isMenuDisabled = !isMenuAllowed(user?.allowedPermissions);
  const isMerchantsOrderDisabled = !isMerchantOrderAllowed(
    user?.allowedPermissions,
  );

  useEffect(() => {
    if (isComponentMounted.current) {
      schedulePushNotification(userData);
    } else {
      isComponentMounted.current = true;
    }
  }, [orderCount]);

  const getDataAdmin = async () => {
    const data = await AsyncStorage.getItem('adminData');
    return data;
  };
  useEffect(() => {
    getDataAdmin();
  }, []);

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    pusherActivate();
  }, [user, isFocused]);

  useEffect(() => {
    if (merchantSettings && merchantSettings.settings) {
      setSettings(merchantSettings.settings);
    }
  }, [merchantSettings]);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
    };
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {});

    registerForPushNotifications();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const pusherActivate = useCallback(async () => {
    try {
      pusherEventHandler(userData?.userDetail?.id, fetchData);
    } catch (error) {
      console.log('Error activating Pusher:', error);
    }
  }, [userData?.userDetail?.id, fetchData]);

  const fetchData = useCallback(() => {
    getPendingOrdersCount();
    getTotalBalance();
    getPreviousDayEarn();
    getOrderCounter();
    getMenuCounter();
    getCompletedOrdersCount();
  }, []);

  const getTotalBalance = async () => {
    try {
      const res = await axiosInstance.get<any>(
        `merchants/merchant-token-balance?user_id=${userData?.userDetail?.id}`,
      );
      if (res.data && res.data.balance) {
        let balances = res.data.balance;
        balances = balances.toFixed(2);
        balances = balances.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setBalance(balances);
        setLoadingState(false);
      } else {
        setBalance(0);
      }
    } catch (e: any) {
      setLoadingState(false);
      setBalance(0);
    }
  };

  const getPreviousDayEarn = async () => {
    try {
      const res = await axiosInstance.get<any>(
        `merchant-yesterday-earning-and-count?merchant_id=${userData?.userDetail?.id}`,
      );
      if (res.data && res.data.orderCount && res.data.amount) {
        let balances = res.data.amount;
        balances = parseFloat(balances).toFixed(2);
        // balances = balances.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setPreviousDayEarn(parseFloat(balances).toFixed(2));
        setPreviousDayCount(res.data.orderCount);
        setLoadingState(false);
      } else {
        setPreviousDayCount(0);
        setPreviousDayEarn(parseFloat(0).toFixed(2));
        setLoadingState(false);
      }
    } catch (e: any) {
      setLoadingState(false);
      setPreviousDayCount(0);
      setPreviousDayEarn(parseFloat(0).toFixed(2));
    }
  };
  const getPendingOrdersCount = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get<any>(
        `prepared-orders?merchant_id=${id}`,
      );
      if (res.data && res.data.count) {
        setPendingOrders(res.data.count);
        setLoadingState(false);
      } else {
        setPendingOrders(0);
      }
    } catch (e: any) {
      setLoadingState(false);
      setPendingOrders(0);
    }
  };
  const getCompletedOrdersCount = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get<any>(
        `completed-orders?merchant_id=${id}`,
      );
      if (res?.data) {
        setCompletedOrders({
          orderClosed: res?.data?.orderClosed || '0',
          orderPrepared: res?.data?.orderPrepared || '0',
        });
        setLoadingState(false);
      } else {
        setCompletedOrders({ orderClosed: '0', orderPrepared: '0' });
      }
    } catch (e: any) {
      setLoadingState(false);
      setCompletedOrders({ orderClosed: '0', orderPrepared: '0' });
    }
  };
  const getMenuCounter = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get<any>(
        `categories-and-product-count?merchant_id=${id}`,
      );
      if (res?.data) {
        setProductCount('' + res?.data?.productCount || '0');
        setCategoryCount('' + res?.data?.catCount || '0');
        setLoadingState(false);
      } else {
        setCategoryCount(0);
        setProductCount(0);
      }
    } catch (e: any) {
      setLoadingState(false);
      setCategoryCount(0);
      setProductCount(0);
    }
  };
  const getOrderCounter = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get<any>(
        `orders/get-order-count?merchant_id=${id}`,
      );
      if (res.data && res.data.orderCount) {
        setOrderCount('' + res.data.orderCount);
        setLoadingState(false);
      } else {
        setOrderCount(0);
      }
    } catch (e: any) {
      setLoadingState(false);
      setOrderCount(0);
    }
  };

  const renderHeader = () => (
    <ImageBackground
      source={{
        uri: images.foodBannerImg,
      }}
      resizeMode={RESIZE_MODE.COVER}
      style={[
        {
          height: scaleSize(150),
          borderRadius: scaleSize(10),
        },
        Styles.justifyContentCenter,
        Styles.alignItemsCenter,
      ]}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Black with 30% opacity
        }}
      />
      <Text
        style={{
          fontSize: scaleFont(24),
          color: 'white', // White text color
          fontWeight: 'bold', // Bold text
        }}>
        {userData?.userDetail?.company_name}
      </Text>
    </ImageBackground>
  );

  return (
    <View style={[Styles.flex, Styles.primaryBackground]}>
      <TopNavigation currentScreen={'MainLayout'} />
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <CardMainPage
          image={<KOBIcon />}
          title="Kitchen Ordering Board"
          screen="OrdersList"
          subheadings={[
            { text: 'Orders', count: orderCount },
            { text: 'Pending Orders', count: pendingOrders },
          ]}
          disabled={isSubMerchantRole && isMerchantsOrderDisabled}
        />
        <CardMainPage
          image={<PickUpIcon />}
          title="Order Pick Up"
          screen="OrderCompleted"
          subheadings={[
            {
              text: 'Prepared Orders',
              count: completedOrder?.orderPrepared || '0',
            },
            {
              text: 'Closed Orders',
              count: completedOrder?.orderClosed || '0',
            },
          ]}
          disabled={isSubMerchantRole && isMerchantsOrderDisabled}
        />
        <CardMainPage
          image={<MenuIcon />}
          title="Menu"
          screen="Menu"
          subheadings={[
            { text: 'Products', count: productCount },
            { text: 'Categories', count: categoryCount },
          ]}
          disabled={isSubMerchantRole && isMenuDisabled}
        />
        <CardMainPage
          image={
            <TransactionSvg
              color={COLORS.black}
              width={scaleSize(35)}
              height={scaleSize(35)}
            />
          }
          title="Sales"
          screen="Revenue"
          subheadings={[
            { text: "Today's Sales", count: previousDayCount },
            { text: "Today's Earned Amount", count: '$' + previousDayEarn },
          ]}
          disabled={isSubMerchantRole}
        />
        <CardMainPage
          image={<CashRegisterIcon />}
          title="Accounts"
          screen="Transactions"
          subheadings={
            [
              // { text: 'Sales Count', count: previousDayCount },
              // { text: 'Earned Amount', count: '$' + previousDayEarn },
            ]
          }
          disabled={isSubMerchantRole}
        />
        <CardMainPage
          image={
            <AnalyticsSvg
              color={COLORS.black}
              width={scaleSize(35)}
              height={scaleSize(35)}
            />
          }
          title="Analytics"
          screen="Analytics"
          subheadings={[]}
          disabled={isSubMerchantRole}
        />
        <CardMainPage
          title="Administration Rights"
          screen="SubMerchant"
          image={<RolesIcon color={COLORS.black} />}
          subheadings={[]}
          disabled={isSubMerchantRole}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#013266',
    paddingTop: Platform.OS === 'ios' ? 46 : 30,
    paddingHorizontal: 27,
    justifyContent: 'space-between', // Added flex justification
  },
  containerLevel2: {
    flexDirection: 'row',
    backgroundColor: '#013266',
    paddingBottom: Platform.OS === 'ios' ? 46 : 30,
    paddingHorizontal: 27,
    justifyContent: 'space-between', // Added flex justification
  },
  iconContainer: {
    // alignItems: 'center',
    // flex: 1, // Equal spacing using flex+
    flexDirection: 'row',
    // marginRight: 12,
    // marginLeft: 10,
  },
  topBar: {
    position: 'absolute', // To overlap the top of the image
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    opacity: 0.8,
    backgroundColor: COLORS.lightBlue,
  },
  merchantName: {
    fontSize: 25,
    fontWeight: '900',
    color: COLORS.lightBlue,
    shadowColor: COLORS.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationCount: {
    fontWeight: '900',
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.black, // Adjust color as needed
  },
  topBarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: `${COLORS.black}`,
  },
});

const schedulePushNotification = async (userData: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'New Order',
      body: `${userData?.userDetail?.username || ''} new order has been placed`,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
};

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: '5f2562dd-905b-4768-af9b-45522db34674',
      })
    ).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
};

export default Home;
