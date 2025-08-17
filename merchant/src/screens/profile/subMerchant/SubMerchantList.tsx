import {
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  AndroidSafeArea,
  COLORS,
  FONTS,
  SIZES,
  Text,
} from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import Modal from 'react-native-modal';
import { Spinner, Toast } from 'native-base';
import { Button, Header } from '../../../components';
import { SwipeListView } from 'react-native-swipe-list-view';
import { axiosInstance } from '../../../config/axios';
import { HEADERS } from '../../../utils/helpers';
import { MOBILE } from '../../../utils/orientation';
import Styles from '../../../utils/styles';
import { scaleSize } from '../../../utils/mixins';
import { DeleteIcon, EditIcon } from '../../../utils/icons';

export default function SubMerchant() {
  const [loadingState, setLoadingState] = useState(false);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { userList } = useAppSelector(state => state.subMerchantList);
  const loading = useAppSelector(state => state.subMerchantList.loadingList);
  const userData = user;
  const [list, setList] = useState();
  const [optionPickModal, setOptionPickModal] = useState(false);
  const [refresh, setOnRefresh] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [subMerchantId, setSubMerchantId] = useState<any>(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (userData?.userDetail.id) {
      const payload = {
        UserTypeId: 4,
        parent_id: userData?.userDetail.id,
      };
      getSubMerchantList(payload);
    }
  }, [isFocused, userData]);

  async function getSubMerchantList(data: any) {
    if (data && data.parent_id) {
      setIsListLoading(true);
      try {
        const res = await axiosInstance.post<any>(
          '/sub-merchants',
          data,
          HEADERS,
        );
        if (res.data && res.data.users) {
          setIsListLoading(false);
          setList(res.data?.users);
        }
        setIsListLoading(false);

        return res.data;
      } catch (e: any) {
        setIsListLoading(false);
      }
    }
  }

  const deleteItemFrom = async (data: any) => {
    try {
      const res = await axiosInstance.post<any>(
        'sub-merchants/delete',
        {
          id: subMerchantId,
        },
        HEADERS,
      );

      if (res.data) {
        const payload = {
          UserTypeId: 4,
          parent_id: userData?.userDetail.id,
        };
        getSubMerchantList(payload);
        setOptionPickModal(false);
        Toast.show({
          title: 'Sub Merchant deleted',
        });
      }
      return res.data;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const onRefresh = useCallback(() => {
    setOnRefresh(true);
    const payload = {
      UserTypeId: 4,
      parent_id: userData?.userDetail.id,
    };
    getSubMerchantList(payload);
    setOnRefresh(false);
  }, [userData, refresh]);

  function deleteItem(data: any) {
    setSubMerchantId(data.id);
    setOptionPickModal(true);
  }

  useEffect(() => {
    setList(userList?.users.rows);
  }, [userList?.users.rows]);

  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  const editItem = (data: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditSubMerchant',
        params: { subMerchant: data.subMerchant },
      }),
    );
  };

  function RenderHeader() {
    return (
      <View
        style={{
          ...Styles.w100,
        }}>
        <Header
          title="Administration Rights"
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            ...Styles.w100,
            alignItems: 'flex-end',
            ...Styles.pH15,
            ...Styles.pB10,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: COLORS.green,
              borderRadius: scaleSize(20),
              width: scaleSize(100),
              height: scaleSize(30),
              ...Styles.alignItemsCenter,
              ...Styles.justifyContentCenter,
              ...Styles.pH10,
            }}
            onPress={() => navigation.navigate('AddSubMerchant' as never)}>
            <Text color={COLORS.white} size={MOBILE.textSize.normal}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderItem({ item }) {
    return (
      <View
        style={[
          Styles.mT10,
          Styles.w100,
          Styles.primaryBackground,
          { elevation: 2.5, borderRadius: scaleSize(5) },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: scaleSize(8),
            width: '100%',
            backgroundColor: COLORS.white,
            borderRadius: scaleSize(5),
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
                ...Styles.pV5,
              }}>
              <Text
                style={{
                  ...FONTS.Lato_700Bold,
                  fontSize: MOBILE.textSize.normal,
                  color: COLORS.black,
                  marginRight: 25,
                }}>
                Username
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: MOBILE.textSize.normal,
                  color: COLORS.gray,
                }}>
                {item?.username}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...Styles.pV5,
              }}>
              <Text
                style={{
                  ...FONTS.Lato_700Bold,
                  fontSize: MOBILE.textSize.normal,
                  color: COLORS.black,
                  marginRight: 25,
                }}>
                Email
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: MOBILE.textSize.normal,
                  color: COLORS.gray,
                }}>
                {item?.email}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...Styles.pV5,
              }}>
              <Text
                style={{
                  ...FONTS.Lato_700Bold,
                  fontSize: MOBILE.textSize.normal,
                  color: COLORS.black,
                  marginRight: 25,
                }}>
                Status
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: MOBILE.textSize.normal,
                  color: COLORS.gray,
                }}>
                {item?.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  function renderOptionModal() {
    return (
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
            ...Styles.pV25,
            ...Styles.pH15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{
                ...FONTS.Lato_700Bold,
                fontSize: MOBILE.textSize.large,
                color: COLORS.gray,
              }}>
              Are you sure to delete this Sub Merchant?
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
              ...Styles.pV10,
            }}>
            <Button
              title="Delete"
              containerStyle={{
                width: 130,
                height: 30,
                backgroundColor: COLORS.carrot,
              }}
              textStyle={{
                paddingVertical: 6,
                lineHeight: 11 * 1.5,
                color: COLORS.white,
                fontSize: MOBILE.textSize.normal,
              }}
              onPress={deleteItemFrom}
            />
            <Button
              title="Cancel"
              containerStyle={{
                width: 130,
                height: 30,
                backgroundColor: COLORS.green,
              }}
              textStyle={{
                paddingVertical: 6,
                lineHeight: 11 * 1.5,
                color: COLORS.white,
                fontSize: MOBILE.textSize.normal,
              }}
              onPress={() => setOptionPickModal(false)}
            />
          </View>
        </View>
      </Modal>
    );
  }

  function renderHiddenItem(data: any) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: COLORS.transparent,
          ...Styles.pV20,
          height: scaleSize(130),
          ...Styles.flexDirectionRow,
        }}>
        <View
          style={[
            [
              Styles.flexDirectionRow,
              Styles.alignItemsCenter,
              Styles.justifyContentSpaceBetween,
              { width: '15%' },
            ],
          ]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => editItem({ subMerchant: data.item })}>
            <EditIcon
              size={MOBILE.iconSize.common}
              onPress={() => editItem({ subMerchant: data.item })}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => deleteItem(data.item)}>
            <DeleteIcon
              size={MOBILE.iconSize.mmLarge}
              onPress={() => deleteItem(data.item)}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderDishes() {
    return (
      <View style={[Styles.flex, Styles.w100, Styles.primaryBackground]}>
        <RenderHeader />
        <SwipeListView
          data={list}
          keyExtractor={(item: any) => `${item.id}+${item.id}`}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-105}
          contentContainerStyle={{
            ...Styles.pH15,
            ...Styles.pB30,
            ...Styles.primaryBackground,
          }}
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            isListLoading ? (
              <View style={[Styles.Centered, Styles.emptyComponent]}>
                <Spinner />
              </View>
            ) : (
              <View style={(Styles.Centered, Styles.emptyComponent)}>
                <Text color={COLORS.gray} size={MOBILE.textSize.medium}>
                  Sub Merchants not found yet
                </Text>
              </View>
            )
          }
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderDishes()}
      {renderOptionModal()}
    </SafeAreaView>
  );
}
