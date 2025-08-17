import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

import { AndroidSafeArea, COLORS, FONTS } from '../../constants';

import { useAppSelector } from '../../redux/Store';
import { Toast } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { axiosInstance } from '../../config/axios';
import moment from 'moment';

export default function CheckedInUsers() {
  const [loadingState, setLoadingState] = useState(false);
  const { user } = useAppSelector(state => state.auth);
  const loading = useAppSelector(state => state.subMerchantList.loadingList);
  const userData = user;
  const [list, setList] = useState();
  const [refresh, setOnRefresh] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    onInit();
  }, [isFocused]);

  function onInit() {
    if (userData?.userDetail.id) {
      const payload = {
        UserTypeId: 4,
        parent_id: userData?.userDetail.id,
      };
      setList([] as any);
      getSubMerchantList(payload);
    }
  }

  async function getSubMerchantList(data: any) {
    if (data && data.parent_id) {
      setIsListLoading(true);
      try {
        const res = await axiosInstance.get<any>(
          `users/subscribe-user-list/${data.parent_id}`,
        );
        if (res.data && res.data.userList) {
          setIsListLoading(false);
          setList(res.data?.userList);
        }
        return res.data;
      } catch (e: any) {
        Toast.show({
          title: e?.response?.data?.message || 'Something went wrong',
        });
      }
    }
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          marginBottom: 20,
        }}>
        <Text style={{ marginBottom: 20, ...FONTS.H2 }}>Checked in Users</Text>
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
            height: 91,
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
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...FONTS.Lato_700Bold,
                  fontSize: 14,
                  color: COLORS.black,
                  textTransform: 'capitalize',
                }}>
                {loading
                  ? `${data[0].item.first_name} ${data[0].item.lastst_name}`
                  : `${data.item.first_name} ${data.item.last_name}`}
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
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.black,
                  marginRight: 25,
                }}>
                Checked in Date
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                }}>
                {data.item.checkin_date
                  ? moment(data.item.checkin_date).format('MM/DD/YYYY, hh:mm A')
                  : moment(data.item.updatedAt).format('MM/DD/YYYY, hh:mm A')}
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
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.black,
                  marginRight: 25,
                }}>
                Checked out Date
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                  textTransform: 'capitalize',
                }}>
                {data.item.checkout_date}
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
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.black,
                  marginRight: 25,
                }}>
                Email
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                  textTransform: 'capitalize',
                }}>
                {data.item.email}
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
    );
  }

  function render() {
    return (
      <View style={{ flex: 1 }}>
        <SwipeListView
          data={list}
          keyExtractor={(item: any) => `${item.id}+${item.id}`}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          rightOpenValue={-105}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onInit} />
          }
          ListEmptyComponent={
            isListLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 150,
                }}>
                <ActivityIndicator size="large" color={COLORS.blue} />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text>No data to display</Text>
              </View>
            )
          }
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {render()}
    </SafeAreaView>
  );
}
