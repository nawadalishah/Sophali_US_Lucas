import {
  FlatList,
  Image,
  ImageBackground,
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

import { COLORS, dummyData, FONTS, SIZES } from '../../../constants';
import {
  BurgerSvg,
  DoughnutSvg,
  ElementSvg,
  FreeDeliverySvg,
  FreeFromSvg,
  GuacamoleSvg,
  MicrophoneSvg,
  PizzaSvg,
  PlusSvg,
  ProfileArrowSvg,
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
import { addCategoryAction } from '../../../redux/merchant/category/addCategoryAction';
import { productAction } from '../../../redux/merchant/product/productAction';
import { AppConfig } from '../../../config';

export default function Product() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { products } = useAppSelector(state => state.product);
  const userData = user;
  const [category, setCategory] = useState('Burger');
  const [optionPickModal, setOptionPickModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const schema = yup.object().shape({
    category: yup.string().required('Category is required'),
  });
  const [form, setForm] = useState({
    category: '',
  });

  useEffect(() => {
    dispatch(productAction({ data: userData?.userDetail }));
  }, []);

  function addCategory() {
    schema
      .validate(form)
      .then(() => {
        if (form.category != '' && userData?.userDetail?.id) {
          const data = {
            title: form.category,
            added_by: userData?.userDetail?.id,
            parent_id: userData?.userDetail?.parent_id,
          };

          dispatch(addCategoryAction(data))
            .then(res => {
              if (res.payload) {
                dispatch(categoryAction(userData?.userDetail));
              }
            })
            .catch(err => console.log(err));
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

  function renderHeader() {
    return (
      <ImageBackground
        source={{
          uri: 'http://res.cloudinary.com/simpleview/image/upload/v1640823092/clients/orlandofl/185683_entrees_667152ec-7340-4428-91e7-72265329d7d0.jpg',
        }}
        style={{
          height: 180,
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        imageStyle={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <View
          style={{
            width: '100%',
            height: 50,
            backgroundColor: COLORS.white,
            borderRadius: 25,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Search for a product..."
          />
          <TouchableOpacity style={{ paddingLeft: 15 }}>
            <MicrophoneSvg />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  function renderPopularRestaurants() {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text style={{ ...FONTS.H2, marginBottom: 8, color: COLORS.black }}>
            Product List
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
            // onPress={() => setOptionPickModal(true)}
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
          </TouchableOpacity>
        </View>
        {products?.products?.rows?.map((item: any, index: any) => (
          <View key={index}>
            <Shadow
              offset={[0, 0]}
              distance={10}
              startColor={'rgba(6, 38, 100, 0.04)'}
              // @ts-ignore
              finalColor={'rgba(6, 38, 100, 0.0)'}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 90,
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginLeft: 20,
                    marginVertical: 10,
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      // marginTop: 15
                    }}>
                    <Text
                      style={{
                        ...FONTS.H4,
                        textTransform: 'capitalize',
                        lineHeight: 24 * 1.2,
                        color: COLORS.black,
                      }}
                      numberOfLines={1}>
                      Title
                    </Text>
                    <Text
                      style={{
                        textTransform: 'capitalize',
                        lineHeight: 24 * 1.2,
                        color: COLORS.black,
                      }}
                      numberOfLines={1}>
                      {item.title}
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
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View style={{ paddingRight: 16 }}>
                  {/* <ProfileArrowSvg/> */}
                </View>
              </TouchableOpacity>
            </Shadow>
          </View>
        ))}
      </View>
    );
  }

  //   function renderPopularRestaurants() {
  //     return (
  //         <View style={{paddingHorizontal: 16}}>
  //             <Text style={{...FONTS.H2, marginBottom: 8, color: COLORS.black}}>
  //                 Products
  //             </Text>
  //             {products?.products?.rows.map((item:any, index:any) => {

  //                 return (
  //                     <View key={index}>
  //                         <Shadow
  //                             offset={[0, 0]}
  //                             distance={10}
  //                             startColor={'rgba(6, 38, 100, 0.04)'}
  //                             // @ts-ignore
  //                             finalColor={'rgba(6, 38, 100, 0.0)'}>
  //                             <TouchableOpacity
  //                                 style={{
  //                                     width: '100%',
  //                                     height: 140,
  //                                     backgroundColor: COLORS.white,
  //                                     borderRadius: 20,
  //                                     marginBottom: 8,
  //                                     flexDirection: 'row',
  //                                     alignItems: 'center',
  //                                 }}
  //                                 onPress={() =>
  //                                     // @ts-ignore
  //                                     navigation.navigate('RestaurantMenu', {
  //                                         restaurant: item,
  //                                     })
  //                                 }>
  //                                 <ImageBackground
  //                                     source={{uri:`${AppConfig.BaseUrl}`+JSON.parse(item.uuids)}}
  //                                     style={{width: 142, height: '100%'}}
  //                                     imageStyle={{
  //                                         borderTopLeftRadius: 20,
  //                                         borderBottomLeftRadius: 20,
  //                                     }}>
  //                                     {/* <View
  //                                         style={{
  //                                             height: 26,
  //                                             backgroundColor: COLORS.carrot,
  //                                             alignSelf: 'flex-start',
  //                                             paddingHorizontal: 13,
  //                                             borderRadius: 20,
  //                                             right: -10,
  //                                             top: 10,
  //                                             flexDirection: 'row',
  //                                             alignItems: 'center',
  //                                         }}>
  //                                         <StarSvg/>
  //                                         <Text
  //                                             style={{
  //                                                 fontSize: 12,
  //                                                 fontFamily: 'Lato-Regular',
  //                                                 color: COLORS.white,
  //                                                 marginLeft: 6,
  //                                             }}>
  //                                             {item.rating}
  //                                         </Text>
  //                                     </View> */}
  //                                     <View
  //                                         style={{
  //                                             position: 'absolute',
  //                                             right: 0,
  //                                         }}>
  //                                         <ElementSvg/>
  //                                     </View>
  //                                 </ImageBackground>
  //                                 <View
  //                                     style={{
  //                                         marginLeft: 20,
  //                                         marginVertical: 20,
  //                                         flex: 1,
  //                                     }}>
  //                                     <Text
  //                                         style={{
  //                                             ...FONTS.H4,
  //                                             textTransform: 'capitalize',
  //                                             lineHeight: 24 * 1.2,
  //                                             color: COLORS.black,
  //                                         }}
  //                                         numberOfLines={1}>
  //                                         {item.company_name}
  //                                     </Text>
  //                                     <Text
  //                                         style={{
  //                                             color: COLORS.gray,
  //                                             fontFamily: 'Lato-Regular',
  //                                             fontSize: 14,
  //                                             marginBottom: 8,
  //                                         }}>
  //                                         {item.status}
  //                                     </Text>
  //                                     <View
  //                                         style={{
  //                                             flexDirection: 'row',
  //                                             alignItems: 'center',
  //                                         }}>
  //                                         {/* <SmallMapPin/> */}
  //                                         <Text
  //                                             style={{
  //                                                 marginLeft: 8,
  //                                                 fontFamily: 'Lato-Regular',
  //                                                 fontSize: 14,
  //                                                 color: COLORS.black,
  //                                                 marginBottom: 2,
  //                                             }}>
  //                                             {item.city}
  //                                         </Text>
  //                                     </View>
  //                                     {/* {item.createdAt && <FreeDeliverySvg/>} */}
  //                                     {!item.createdAt && item.createdAt && (
  //                                         <View
  //                                             style={{
  //                                                 flexDirection: 'row',
  //                                                 alignItems: 'center',
  //                                             }}>
  //                                             <FreeFromSvg/>
  //                                             <Text
  //                                                 style={{
  //                                                     ...FONTS.Lato_400Regular,
  //                                                     fontSize: 14,
  //                                                     color: COLORS.black,
  //                                                 }}>
  //                                                 {' '}
  //                                                 ${item.createdAt}
  //                                             </Text>
  //                                         </View>
  //                                     )}
  //                                 </View>
  //                                 <View style={{paddingRight: 16}}>
  //                                     <ProfileArrowSvg/>
  //                                 </View>
  //                             </TouchableOpacity>
  //                         </Shadow>
  //                     </View>
  //                 );
  //             })}
  //         </View>
  //     );
  // }
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
              Add Category
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
                  placeholderColor={COLORS.gray}
                  // secureTextEntry={true}
                  onchange={(v: string) => {
                    setForm({ ...form, category: v });
                  }}
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
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {renderHeader()}
        {renderPopularRestaurants()}
        {renderOptionModal()}
      </ScrollView>
    </View>
  );
}
