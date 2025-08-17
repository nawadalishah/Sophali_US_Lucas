import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, Text } from '../../constants';
import { ProfileCategory } from '../../components';
import { EditSvg, GiftSvg, LogOutSvg, UserIcon } from '../../svg';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { signOut } from '../../redux/authentication/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'native-base';
import { axiosInstance } from '../../config/axios';
import { AppConfig } from '../../config';
import { RolesIcon, SettingsIcon, TokensIcon } from '../../utils/icons';
import TopNavigation from '../../components/TopNavigation';
import Styles from '../../utils/styles';
import { isSubMerchant } from '../../utils/helpers';
import images from '../../constants/images';
import { MOBILE } from '../../utils/orientation';
import { scaleSize } from '../../utils/mixins';

export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const userData: any = user;
  const [userRecord, setUser] = useState<any>();
  const isSubMerchantRole = isSubMerchant(user?.role?.name);
  async function signOutNavigator() {
    await AsyncStorage.removeItem('merchant-token');
    await AsyncStorage.removeItem('merchantData');
    await AsyncStorage.setItem('merchantAppLoggedStatus', '0');

    dispatch(signOut());
  }

  useEffect(() => {
    if (userData?.userDetail.id) {
      getUserSettings(userData?.userDetail.id);
    }
  }, []);

  async function getUserSettings(data: any) {
    if (data) {
      try {
        const res = await axiosInstance.get<any>(`user/${data}`);
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
        return res.data;
      } catch (e: any) {
        Toast.show({
          title: e?.response?.data?.message || 'Something went wrong',
        });
      }
    }
    // setLoadingState(false)
  }

  function renderHeader() {
    return (
      <ImageBackground
        source={{ uri: images.foodBannerImg }}
        style={{
          height: 180,
          paddingHorizontal: 16,
          justifyContent: 'center',
        }}
        imageStyle={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            overflow: 'hidden',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
        <Text
          style={{
            color: COLORS.white,
            ...FONTS.H1,
          }}>
          My Profile
        </Text>
      </ImageBackground>
    );
  }

  function renderPersonInfo() {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          top: -40,
        }}>
        <Shadow
          offset={[0, 0]}
          distance={10}
          startColor={'rgba(6, 38, 100, 0.05)'}
          // @ts-ignore
          finalColor={'rgba(6, 38, 100, 0.0)'}
          viewStyle={{ width: '100%' }}
          style={{ width: '100%' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: '100%',
              height: scaleSize(100),
              backgroundColor: COLORS.white,
              borderRadius: scaleSize(20),
              padding: scaleSize(10),
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('EditProfile' as never)}>
            <View
              style={{
                width: scaleSize(70),
                height: scaleSize(70),
                borderRadius: scaleSize(35),
                marginRight: scaleSize(5),
                justifyContent: 'center',
              }}>
              {userRecord?.company_logo ? (
                <Image
                  style={{
                    width: scaleSize(70),
                    height: scaleSize(70),
                    borderRadius: scaleSize(35),
                  }}
                  source={{
                    uri: `${AppConfig.BaseUrl}getFileById?uuid=${userRecord.company_logo}`,
                  }}
                />
              ) : (
                <UserIcon color={COLORS.black} />
              )}
            </View>

            <View style={[Styles.w70]}>
              <Text
                style={{
                  ...FONTS.H4,
                  color: COLORS.black,
                  fontSize: MOBILE.textSize.common,
                  lineHeight: MOBILE.textSize.large,
                }}>
                {userData?.userDetail?.username || ''}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: MOBILE.textSize.common,
                  color: COLORS.gray,
                  lineHeight: MOBILE.textSize.large,
                  ...Styles.pT5,
                }}>
                {userData?.userDetail?.email}
              </Text>
            </View>
            <View style={{}}>
              <EditSvg />
            </View>
          </TouchableOpacity>
          <View></View>
        </Shadow>
      </View>
    );
  }

  function renderProfileCategory() {
    return (
      <View style={{ width: '100%', paddingHorizontal: 16, top: -20 }}>
        {/* <ProfileCategory
          title='Notification'
          icon={<BellSvg />}
          onPress={() => navigation.navigate('Notifications' as never)}
        /> */}
        <ProfileCategory
          title="Settings"
          icon={<SettingsIcon />}
          onPress={() => navigation.navigate('Settings' as never)}
          disabled={!!isSubMerchantRole}
        />
        {/* <ProfileCategory
          title="Role Management"
          icon={<RolesIcon />}
          onPress={() => navigation.navigate('roleManagement' as never)}
        /> */}
        <ProfileCategory
          title="Subscriptions"
          icon={<GiftSvg />}
          onPress={() => navigation.navigate('subscriptions' as never)}
          disabled={!!isSubMerchantRole}
        />
        {/* <ProfileCategory
          title="Merchant Tokens"
          icon={<TokensIcon />}
          onPress={() => navigation.navigate('TokenList' as never)}
        /> */}
        {/*    <ProfileCategory
          title='Coupon Management'
          icon={<GiftSvg />}
          onPress={() => navigation.navigate('CouponList' as never)}
        />
        <ProfileCategory
          title='SubMerchant Management'
          icon={<StarSvg />}
          onPress={() => navigation.navigate('SubMerchant' as never)}
        /> */}
        <ProfileCategory
          title="Sign Out"
          icon={<LogOutSvg />}
          onPress={() => signOutNavigator()}
        />
      </View>
    );
  }

  return (
    <View style={[Styles.flex, Styles.primaryBackground]}>
      <TopNavigation currentScreen={'My Account'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 35 }}
        showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderPersonInfo()}
        {renderProfileCategory()}
      </ScrollView>
    </View>
  );
}
