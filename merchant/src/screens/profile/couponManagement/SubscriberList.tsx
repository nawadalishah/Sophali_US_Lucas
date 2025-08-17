import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Shadow } from 'react-native-shadow-2';

import { AndroidSafeArea, COLORS, FONTS } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getUserList } from '../../../redux/User/userActions';

export default function SubscriberList() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const { UserList } = useAppSelector(state => state.userList);
  const loading = useAppSelector(state => state.userList.isUserLoading);
  const [loadingState, setLoadingState] = useState<any>(false);
  const userSubscriber = UserList?.userList;

  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  useEffect(() => {
    dispatch(getUserList(userData?.userDetail));
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
          Subscriber List
        </Text>
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
                Name
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
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data.item.status}
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
    );
  }

  function renderDishes() {
    return (
      <View style={{}}>
        <SwipeListView
          data={userSubscriber}
          keyExtractor={(item: any) => `${item.id}`}
          renderItem={renderItem}
          // renderHiddenItem={renderHiddenItem}
          ListHeaderComponent={renderHeader}
          rightOpenValue={-105}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          ListEmptyComponent={
            loadingState ? (
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
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderDishes()}
      {/* {renderOptionModal()} */}
    </SafeAreaView>
  );
}
