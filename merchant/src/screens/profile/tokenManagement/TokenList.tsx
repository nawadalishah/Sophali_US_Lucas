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
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

import {
  AndroidSafeArea,
  COLORS,
  dummyData,
  FONTS,
  SIZES,
} from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import Modal from 'react-native-modal';
import * as yup from 'yup';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getMerchantTokens } from '../../../redux/merchant/token/tokenActions';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';

export default function TokenList() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { merchantTokens } = useAppSelector(state => state.merchantToken);
  const userData = user;
  const [tokens, setTokens] = useState([]);
  const [newTokens, setNewTokens] = useState([]);
  const [optionPickModal, setOptionPickModal] = useState(false);

  const schema = yup.object().shape({
    category: yup.string().required('Category is required'),
  });

  const [form, setForm] = useState({
    category: '',
  });

  useEffect(() => {
    dispatch(getMerchantTokens(userData?.userDetail?.id));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTokens(merchantTokens?.merchantEarnedToken);
    }, 1000);
  }, [merchantTokens]);

  useEffect(() => {
    sortTokenData(tokens);
  }, [tokens]);

  function sortTokenData(tokensData: any[]) {
    if (tokensData) {
      const arr: any = [];
      const balance = 0;
      tokensData.forEach((element: any) => {
        arr.push({
          id: element.id,
          date: element.createdAt,
          sophali_fee: element.sophali_fee,
          amount_cad: element.amount_cad,
          status: element.status,
        });
      });

      arr.reverse();
      setNewTokens(arr);
    }
  }

  function convertDate(date: string) {
    if (date) {
      return moment(date).format('MMM Do YYYY');
    }
  }

  function convertTime(date: string) {
    if (date) {
      const newDate = moment(date);

      const formattedTime = newDate.format('hh:mm A');
      return formattedTime;
    }
  }

  function screenNavigator() {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'WithdrawToken',
      }),
    );
  }

  function renderHeader() {
    return (
      <ScrollView
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}>
        <View
          key={1232121}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // marginTop: 10,
            // marginBottom: 5
          }}>
          <Text style={{ ...FONTS.H3, marginBottom: 8, color: COLORS.black }}>
            Merchant Tokens
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.blue,
              borderRadius: 50,
              marginLeft: 10,
            }}
            // onPress={() => openPopupModel()}
          >
            <Text
              style={{
                paddingHorizontal: 26,
                paddingVertical: 6,
                lineHeight: 14 * 1.5,
                color: COLORS.white,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}
              onPress={() => screenNavigator()}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
            height: 220,
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
                Date
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {new Date(data.item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
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
                Sophali Tokens
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data.item.amount_cad ? data.item.amount_cad : 0}
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
                Amount in USD
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data.item.amount_cad ? data.item.amount_cad : 0}
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
                Sophali Fee
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
                {data.item.sophali_fee ? data.item.sophali_fee : 0}
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
                QR Code
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
                  View
                </Text>
              </TouchableOpacity>
            </View>
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
      <View style={{}}>
        <SwipeListView
          data={newTokens}
          keyExtractor={(item: any) => `${item.id}`}
          renderItem={renderItem}
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
      {renderDishes()}
      {RenderORModal()}
    </SafeAreaView>
  );
}
