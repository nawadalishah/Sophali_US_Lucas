import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

import {
  AndroidSafeArea,
  COLORS,
  dummyData,
  FONTS,
  SIZES,
} from '../../../constants';
import { DeleteSvg, EditSvgV1 } from '../../../svg';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import Modal from 'react-native-modal';
import { Toast } from 'native-base';
import { Button } from '../../../components';
import { AppConfig } from '../../../config';
import { SwipeListView } from 'react-native-swipe-list-view';
import { axiosInstance } from '../../../config/axios';
import { HEADERS } from '../../../utils/helpers';

export default function AddOnsList() {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [optionPickModal, setOptionPickModal] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [addOnsListData, setAddOnsList] = useState([]);

  const [addOnId, setAddOnId] = useState<any>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (userData?.userDetail?.id) {
      getAddOnList(userData?.userDetail?.id);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      getAddOnList(userData?.userDetail?.id ? userData?.userDetail?.id : null);
    }
  }, [isFocused]);

  async function getAddOnList(id: number | null) {
    if (id) {
      console.log('get called');
      setIsListLoading(true);
      try {
        const res = await axiosInstance.get<any>(`addons/list?added_by=${id}`);
        if (res.data && res.data?.addons && res.data?.addons?.rows) {
          console.log('res.data ==', res.data);
          setIsListLoading(false);
          setAddOnsList(res.data?.addons?.rows);
        }
      } catch (e: any) {
        setIsListLoading(false);
        Toast.show({
          title: e?.response?.data?.message || 'Unable to get add ons list',
        });
      }
    }
  }

  const deleteItemFrom = async (data: any) => {
    setIsListLoading(true);
    try {
      const res = await axiosInstance.post<any>(
        'product/delete',
        {
          id: addOnId,
        },
        HEADERS,
      );
      Toast.show({
        title: 'Delete add on successfully',
      });

      if (res.data) {
        setTimeout(() => {
          setIsListLoading(false);
          getAddOnList(userData?.userDetail?.id || null);
        }, 700);
      }
    } catch (e: any) {
      console.log(JSON.stringify(e));
      setIsListLoading(false);
      Toast.show({
        title: e?.response?.data?.message || 'Unable to delete add on',
      });
    }
  };

  const editItem = (data: any) => {
    // setAddOnsList([])
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditAddOn',
        params: { addOn: data.addOn },
      }),
    );
  };

  function setDeleteItemData(data: any) {
    setAddOnId(data.id);
    setOptionPickModal(true);
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
          // marginLeft: 160,
        }}>
        <Text style={{ marginBottom: 20, ...FONTS.H2 }}>Addons List</Text>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.green,
            borderRadius: 50,
            marginBottom: 20,
            // marginHorizontal: 5,
          }}
          onPress={() => navigation.navigate('AddAddOns' as never)}>
          <Text
            style={{
              paddingHorizontal: 36,
              paddingVertical: 6,
              lineHeight: 14 * 1.5,
              color: COLORS.white,
              fontFamily: 'Lato-Regular',
              fontSize: 14,
            }}>
            Add Addons
          </Text>
        </TouchableOpacity>
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
          <Image
            source={{
              uri: `${AppConfig.BaseUrl}getFileById?uuid=${JSON.parse(
                data.item.photo,
              )}`,
            }}
            style={{
              width: 73,
              height: 73,
              borderRadius: 20,
              marginLeft: 4,
            }}
          />
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
                }}>
                {data.item.title}
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
                  color: COLORS.gray,
                  marginRight: 25,
                }}>
                Title
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                }}>
                {data.item.title}
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
                  color: COLORS.gray,
                  marginRight: 25,
                }}>
                Price
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                }}>
                C${data.item.price}
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
                  color: COLORS.gray,
                  marginRight: 25,
                }}>
                Status
              </Text>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                  textTransform: 'capitalize',
                }}>
                {data.item.status}
              </Text>
            </View>
          </View>
        </View>
      </Shadow>
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
            paddingHorizontal: 16,
            paddingVertical: 30,
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
                fontSize: 19,
                color: COLORS.gray,
                marginRight: 25,
              }}>
              Are You sure to delete this Add On?
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginBottom: 8,
              width: '100%',
              height: 81,
              backgroundColor: COLORS.white,
              borderRadius: 20,
            }}>
            <Button
              title="Delete"
              containerStyle={{
                marginBottom: 20,
                width: 130,
                height: 30,
                backgroundColor: COLORS.carrot,
              }}
              textStyle={{
                paddingHorizontal: 36,
                paddingVertical: 6,
                lineHeight: 11 * 1.5,
                color: COLORS.white,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}
              onPress={deleteItemFrom}
            />
            <Button
              title="Cancel"
              containerStyle={{
                marginBottom: 20,
                width: 130,
                height: 30,
                backgroundColor: COLORS.green,
              }}
              textStyle={{
                paddingHorizontal: 36,
                paddingVertical: 6,
                lineHeight: 11 * 1.5,
                color: COLORS.white,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
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
          alignSelf: 'flex-end',
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: COLORS.transparent,
          height: 81,
          width: 250,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          paddingRight: 15,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ marginRight: 15, marginTop: 7 }}>
            <EditSvgV1 onPress={() => editItem({ addOn: data.item })} />
          </View>
          <View>
            <DeleteSvg onPress={() => setDeleteItemData(data.item)} />
          </View>
        </View>
      </View>
    );
  }

  function renderDishes() {
    return (
      <View style={{ flex: 1 }}>
        <SwipeListView
          data={addOnsListData}
          keyExtractor={(item: any) => `${item.id}+${item.id}`}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          ListHeaderComponent={renderHeader}
          rightOpenValue={-105}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
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
      {renderDishes()}
      {renderOptionModal()}
    </SafeAreaView>
  );
}
