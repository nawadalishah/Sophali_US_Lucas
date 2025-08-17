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
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

import {
  AndroidSafeArea,
  COLORS,
  dummyData,
  FONTS,
  SIZES,
} from '../../../constants';
import {
  ArrowTwo,
  BasketSvg,
  BurgerSvg,
  CrossSvg,
  DeleteSvg,
  DoughnutSvg,
  EditSvg,
  EditSvgV1,
  ElementSvg,
  FreeDeliverySvg,
  FreeFromSvg,
  GuacamoleSvg,
  MicrophoneSvg,
  PizzaSvg,
  PlusSvg,
  ProfileArrowSvg,
  PromocodeAppliedSvg,
  SmallMapPin,
  StarSvg,
  SushiSvg,
  ViewAllSvg,
} from '../../../svg';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { categoryAction } from '../../../redux/merchant/category/categoryAction';
import Modal from 'react-native-modal';
import { FormControl, Toast } from 'native-base';
import { InputField } from '../../../components';
import * as yup from 'yup';
import {
  addCategoryAction,
  editCategoryAction,
} from '../../../redux/merchant/category/addCategoryAction';
import { deleteCategoryAction } from '../../../redux/merchant/category/deleteCategoryAction';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function Order() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { categories } = useAppSelector(state => state.category);
  const userData = user;
  const [optionPickModal, setOptionPickModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState(0);

  const schema = yup.object().shape({
    category: yup.string().required('Category is required'),
  });
  const [form, setForm] = useState({
    category: '',
  });

  useEffect(() => {
    dispatch(categoryAction(userData?.userDetail));
  }, []);

  function addCategory() {
    console.log(form);
    schema
      .validate(form)
      .then(() => {
        if (form.category != '' && userData?.userDetail?.id) {
          const data = !isEditing
            ? {
                title: form.category,
                added_by: userData?.userDetail?.id,
                parent_id: userData?.userDetail?.id,
              }
            : {
                id: categoryId,
                title: form.category,
              };

          if (isEditing === true) {
            dispatch(editCategoryAction(data))
              .then(res => {
                if (res.payload) {
                  setCategoryId(0);
                  dispatch(categoryAction(userData?.userDetail));
                }
              })
              .catch(err => console.log(err));
          } else {
            dispatch(addCategoryAction(data))
              .then(res => {
                if (res.payload) {
                  dispatch(categoryAction(userData?.userDetail));
                }
              })
              .catch(err => console.log(err));
          }
          setOptionPickModal(false);

          setForm({
            category: '',
          });
        } else {
          Toast.show({
            title: 'Something went wrong',
          });
        }
      })
      .catch((err: yup.ValidationError) => {
        if (!err.path) return;
        setErrors({ [err.path]: err.message });
      });
  }

  const deleteItemFrom = (data: any) => {
    dispatch(deleteCategoryAction({ id: data.id }));
    setTimeout(() => {
      dispatch(categoryAction(userData?.userDetail));
    }, 1500);
  };

  const editItem = (data: any) => {
    setCategoryId(data.item.id);
    setForm({
      category: data.item.title,
    });
    setOptionPickModal(true);
    setIsEditing(true);
  };

  function openPopupModel() {
    setIsEditing(false);
    setOptionPickModal(true);
  }

  function renderHeader() {
    // console.log('merchant =><==' , cartData?.cartData?.CartItems[0].added_by)
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
          Categories List
        </Text>

        <TouchableOpacity
          style={{
            width: 73,
            height: 73,
            backgroundColor: COLORS.transparent,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => openPopupModel()}>
          <View
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <PlusSvg />
          </View>
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
            height: 81,
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
                Category Name
              </Text>
              <Text
                style={{
                  textTransform: 'capitalize',
                  lineHeight: 24 * 1.2,
                  color: COLORS.black,
                }}
                numberOfLines={1}>
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
          </View>
        </View>
      </Shadow>
    );
  }

  function renderHiddenItem(data: any) {
    const { item_id, cat_id } = data.item;
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
            <EditSvgV1 onPress={() => editItem({ item: data.item })} />
          </View>
          <View>
            <DeleteSvg onPress={() => deleteItemFrom(data.item)} />
          </View>
        </View>
      </View>
    );
  }

  function renderOptionModal() {
    return (
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
            }}>
            <Text
              style={{
                ...FONTS.H2,
                textTransform: 'capitalize',
                marginBottom: 10,
              }}>
              {isEditing ? 'Edit' : 'Add'} Category
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                height: 60,
                backgroundColor: COLORS.white,
              }}>
              <FormControl ml={15} mt={15} mb={5} isInvalid={!!errors.token}>
                <InputField
                  title="Category"
                  value={form.category}
                  placeholderColor={COLORS.gray}
                  // secureTextEntry={true}
                  onchange={(v: string) => {
                    setForm({ ...form, category: v });
                  }}
                  editable={isEditing}
                />
                <FormControl.ErrorMessage>
                  {errors.token}
                </FormControl.ErrorMessage>
              </FormControl>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                height: 60,
                backgroundColor: COLORS.transparent,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.green,
                  borderRadius: 50,
                  marginLeft: 130,
                  // marginHorizontal: 5,
                }}
                onPress={() => addCategory()}>
                <Text
                  style={{
                    paddingHorizontal: 36,
                    paddingVertical: 6,
                    lineHeight: 14 * 1.5,
                    color: COLORS.white,
                    fontFamily: 'Lato-Regular',
                    fontSize: 14,
                  }}>
                  {isEditing ? 'Edit' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  function renderDishes() {
    return (
      <View style={{}}>
        <SwipeListView
          data={categories?.categories?.rows}
          keyExtractor={(item: any) => `${item.id}`}
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
