import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Shadow } from 'react-native-shadow-2';
import { Header } from '../../../components';

import { AndroidSafeArea, COLORS, FONTS, SIZES } from '../../../constants';
import { useAppSelector } from '../../../redux/Store';
import Modal from 'react-native-modal';
import { SwipeListView } from 'react-native-swipe-list-view';
import QRCode from 'react-native-qrcode-svg';
import { axiosInstance } from '../../../config/axios';
import { Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { HEADERS } from '../../../utils/helpers';
import Styles from '../../../utils/styles/index';
export default function RoleList() {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const { merchantTokens } = useAppSelector(state => state.merchantToken);
  const userData = user;
  const [tokens, setTokens] = useState([]);
  const [newTokens, setNewTokens] = useState([]);
  const [optionPickModal, setOptionPickModal] = useState(false);
  const [loadingState, setLoadingState] = useState<any>(false);

  const permissionTab = [
    {
      id: 1,
      roleName: 'Sub Merchant',
      description: 'Sub Merchant',
      status: 'active',
    },
  ];

  useEffect(() => {
    if (userData?.userDetail?.id) {
      getRolePermissions();
    }
  }, []);

  async function getRolePermissions() {
    try {
      const res = await axiosInstance.post<any>(
        'get-role-permissions',
        {
          role_id: 4,
        },
        HEADERS,
      );
      if (res.data && res.data) {
      }
    } catch (e: any) {
      setLoadingState(false);
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setTokens(merchantTokens?.tokens);
    }, 1000);
  }, [merchantTokens]);

  useEffect(() => {
    sortTokenData(tokens);
  }, [tokens]);

  function sortTokenData(tokensData: any[]) {
    if (tokensData) {
      const arr: any = [];
      let balance = 0;
      tokensData.forEach((element: any) => {
        arr.push({
          id: element.id + element.type,
          idForDetail: element.id,
          date: element.Date,
          earn_token: element.type == 'earned' ? element.tokens : 0,
          used_token: element.type == 'consumed' ? element.tokens : 0,
          balance: (balance +=
            element.type == 'earned' ? element.tokens : -element.tokens),
        });
      });

      arr.reverse();
      setNewTokens(arr);
    }
  }

  function RenderHeader() {
    return (
      <Header
        title="Sub Merchant Management"
        goBack={true}
        onPress={() => navigation.goBack()}
      />
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
          key={data.item.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            width: '100%',
            // height: 180,
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
                Role Name
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data.item.roleName}
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
                Description
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data.item.description}
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
                Status
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
            {/* <View
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
                Actions
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.green,
                  borderRadius: 50,
                  marginLeft: 10,
                }}
                // onPress={() => openPopupModel()}
              >
                <Text
                  style={{
                    paddingHorizontal: 25,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.5,
                    color: COLORS.white,
                    fontFamily: 'Lato-Regular',
                    fontSize: 14,
                  }}
                  onPress={() => setOptionPickModal(true)}>
                  Permission
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Shadow>
    );
  }

  const RenderORModal = () => (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 2,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
      }}
      showsVerticalScrollIndicator={true}>
      <Modal
        isVisible={optionPickModal}
        onBackdropPress={() => setOptionPickModal(false)}
        hideModalContentWhileAnimating={true}
        backdropTransitionOutTiming={0}
        style={{ margin: 0 }}>
        <View
          style={{
            backgroundColor: COLORS.lightBlue,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            width: SIZES.width,
            bottom: 0,
            paddingHorizontal: 12,
            paddingVertical: 30,
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...FONTS.H2,
              textTransform: 'capitalize',
              marginBottom: 10,
            }}>
            QR Code
          </Text>
          <QRCode value={`sophali-user=${userData?.userDetail.id}`} />
        </View>
      </Modal>
    </ScrollView>
  );

  function renderDishes() {
    return (
      <View style={[Styles.w100]}>
        <RenderHeader />
        <SwipeListView
          data={permissionTab}
          keyExtractor={(item: any) => `${item.id}`}
          renderItem={renderItem}
          // ListHeaderComponent={RenderHeader}
          rightOpenValue={-105}
          contentContainerStyle={{
            paddingBottom: 40,
            ...Styles.pH15,
            // paddingHorizontal: 16,/
          }}
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderDishes()}
      {/* {RenderORModal()} */}
    </SafeAreaView>
  );
}
