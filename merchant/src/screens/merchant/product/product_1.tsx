import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  CommonActions,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

import { AndroidSafeArea, COLORS, FONTS, SIZES } from '../../../constants';
import { CrossSvg, DeleteSvg, EditSvgV1, ProfileArrowSvg } from '../../../svg';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import Modal from 'react-native-modal';
import { Toast } from 'native-base';
import { Button } from '../../../components';
import * as yup from 'yup';
import { productAction } from '../../../redux/merchant/product/productAction';
import { AppConfig } from '../../../config';
import { SwipeListView } from 'react-native-swipe-list-view';
import { axiosInstance } from '../../../config/axios';
import { Header } from '../../../components';
import { scaleSize } from '../../../utils/mixins';
import { HEADERS } from '../../../utils/helpers';
import { DeleteIcon, EditIcon } from '../../../utils/icons';
import Styles from '../../../utils/styles';

export default function ProductI({ isCategoryExist }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { products } = useAppSelector(state => state.product);
  const loading = useAppSelector(state => state.product.isProductLoading);
  const userData = user;
  const [optionPickModal, setOptionPickModal] = useState(false);

  const merchantProducts = products?.products;

  useEffect(() => {
    if (isFocused) {
      dispatch(productAction({ data: userData?.userDetail }));
    }
  }, [isFocused]);

  const deleteItemFrom = async (data: any) => {
    try {
      Alert.alert('Confirm Deletion', 'Are you sure?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            console.log('data.product', data.product.id);
            const res = await axiosInstance.post<any>(
              'product/delete',
              {
                id: data.product.id,
              },
              HEADERS,
            );
            Toast.show({
              title: 'Product Deleted',
            });

            if (res.data) {
              setTimeout(() => {
                dispatch(productAction({ data: userData?.userDetail }));
              }, 700);
            }
            return res.data;
          },
        },
      ]);
    } catch (e: any) {
      console.log(JSON.stringify(e));
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const editItem = (data: any) => {
    console.log('product', data);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddProduct',
        params: { productId: data.product.id, Title: 'Edit' },
      }),
    );
  };

  function NavigateToDetail(product: any) {
    console.log('product =>>', product);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ProductDetail',
        params: { product: product },
      }),
    );
  }

  function renderHeader() {
    return (
      <>
        <View style={{ paddingHorizontal: 16 }}>
          <Header
            goBack={false}
            title="Products"
            titleStyle={{ textAlign: 'left' }}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 20,
          }}>
          <Button
            title={'Add Product'}
            containerStyle={{
              height: scaleSize(40),
              opacity: isCategoryExist ? 1 : 0.6,
            }}
            textStyle={{ textTransform: 'capitalize' }}
            onPress={() => {
              if (isCategoryExist) {
                navigation.navigate('AddProduct' as never);
              } else {
                Toast.show({ title: 'Kindly add at least one category' });
              }
            }}
          />
        </View>
      </>
    );
  }

  function renderItem(data: any) {
    const { uuids, title, ProductSize, price } = data.item;
    let imageUrl = '';
    if (uuids) {
      imageUrl = `${AppConfig.BaseUrl}getFileById?uuid=${JSON.parse(uuids)}`;
    }

    return (
      <Shadow
        offset={[0, 0]}
        distance={15}
        startColor={'rgba(6, 38, 100, 0.04)'}
        //@ts-ignore
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
            padding: 8,
          }}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: 73,
                height: 73,
                borderRadius: 20,
                marginRight: 8,
              }}
            />
          )}
          <View style={{ flex: 1, marginVertical: 12 }}>
            <Text
              style={{
                ...FONTS.Lato_700Bold,
                fontSize: 14,
                color: COLORS.black,
              }}>
              {title}
            </Text>
            {ProductSize?.length > 0 ? (
              <>
                {ProductSize?.slice(0, 2).map((item: any, index: any) => (
                  <Text
                    key={index}
                    style={{
                      ...FONTS.Lato_400Regular,
                      fontSize: 14,
                      color: COLORS.gray,
                    }}>
                    {`${item.scale_name} - $${item.price.toFixed(2)}`}
                  </Text>
                ))}
                {ProductSize?.length > 2 && (
                  <Text
                    style={{
                      ...FONTS.Lato_400Regular,
                      fontSize: 14,
                      color: COLORS.gray,
                      fontStyle: 'italic',
                    }}>
                    ...and more
                  </Text>
                )}
              </>
            ) : (
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                }}>
                ${price.toFixed(2)}
              </Text>
            )}
            <RowView
              label="View"
              value={
                <TouchableOpacity onPress={() => NavigateToDetail(data.item)}>
                  <ProfileArrowSvg />
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </Shadow>
    );
  }

  const RowView = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
      }}>
      <Text
        style={{
          ...FONTS.Lato_400Regular,
          fontSize: 14,
          color: COLORS.gray,
          marginRight: 25,
        }}>
        {label}
      </Text>
      {value}
    </View>
  );

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
          <Text
            style={{
              ...FONTS.H2,
              textTransform: 'capitalize',
              marginBottom: 10,
            }}>
            Select Options
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              width: '100%',
              height: 81,
              backgroundColor: COLORS.white,
              borderRadius: 20,
            }}>
            {/* <Picker
              style={{
                width: '100%',
                height: 73,
                borderRadius: 20,
                marginLeft: 4,
              }}
              selectedValue={selectedPickValue}
              onValueChange={(itemValue, itemIndex) => setOptionPickModalData(itemValue)
              }>
              {items.map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
              ))}
            </Picker> */}
          </View>

          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              padding: 16,
            }}
            onPress={() => setOptionPickModal(false)}>
            <CrossSvg />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  function renderHiddenItem(data: any) {
    const { item } = data;
    return (
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          ...Styles.flexDirectionRow,
          width: '100%',
          height: '100%',
          ...Styles.pT10,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => editItem({ product: item })}
          style={[Styles.mR10]}>
          <EditIcon onPress={() => editItem({ product: item })} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => deleteItemFrom({ product: item })}>
          <DeleteIcon onPress={() => deleteItemFrom({ product: item })} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderDishes() {
    return (
      <View style={{ flex: 1 }}>
        <SwipeListView
          data={merchantProducts}
          keyExtractor={(item: any) => `${item.id}+${item.id}`}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          ListHeaderComponent={renderHeader}
          rightOpenValue={-90}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
          ListEmptyComponent={
            loading ? (
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
