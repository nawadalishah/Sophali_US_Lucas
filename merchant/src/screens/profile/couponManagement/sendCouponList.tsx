import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

import {
  AndroidSafeArea,
  COLORS,
  dummyData,
  FONTS,
  SIZES,
} from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getCouponUserList } from '../../../redux/merchant/coupon/couponActions';

export default function CouponUserList() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const { couponUserList } = useAppSelector(state => state.couponUserList);
  const route = useRoute();
  const { coupon_id }: any = route.params;

  useEffect(() => {
    dispatch(
      getCouponUserList({
        couponId: coupon_id,
        userId: userData?.userDetail.id,
      }),
    );
  }, []);

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <Text style={{ ...FONTS.H2, marginBottom: 8, color: COLORS.black }}>
          Sent Users List
        </Text>

        {/* <TouchableOpacity
          style={{
            width: 73,
            height: 73,
            backgroundColor: COLORS.transparent,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => openPopupModel()}
        >
          <View
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <PlusSvg />
          </View>
        </TouchableOpacity> */}
      </View>
    );
  }

  function renderItem(data: any) {
    return (
      <Shadow
        offset={[0, 0]}
        distance={15}
        startColor={'rgba(6, 38, 100, 0.04)'}
        // @ts-ignore
        finalColor={'rgba(6, 38, 100, 0.0)'}
        viewStyle={{ width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            width: '100%',
            height: 100,
            backgroundColor: COLORS.white,
            borderRadius: 20,
          }}>
          <View
            style={{
              flex: 1,
              marginTop: 12,
              marginBottom: 10,
              marginHorizontal: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...FONTS.H4,
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                User_Id:
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {'U_' + data?.item?.User?.id}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...FONTS.H4,
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                Username
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data?.item?.User?.username || data?.item?.User?.first_name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...FONTS.H4,
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                Email
              </Text>
              <Text
                style={{
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data?.item?.User?.email}
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
    );
  }

  function renderList() {
    return (
      <View style={{}}>
        <SwipeListView
          data={
            couponUserList && couponUserList?.couponUsers.length
              ? couponUserList.couponUsers
              : []
          }
          keyExtractor={(item: any) => `${item.id}`}
          renderItem={renderItem}
          // renderHiddenItem={renderHiddenItem}
          ListHeaderComponent={renderHeader}
          rightOpenValue={-105}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderList()}
      {/* {renderOptionModal()} */}
    </SafeAreaView>
  );
}
