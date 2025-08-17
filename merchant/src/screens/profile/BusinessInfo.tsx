import {
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
// import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { Shadow } from 'react-native-shadow-2';
// @ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Slideshow from 'react-native-image-slider-show';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Center, Flex, Select, Spinner, Switch, Toast } from 'native-base';
import { AndroidSafeArea, COLORS, Text } from '../../constants';
import { Button, Header, InputField } from '../../components';
import {
  ArrowSvg,
  CheckSvgch,
  EditSvg,
  FacebookSvg,
  MailSvg,
  MapPinSvg,
  MapPinTwoSvg,
  PhoneSvg,
  PlaceSvg,
  TwitterSvg,
} from '../../svg';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { axiosInstance } from '../../config/axios';
import { LocalSvg } from 'react-native-svg';
import { AppConfig } from '../../config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { HEADERS } from '../../utils/helpers';
import { scaleSize } from '../../utils/mixins';
import Styles from '../../utils/styles';
import {
  deleteImage,
  getMerchantSetting,
  pickImage,
  saveMerchantSetting,
} from './helper';
import { generateRandomId } from '../../utils';
import { MOBILE, deviceHeight } from '../../utils/orientation';
import { CloseIcon } from '../../utils/icons';
import PopUpModal from '../../components/PopUpModal';

export default function BusinessInfo() {
  const navigation = useNavigation();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [BusinessInfoRecord, setBusinessInfoRecord] = useState<any>({});
  const [form, setForm] = useState({
    business_address: '',
    business_category: '',
    business_name: '',
    contact_number: '',
    user_id: '',
  });
  const dispatch = useAppDispatch();
  const [businessInfo, setBusinessInfo] = useState<any>({});
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [merchantDetails, setMerchantDetails] = useState(null);
  const [merchantSetting, setMerchantSetting] = useState(null);

  const [favorite, setFavorite] = useState('Business Info');
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingLoading, setIsSavingLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    userData?.userDetail?.company_logo,
  );
  const [image, setImage] = useState('');
  const [newProfileImage, setnewProfileImage] = useState<any>('');
  const [description, setDescription] = useState('');
  const [imageCollections, setImageCollections] = useState([]);
  const [descriptionModel, setDescriptionModel] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getBusinessInfo();
    getMerchantList();
    getMerchantSetting(
      userData?.userDetail?.id,
      setMerchantSetting,
      setImageCollections,
      setDescription,
    );
  }, [userData]);

  const getMerchantList = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get<any>(
        `merchants/info?id=${userData?.userDetail?.id}`,
      );
      if (res.data && res.data?.merchants) {
        setIsLoading(false);
        setMerchantDetails(res?.data?.merchants);
        setProfileImage(res?.data?.merchants?.company_logo);
      } else {
        setIsLoading(false);
      }
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message
          ? e?.response?.data?.message
          : 'Cannot get merchant info',
      });
    }
  };
  async function getBusinessInfo() {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get<any>(
        `userInfo/get-business-info?user_id=${userData?.userDetail?.id}`,
      );
      if (res.data && res.data) {
        setIsLoading(false);
        setBusinessInfo(res.data);
      } else {
        setIsLoading(false);
      }
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message
          ? e?.response?.data?.message
          : 'Cannot get business info',
      });
    }
  }

  useEffect(() => {
    if (businessInfo && businessInfo.businessInfo) {
      setBusinessInfoRecord(businessInfo.businessInfo);
    }
  }, [businessInfo]);

  useEffect(() => {
    if (BusinessInfoRecord) {
      if (BusinessInfoRecord) {
        const category = categoryRecords.find((x: any) => {
          if (x.value == BusinessInfoRecord.business_category) {
            return x.value;
          }
        });
        setSelectedCategory(category?.id ? category?.id : '');
        setForm({
          business_address: BusinessInfoRecord.business_address,
          business_category: BusinessInfoRecord.business_category,
          business_name: BusinessInfoRecord.business_name,
          contact_number: BusinessInfoRecord.contact_number,
          user_id: BusinessInfoRecord.user_id,
        });
      }
    }
  }, [BusinessInfoRecord]);

  const handleSwitchToggle = (newValue: any) => {
    setIsSwitchOn(newValue);
  };

  const selectImage = async () => {
    // No permissions request is necessary for launching the image library
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.assets[0].uri) return;

    setImage(result.assets[0].uri);
    try {
      const res = await FileSystem.uploadAsync(
        `${AppConfig.BaseUrl}upload`,
        result.assets[0].uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'Files',
        },
      );
      Toast.show({
        title: 'logo upload successfully',
      });
      const { data: imageUpload } = JSON.parse(res.body);
      setnewProfileImage(imageUpload);
      return res.body;
    } catch (e: any) {
      console.log(JSON.stringify(e), e.message);
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  };
  useEffect(() => {
    if (newProfileImage && newProfileImage.length) {
      UpdateProfilePic();
    }
  }, [newProfileImage]);
  const UpdateProfilePic = async () => {
    const body = {
      company_logo: newProfileImage,
      id: userData?.userDetail?.id,
    };
    // console.log(user);
    try {
      const res = await axiosInstance.post<any>('users/update', body, HEADERS);
      if (res.data && res.data.company_logo) {
        setProfileImage(res.data.company_logo);
        userData?.userDetail?.company_logo === res.data.company_logo;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const gotoFacebook = () => {
    Linking.openURL('http://147.182.145.249:5000/');
  };
  const gotoInstagram = () => {
    Linking.openURL('http://147.182.145.249:5000/');
  };
  const gotoTwitter = () => {
    Linking.openURL('http://147.182.145.249:5000/');
  };

  const categoryRecords = [
    { id: 1, value: 'restaurant', title: 'Restaurant' },
    { id: 2, value: 'fast_food', title: 'Fast Food' },
    { id: 3, value: 'coffee_shop', title: 'Coffee Shop' },
    { id: 4, value: 'ice_cream_parlor', title: 'Ice Cream Parlor' },
    { id: 5, value: 'dinner', title: 'Dinner' },
    { id: 6, value: 'cafe', title: 'UCafeS' },
    { id: 7, value: 'bakery', title: 'Bakery' },
    { id: 8, value: 'bar', title: 'Bar' },
  ];

  async function saveSettings() {
    form.user_id =
      userData?.userDetail && userData?.userDetail.id
        ? userData?.userDetail?.id?.toString()
        : '';
    const category = categoryRecords.find((x: any) => {
      if (x.id == selectedCategory) {
        return x.value;
      }
    });

    form.business_category = category && category?.value ? category?.value : '';
    if (
      form.business_address.length == 0 ||
      form.business_name.length == 0 ||
      form.contact_number.length == 0 ||
      form.user_id.length == 0 ||
      form.business_category.length == 0
    ) {
      Toast.show({
        title: 'Add complete information',
      });
      return;
    }
    setIsSavingLoading(true);

    try {
      const res = await axiosInstance.post<any>(
        'userInfo/add-business-info',
        form,
        HEADERS,
      );
      if (res.data) {
        Toast.show({
          title: 'Profile updated successfully',
        });
        getBusinessInfo();
      } else {
        setIsSavingLoading(false);
      }
    } catch (e: any) {
      setIsSavingLoading(false);

      Toast.show({
        title: e?.response?.data?.message
          ? e?.response?.data?.message
          : 'Cannot update profile',
      });
    }
  }

  async function setCategory(id: string) {
    setSelectedCategory(id);
  }

  function NavigateToScreen(screenName: string) {
    navigation.dispatch(
      CommonActions.navigate({
        name: screenName,
      }),
    );
  }
  const removeImage = useCallback(
    async item => {
      const filteredImages =
        (imageCollections &&
          imageCollections.filter(image => image.uri !== item.uri)) ||
        [];
      setImageCollections(filteredImages);
      if (!item?.isFile) {
        await deleteImage({ id: merchantSetting?.id, imageId: item.uri });
      }
    },
    [imageCollections, merchantSetting],
  );

  const uploadImage = useCallback(
    async (isDescription = false) => {
      let isChecked = false;
      const payload = {
        id: merchantSetting?.id,
        merchant_id: userData?.userDetail?.id,
      };

      if (!isDescription) {
        setLoader(true);
        const newImageUris = await pickImage(setImageCollections);
        if (newImageUris.length > 0) {
          payload.image_collection = [
            ...imageCollections.map(i => i.uri),
            ...newImageUris,
          ];
          isChecked = true;
        }
      } else {
        payload.description = description;
        isChecked = true;
      }

      if (isChecked) {
        console.log('The payload is', payload);
        const result = await saveMerchantSetting(payload, setLoader);
        if (isDescription && result) {
          setDescription(result?.description || '');
        }
        await getMerchantSetting(
          userData?.userDetail?.id,
          setMerchantSetting,
          setImageCollections,
          setDescription,
        );
      } else {
        setLoader(false);
      }
    },
    [imageCollections, merchantSetting, userData, description],
  );

  function renderHeader() {
    return <Header title="Business Info" onPress={() => navigation.goBack()} />;
  }
  function renderContent() {
    if (isLoading) {
      return (
        <Spinner
          size={50}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      );
    } else {
      return (
        <KeyboardAwareScrollView
          contentContainerStyle={[Styles.pV15, Styles.pH15]}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: 12,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 12,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    favorite === 'Settings' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 155,
                }}
                onPress={() => NavigateToScreen('Settings')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Settings' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    favorite === 'Banking Info' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 155,
                }}
                onPress={() => NavigateToScreen('BankingInfo')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Banking Info' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Banking Info
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 12,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    favorite === 'Business Info' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 150,
                }}
                onPress={() => setFavorite('Business Info')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Business Info'
                        ? COLORS.white
                        : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Business Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor:
                    favorite === 'Change Password' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 150,
                }}
                onPress={() => NavigateToScreen('ChangePassword')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Change Password'
                        ? COLORS.white
                        : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Profile Section */}
          <View style={styles.profilesection}>
            <Shadow
              offset={[0, 0]}
              distance={10}
              startColor={'rgba(6, 38, 100, 0.05)'}
              // @ts-ignore
              finalColor={'rgba(6, 38, 100, 0.0)'}
              style={{ borderRadius: 100 }}>
              <Image
                source={{
                  uri:
                    userData &&
                    `${AppConfig.BaseUrl}getFileById?uuid=${profileImage}`,
                }}
                style={styles.profileImg}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.editButton}
                onPress={selectImage}>
                <EditSvg style={{ color: `${COLORS.green}` }} />
              </TouchableOpacity>
            </Shadow>
            <View style={styles.profileinfo}>
              <Text
                style={{
                  fontSize: MOBILE.textSize.xLarge,
                  fontWeight: 'bold',
                  color: COLORS.green,
                }}>
                {merchantDetails?.contactPersonName}
              </Text>
              <Text style={[Styles.textTransformCap]}>
                {merchantDetails?.merchant_defined_role || ''}
              </Text>
            </View>
            {/* <View style={styles.socialIcons}>
              <TouchableOpacity activeOpacity={0.7} onPress={gotoFacebook}>
                <FacebookSvg />
              </TouchableOpacity>
              <TouchableOpacity
              activeOpacity={0.7} onPress={gotoInstagram}>
                <FacebookSvg />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={gotoTwitter}>
                <TwitterSvg />
              </TouchableOpacity>
            </View> */}
          </View>
          {/* Business Details Section */}
          <View style={styles.businessDetails}>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontSize: MOBILE.textSize.xLarge,
                  fontWeight: 'bold',
                  color: COLORS.green,
                }}>
                Business Name:
              </Text>
              <Text
                style={{
                  fontSize: MOBILE.textSize.medium,
                  lineHeight: MOBILE.textSize.medium,
                  // paddingHorizontal: 15,
                }}>
                {merchantDetails?.company_name}
              </Text>
            </View>
            <View style={[{ gap: 10 }, Styles.w100]}>
              <View
                style={[
                  Styles.w100,
                  Styles.flexDirectionRow,
                  Styles.alignItemsCenter,
                ]}>
                <Text
                  style={{
                    fontSize: MOBILE.textSize.xLarge,
                    fontWeight: 'bold',
                    color: COLORS.green,
                  }}>
                  Business Description:
                </Text>
                <View style={styles.descriptionButton}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.descriptionButton}
                    onPress={() => {
                      setDescriptionModel(true);
                    }}>
                    <EditSvg style={{ color: `${COLORS.green}` }} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text
                style={{
                  fontSize: MOBILE.textSize.medium,
                  // paddingHorizontal: 15,
                  textAlign: 'left',
                }}>
                {description || ''}
              </Text>
            </View>
          </View>
          {/* Contact Details */}
          <Text
            style={{
              fontSize: MOBILE.textSize.xLarge,
              fontWeight: 'bold',
              color: COLORS.green,
            }}>
            Contact Info:
          </Text>
          <View style={styles.contactSection}>
            <View style={styles.contactchild1}>
              <View style={styles.contactInfo}>
                <PhoneSvg />
                <Text style={[Styles.pL5]} size={MOBILE.textSize.normal}>
                  {userData?.userDetail?.contactPersonPhone || 'N/A'}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <MailSvg />
                <Text
                  style={[Styles.pL5, { textAlignVertical: 'center' }]}
                  size={MOBILE.textSize.normal}>
                  {userData?.userDetail?.email || ''}
                </Text>
              </View>
              <View style={styles.contactInfo}>
                <MapPinTwoSvg />
                <Text
                  style={[Styles.pL5, { textAlignVertical: 'center' }]}
                  size={MOBILE.textSize.normal}>
                  {merchantDetails
                    ? merchantDetails?.street_name ||
                      '' + ' ' + merchantDetails?.street_number ||
                      '' + ' ' + merchantDetails?.address ||
                      '' + ' ' + merchantDetails?.state ||
                      ('' + ' ' + merchantDetails?.country &&
                        merchantDetails?.country.toUppercase()) ||
                      ''
                    : 'N/A'}
                </Text>
              </View>
            </View>
            {/* <View style={styles.contactchild2}>
              <MapView style={styles.map} />
            </View> */}
          </View>

          <View style={styles.businessphotoupload}>
            <Text
              style={{
                fontSize: MOBILE.textSize.xLarge,
                fontWeight: 'bold',
                color: COLORS.green,
              }}>
              Business Gallery:
            </Text>
            <Text size={MOBILE.textSize.xxSmall}>*Limit:6</Text>
            <Text size={MOBILE.textSize.xxSmall}>
              Showcase your business with high-quality photos of your products,
              services, team, and premises to attract and engage customers!
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={imageCollections.length === 6 || loader}
              style={styles.photoBtn}
              onPress={() => uploadImage(false)}>
              <Text>Upload</Text>
            </TouchableOpacity>
          </View>

          {!loader ? (
            <View
              style={[
                Styles.w100,
                Styles.flexDirectionRow,
                { flexWrap: 'wrap' },
                Styles.pH5,
              ]}>
              {imageCollections && imageCollections.length
                ? imageCollections.map(item => (
                    <View
                      key={generateRandomId()}
                      style={[
                        Styles.mT10,
                        Styles.mR10,
                        {
                          width: scaleSize(100),
                          height: scaleSize(80),
                          borderRadius: scaleSize(5),
                        },
                      ]}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.closeButton}
                        onPress={() => {
                          removeImage(item);
                        }}>
                        <CloseIcon
                          size={MOBILE.iconSize.vmSmall}
                          color={COLORS.carrot}
                        />
                      </TouchableOpacity>

                      <Image
                        source={{
                          uri: `${AppConfig.BaseUrl}getFileById?uuid=${item?.uri}`,
                        }}
                        style={{
                          width: scaleSize(100),
                          height: scaleSize(80),
                          borderRadius: scaleSize(5),
                        }}
                      />
                    </View>
                  ))
                : null}

              <PopUpModal
                open={descriptionModel}
                onClose={() => setDescriptionModel(false)}>
                <View
                  style={[
                    Styles.w100,
                    Styles.pV25,
                    Styles.flex04,
                    {
                      backgroundColor: COLORS.white,
                      borderRadius: scaleSize(5),
                      width: '95%',
                      alignSelf: 'center',
                    },
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      position: 'absolute',
                      top: scaleSize(10),
                      right: scaleSize(10),
                    }}
                    onPress={() => {
                      setDescriptionModel(false);
                    }}>
                    <CloseIcon
                      size={MOBILE.iconSize.small}
                      color={COLORS.carrot}
                    />
                  </TouchableOpacity>
                  <View style={[Styles.w100, Styles.pH20, Styles.flex]}>
                    <View style={[Styles.flex]}>
                      <InputField
                        title="Description"
                        placeholder="Description"
                        value={description}
                        onchange={(e: any) => {
                          setDescription(e);
                        }}
                        multiline={true}
                        maxLength={500}
                        containerStyle={{
                          height: scaleSize(85),
                        }}
                      />
                    </View>
                    <Button
                      containerStyle={[Styles.mT10, Styles.w100]}
                      title="Update"
                      onPress={() => {
                        uploadImage(true);
                        setDescriptionModel(false);
                      }}
                    />
                  </View>
                </View>
              </PopUpModal>
            </View>
          ) : (
            <View style={[Styles.flexCenter]}>
              <Spinner />
            </View>
          )}
        </KeyboardAwareScrollView>
      );
    }
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  profilesection: {
    alignItems: 'center',
    gap: 20,
  },
  profileImg: {
    height: 130,
    width: 130,
    borderRadius: 100,
    // backgroundColor: COLORS.gray
  },
  profileinfo: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  businessDetails: {
    marginVertical: 10,
    gap: 15,
  },
  contactSection: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
    // flexWrap: 'wrap',
    // gap: 5,
  },
  contactchild1: {
    flex: 1,
    // gap: 15,
  },
  contactchild2: {
    // flex: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 15,
    ...Styles.pV5,
  },
  businessphotoupload: {
    marginVertical: scaleSize(5),
    // gap: 15,
  },
  photoBtn: {
    paddingVertical: scaleSize(5),
    flexDirection: 'column',
    alignItems: 'center',
    // gap: 20,
    borderColor: COLORS.green,
    borderStyle: 'dashed',
    borderRadius: scaleSize(5),
    borderWidth: scaleSize(2),
    ...Styles.mT5,
  },
  upbtn: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: COLORS.green,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'column',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // backgroundColor: COLORS.green, // Customize the background color
    padding: 5,
    borderRadius: 10,
  },
  descriptionButton: {
    // position: 'absolute',
    // top: 0,
    // right: 0,
    // backgroundColor: COLORS.green, // Customize the background color
    // padding: 5,
    width: scaleSize(25),
    height: scaleSize(25),
    borderRadius: 10,
    ...Styles.mL5,
    ...Styles.alignItemsCenter,
    ...Styles.justifyContentCenter,
  },
  closeButton: {
    position: 'absolute',
    right: scaleSize(2.5),
    zIndex: 1000,
    backgroundColor: COLORS.blackOverlay,
    width: scaleSize(15),
    height: scaleSize(15),
    borderRadius: scaleSize(5),
    ...Styles.justifyContentCenter,
    ...Styles.alignItemsCenter,
  },
  map: {
    width: scaleSize(150),
    height: scaleSize(150),
  },
});
