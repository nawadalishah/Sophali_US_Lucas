import { Image, SafeAreaView, StatusBar, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Shadow } from 'react-native-shadow-2';
// @ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { AndroidSafeArea, COLORS } from '../../constants';
import { Button, Header, InputField } from '../../components';
import { CheckSvgch } from '../../svg';
import { useAppSelector } from '../../redux/Store';
import { Spinner, Toast } from 'native-base';
import { axiosInstance } from '../../config/axios';
import { AppConfig } from '../../config';

export default function EditProfile() {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const [userRecord, setUser] = useState<any>();
  const userData = user;
  const [loadingState, setLoadingState] = useState<any>(false);
  const [form, setForm] = useState<any>({
    username: '',
    address: '',
    email: '',
    contactPersonPhone: '',
  });

  useEffect(() => {
    if (userData?.userDetail.id) {
      getUserSettings(userData?.userDetail.id);
    }
  }, []);

  async function getUserSettings(data: any) {
    setLoadingState(true);
    if (data) {
      //   setIsListLoading(true)
      try {
        const res = await axiosInstance.get<any>(`user/${data}`);
        if (res.data && res.data.user) {
          setLoadingState(false);
          setUser(res.data.user);
          setForm({
            username: res.data.user.username,
            address: res.data.user.address,
            email: res.data.user.email,
            contactPersonPhone: res.data.user.contactPersonPhone,
          });
        }
        return res.data;
      } catch (e: any) {
        setLoadingState(false);
        Toast.show({
          title: e?.response?.data?.message || 'Something went wrong',
        });
      }
    }
    setLoadingState(false);
  }

  const onSaveChanges = async () => {
    setLoadingState(true);
    try {
      const res = await axiosInstance.put<any>(
        `user/update-profile?id=${userData?.userDetail.id}`,
        form,
      );
      Toast.show({
        title: 'Profile updated successfully',
      });
      setLoadingState(false);
      return res.data;
    } catch (e: any) {
      setLoadingState(false);
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  function renderHeader() {
    return <Header title="Edit profile" onPress={() => navigation.goBack()} />;
  }

  function renderContent() {
    if (loadingState && loadingState == true) {
      return (
        <Spinner
          size={50}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      );
    } else {
      return (
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 36,
          }}
          showVerticalScrollIndicator={false}>
          <View style={{ alignSelf: 'center', marginBottom: 34 }}>
            <Shadow
              offset={[0, 0]}
              distance={10}
              startColor={'rgba(6, 38, 100, 0.05)'}
              // @ts-ignore
              finalColor={'rgba(6, 38, 100, 0.0)'}>
              <Image
                source={{
                  uri:
                    userRecord &&
                    `${AppConfig.BaseUrl}getFileById?uuid=${userRecord.company_logo}`,
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  alignSelf: 'center',
                  borderWidth: 6,
                  borderColor: COLORS.white,
                }}
              />
            </Shadow>
          </View>

          <InputField
            placeholder="Darlene Robertson"
            title="Username"
            // value={userRecord && userRecord.username}
            value={form.username}
            containerStyle={{ marginBottom: 30 }}
            icon={<CheckSvgch />}
            editable={false}
          />
          <InputField
            placeholder="Chicago, USA"
            title="location"
            value={form.address}
            onchange={(text: string) => setForm({ ...form, address: text })}
            containerStyle={{ marginBottom: 30 }}
            icon={<CheckSvgch />}
          />
          <InputField
            placeholder="darlenerobertson@mail.com"
            title="email"
            value={userRecord && userRecord.email}
            containerStyle={{ marginBottom: 30 }}
            editable={false}
            icon={<CheckSvgch />}
          />
          <InputField
            placeholder="+38 0123456789"
            title="phone number"
            containerStyle={{ marginBottom: 30 }}
            icon={<CheckSvgch />}
            value={form.contactPersonPhone}
            onchange={(text: string) =>
              setForm({ ...form, contactPersonPhone: text })
            }
          />

          <Button title="save changes" onPress={onSaveChanges} />
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
