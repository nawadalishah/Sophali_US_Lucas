import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { AndroidSafeArea, COLORS, FONTS, SIZES } from '../../../constants';
import { ArrowTwo } from '../../../svg';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { categoryAction } from '../../../redux/merchant/category/categoryAction';
import { FormControl, Toast } from 'native-base';
import { Button, InputField } from '../../../components';
import { productAction } from '../../../redux/merchant/product/productAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../../config/axios';
import { AppConfig } from '../../../config';
import * as FileSystem from 'expo-file-system';
import { currency } from '../../../constants/dummyData';
import { HEADERS } from '../../../utils/helpers';

export default function EditAddOn() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute();
  const { user } = useAppSelector(state => state.auth);
  const [imageUUID, setImageUUID] = useState('');
  const [isProductSaving, setIsProductSaving] = useState<any>(false);
  const userData = user;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [addOnId, setAddOnId] = useState<any>(null);
  const { addOn }: any = route.params;
  const [form, setForm] = useState({
    title: '',
    added_by: 0,
    parent_id: 0,
    price: 0,
    photo: [],
  });
  const [image, setImage] = useState('');

  useEffect(() => {
    dispatch(categoryAction(userData?.userDetail));
  }, []);

  useEffect(() => {
    setImage(`${AppConfig.BaseUrl}getFileById?uuid=${JSON.parse(addOn.photo)}`);
    setImageUUID(JSON.parse(addOn.photo) ? JSON.parse(addOn.photo)[0] : '');
    setAddOnId(addOn.id);
    setForm({
      title: addOn.title,
      added_by: addOn.added_by,
      parent_id: addOn.parent_id,
      price: addOn.price.toString(),
      photo: addOn.uuids,
    });
  }, [addOn]);

  useEffect(() => {
    dispatch(productAction({ data: userData?.userDetail }));
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    console.log(result);

    if (!result.canceled) {
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
          title: 'image upload successfully',
        });
        const { data: imageUpload } = JSON.parse(res.body);
        setImageUUID(imageUpload);
        return res.body;
      } catch (e: any) {
        console.log(JSON.stringify(e), e.message);
        Toast.show({
          title: e?.response?.data?.message || 'Unable to upload image',
        });
      }
    }
  };

  async function editProduct() {
    setIsProductSaving(true);
    if (imageUUID && addOnId) {
      const addOnPayload: any = {
        id: addOnId,
        price: form.price,
        title: form.title,
        photo: JSON.stringify([imageUUID]),
      };

      try {
        const res = await axiosInstance.post<any>(
          'addons/update',
          addOnPayload,
          HEADERS,
        );
        Toast.show({
          title: 'Edit add on successfully',
        });
        if (res.data) {
          setIsProductSaving(false);
          navigation.dispatch(
            CommonActions.navigate({
              name: 'AddOnsList',
            }),
          );
        }
      } catch (e: any) {
        setIsProductSaving(false);
        console.log(JSON.stringify(e));
        Toast.show({
          title: e?.response?.data?.message || 'Unable to edit add on',
        });
      }
    } else {
      setIsProductSaving(false);
      Toast.show({ title: 'please upload image first' });
    }
  }

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          // paddingTop: SIZES.paddingTop,
          paddingBottom: 30,
        }}>
        <View style={{}}>
          <Text style={{ ...FONTS.H1 }}>Edit AddOn</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 16, top: 34 }}>
            <ArrowTwo />
          </TouchableOpacity>
        </View>

        <FormControl mb={7} isInvalid={!!errors.email}>
          <InputField
            title="Title"
            placeholder=""
            value={form.title}
            onchange={(v: string) => {
              setForm({ ...form, title: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title={`Price in ${currency}`}
            placeholder=""
            value={form.price}
            onchange={(v: number) => {
              setForm({ ...form, price: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 20,
            width: 100,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.transparent,
              borderRadius: 50,
            }}
            onPress={pickImage}>
            <Text
              style={{
                // paddingHorizontal: 36,
                // paddingVertical: 6,
                lineHeight: 14 * 1.5,
                color: COLORS.black,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}>
              Select Image
            </Text>
          </TouchableOpacity>
        </View>
        {image && (
          <Image
            source={{
              uri: image
                ? image
                : `${AppConfig.BaseUrl}getFileById?uuid=${JSON.parse(
                    addOn?.uuids,
                  )}`,
            }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
              marginLeft: 4,
              marginBottom: 10,
            }}
          />
        )}
        <>
          <Button
            title={isProductSaving ? '' : 'Edit'}
            isLoading={isProductSaving}
            style={{ marginBottom: 20 }}
            onPress={editProduct}
            disabled={isProductSaving}
          />
        </>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {/* {renderHeaderContent()} */}
      {renderContent()}
    </SafeAreaView>
  );
}
