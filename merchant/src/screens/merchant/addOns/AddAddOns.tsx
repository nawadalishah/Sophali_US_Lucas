import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AndroidSafeArea, COLORS, FONTS } from '../../../constants';
import { ArrowTwo } from '../../../svg';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';

import { FormControl, Select, Spinner, Toast } from 'native-base';
import { Button, InputField } from '../../../components';
import * as yup from 'yup';
import { productAction } from '../../../redux/merchant/product/productAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../../config/axios';
import * as FileSystem from 'expo-file-system';
import { AppConfig } from '../../../config';
import { currency } from '../../../constants/dummyData';
import { HEADERS } from '../../../utils/helpers';

export default function AddAddsOns() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isProductSaving, setIsProductSaving] = useState<any>(false);
  const userData = user;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState({
    title: '',
    added_by: 0,
    parent_id: 0,
    price: 0,
    photo: [],
  });

  useEffect(() => {
    dispatch(productAction({ data: userData?.userDetail }));
  }, []);

  const [imageUUID, setImageUUID] = useState('');

  const [image, setImage] = useState('');

  const pickImage = async () => {
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
  };

  async function addProduct() {
    setIsProductSaving(true);
    if (imageUUID) {
      const addOn: any = {
        added_by: userData?.userDetail.id,
        parent_id: userData?.userDetail.id,
        price: form.price,
        title: form.title,
        photo: JSON.stringify([imageUUID]), //"[\"9a2a45c4-005b-4bc8-b087-81b4d79f408b\"]"
      };

      try {
        const res = await axiosInstance.post<any>('addons/add', addOn, HEADERS);
        Toast.show({
          title: 'Added addOn successfully',
        });
        if (res.data) {
          setIsProductSaving(false);
        }
      } catch (e: any) {
        setIsProductSaving(false);
        console.log(JSON.stringify(e));
        Toast.show({
          title: e?.response?.data?.message || 'Unable to add addOn',
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
          <Text style={{ ...FONTS.H1 }}>Add Addon</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 16, top: 34 }}>
            <ArrowTwo />
          </TouchableOpacity>
        </View>

        <FormControl mb={7} isInvalid={!!errors.email}>
          <InputField
            title="Title"
            placeholder=""
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
            source={{ uri: image }}
            style={{ marginBottom: 10, width: 200, height: 200 }}
          />
        )}
        <>
          <Button
            title={isProductSaving ? '' : 'Add'}
            isLoading={isProductSaving}
            style={{ marginBottom: 20 }}
            onPress={addProduct}
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
