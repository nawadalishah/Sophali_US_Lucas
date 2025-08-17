import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { COLORS, Text } from '../constants';
import Styles from '../utils/styles';
import { scaleSize } from '../utils/mixins';
import { useAppSelector, useAppDispatch } from '../redux/Store';
import { pusherEventHandler } from '../utils';
import { axiosInstance } from '../config/axios';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  isMerchantOrderAllowed,
  isCouponAllowed,
  isMenuAllowed,
  isSubMerchant,
  isBronzePlan,
} from '../utils/helpers';
import { FONT_FAMILY, WEIGHT } from '../constants/theme';
import { MOBILE } from '../utils/orientation';
import { fetchUserData } from '../redux/authentication/authAction';

const IconTypes = {
  FontAwesome: FontAwesome,
  MaterialCommunityIcons: MaterialCommunityIcons,
  MaterialIcons: MaterialIcons,
};

const TopNavigation = ({ currentScreen = 'MainLayout' }) => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [notiCount, setNotiCount] = useState(0);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  // Update the user-related checks whenever the user object changes
  const [isSubscriptionDisabled, setIsSubscriptionDisabled] = useState(false);
  const [isCouponDisabled, setIsCouponDisabled] = useState(false);
  const [isMenuDisabled, setIsMenuDisabled] = useState(false);
  const [isMerchantsOrderDisabled, setIsMerchantsOrderDisabled] =
    useState(false);
  const [isSubMerchantRole, setIsSubMerchantRole] = useState(false);

  useEffect(() => {
    setIsSubscriptionDisabled(isBronzePlan(user?.planType || ''));
    setIsCouponDisabled(!isCouponAllowed(user?.allowedPermissions));
    setIsMenuDisabled(!isMenuAllowed(user?.allowedPermissions));
    setIsMerchantsOrderDisabled(
      !isMerchantOrderAllowed(user?.allowedPermissions),
    );
    setIsSubMerchantRole(isSubMerchant(user?.role?.name));
  }, [user]);

  useEffect(() => {
    getNotiCount();
  }, [isFocused]);

  useEffect(() => {
    pusherActivate();
  }, [user, isFocused]);

  const pusherActivate = useCallback(async () => {
    try {
      pusherEventHandler(user?.userData?.userDetail?.id, getNotiCount);
    } catch (error) {
      console.log('Error activating Pusher:', error);
    }
  }, [user]);

  const getNotiCount = async () => {
    try {
      const res = await axiosInstance.get<any>(
        `notifications/get-notification-count?merchant_id=${user?.userDetail?.id}`,
      );
      if (res && res.data && res?.data?.notificationMessages) {
        setNotiCount(res.data.notificationMessages);
      } else {
        setNotiCount(0);
      }
    } catch (error: any) {
      setNotiCount(0);
    }
  };

  const topTab = [
    {
      id: '1',
      name: 'Home',
      screen: 'MainLayout',
      iconType: 'FontAwesome',
      iconName: 'home',
      size: MOBILE.iconSize.smallest,
      requiredPermission: false,
    },
    {
      id: '2',
      name: 'KOB',
      screen: 'OrdersList',
      iconType: 'MaterialCommunityIcons',
      iconName: 'food-turkey',
      size: MOBILE.iconSize.smallest,
      requiredPermission: isSubMerchantRole && isMerchantsOrderDisabled,
    },
    {
      id: '3',
      name: 'Menu',
      screen: 'Menu',
      iconType: 'MaterialCommunityIcons',
      iconName: 'silverware-fork-knife',
      size: MOBILE.iconSize.smallest,
      requiredPermission: isSubMerchantRole && isMenuDisabled,
    },
    {
      id: '4',
      name: 'Coupons',
      screen: 'CouponList',
      requiredPermission:
        (isSubMerchantRole && isCouponDisabled) || isSubscriptionDisabled,
      iconType: 'FontAwesome',
      iconName: 'ticket',
      size: MOBILE.iconSize.smallest,
    },
    {
      id: '5',
      name: 'Notifications',
      screen: 'Notifications',
      size: MOBILE.iconSize.smallest,
      iconType: 'FontAwesome',
      iconName: 'bell',
      requiredPermission: false,
      count: true,
      textStyle: Styles.mT2,
    },
    {
      id: '6',
      name: 'My Account',
      screen: 'My Account',
      iconType: 'MaterialCommunityIcons',
      iconName: 'account-circle',
      size: MOBILE.iconSize.smallest,
      requiredPermission: false,
    },
  ];

  const screenNavigator = (screen: string) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: screen,
      }),
    );
  };

  const handleTopNavigation = (screen: any) => {
    screenNavigator(screen);
  };

  const IconComponent = ({
    IconType,
    requiredPermission,
    iconName,
    size,
    screen,
    name,
    textStyle,
    count = false,
  }) => {
    const Icon = IconTypes[IconType];
    return (
      <View
        style={[
          Styles.flexDirectionRow,
          Styles.alignItemsCenter,
          Styles.justifyContentCenter,
          Styles.alignContentCenter,
          { padding: 8, borderRadius: 18},
          currentScreen === screen && Styles.loadingBackground
        ]}>
        <Icon
          name={iconName}
          size={size}
          color={
            currentScreen === screen
              ? COLORS.white
              : requiredPermission
                ? COLORS.white
                : COLORS.black
          }
        />
        <Text
          size={15.5}
          weight={WEIGHT.w500}
          fontFamily={FONT_FAMILY.BOLD}
          color={
            currentScreen === screen
              ? COLORS.white
              : requiredPermission
                ? COLORS.white
                : COLORS.black
          }>
          {name}
        </Text>
        {count && notiCount > 0 && (
          <View style={styles.dot}>
            <Text
              style={{
                color: COLORS.white,
                fontSize: MOBILE.textSize.xxsSmall,
              }}>
              {notiCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.topBarNavigation}>
      {topTab.map((item: any) => (
        <TouchableOpacity
          key={item?.id}
          activeOpacity={0.7}
          disabled={!!item?.requiredPermission}
          style={[
            Styles.flexDirectionRow,
            Styles.justifyContentSpaceBetween,
            // { width: scaleSize(55) },
            Styles.alignItemsCenter,
            Styles.alignContentCenter,
          ]}
          onPress={() => {
            handleTopNavigation(item?.screen);
          }}>
          <IconComponent
            IconType={item?.iconType}
            iconName={item?.iconName}
            {...item}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  topBarNavigation: {
    backgroundColor: COLORS.white,
    ...Styles.flexDirectionRow,
    ...Styles.pV1,
    ...Styles.justifyContentSpaceBetween,
    ...Styles.alignItemsCenter,
    // ...Styles.pH10,
    // borderRadius: scaleSize(5),
    // ...Styles.w100,
  },
  dot: {
    position: 'absolute',
    top: scaleSize(-5),
    right: scaleSize(10),
    backgroundColor: COLORS.green,
    borderRadius: scaleSize(10),
    width: scaleSize(15),
    height: scaleSize(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopNavigation;
