import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Shadow } from 'react-native-shadow-2';
// @ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Center, Flex, Spinner, Switch, Toast } from 'native-base';
import { AndroidSafeArea, COLORS } from '../../constants';
import { Button, Header, InputField } from '../../components';
import { CheckSvgch, CrossRedSvg, CrossSvg } from '../../svg';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { axiosInstance } from '../../config/axios';
import { HEADERS } from '../../utils/helpers';

export default function ChangePassword() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    old_password: '',
    password: '',
    confirmPassword: '',
  });
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [favorite, setFavorite] = useState('Change Password');
  const [isLoading, setIsLoading] = useState(false);

  function NavigateToScreen(screenName: string) {
    navigation.dispatch(
      CommonActions.navigate({
        name: screenName,
      }),
    );
  }

  async function saveSettings() {
    if (
      form.password.length &&
      form.confirmPassword.length &&
      form.old_password.length &&
      form.password == form.confirmPassword
    ) {
      setIsLoading(true);
      const payload = {
        userId: userData?.userDetail.id,
        old_password: form.old_password,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      try {
        const res = await axiosInstance.post<any>(
          'users/update-password',
          payload,
          HEADERS,
        );
        if (res.data) {
          setIsLoading(false);
          Toast.show({
            title: 'password changed successfully',
          });
          setForm({
            old_password: '',
            password: '',
            confirmPassword: '',
          });
        }
      } catch (e: any) {
        setIsLoading(false);
        Toast.show({
          title: e?.response?.data?.message || 'Something went wrong',
        });
      }
    }
  }

  function renderHeader() {
    return (
      <Header title="Change Password" onPress={() => navigation.goBack()} />
    );
  }

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 36,
        }}
        showVerticalScrollIndicator={false}>
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
                  color: favorite === 'Settings' ? COLORS.white : COLORS.black,
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
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
              style={{
                backgroundColor:
                  favorite === 'BusinessInfo' ? COLORS.green : '#F3F7FF',
                borderRadius: 50,
                marginHorizontal: 5,
                width: 150,
              }}
              onPress={() => NavigateToScreen('BusinessInfo')}>
              <Text
                style={{
                  paddingHorizontal: 28,
                  paddingVertical: 3,
                  lineHeight: 12 * 1.3,
                  color:
                    favorite === 'BusinessInfo' ? COLORS.white : COLORS.black,
                  fontFamily: 'Lato-Regular',
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                Business Info
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor:
                  favorite === 'Change Password' ? COLORS.green : '#F3F7FF',
                borderRadius: 50,
                marginHorizontal: 5,
                width: 150,
              }}
              onPress={() => setFavorite('Change Password')}>
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

        <InputField
          placeholder="Current Password"
          title="Current Password"
          value={form.old_password}
          onchange={(v: string) => {
            setForm({ ...form, old_password: v });
          }}
          containerStyle={{ marginBottom: 30 }}
          icon={<CheckSvgch />}
        />
        <InputField
          placeholder="New Password"
          title="New Password"
          value={form.password}
          onchange={(v: string) => {
            setForm({ ...form, password: v });
          }}
          containerStyle={{ marginBottom: 30 }}
          icon={<CheckSvgch />}
        />
        <InputField
          placeholder="Confirm Password"
          title="Confirm Password"
          value={form.confirmPassword}
          onchange={(v: string) => {
            setForm({ ...form, confirmPassword: v });
          }}
          containerStyle={{ marginBottom: 3 }}
          icon={
            form.password !== form.confirmPassword ? (
              <CrossRedSvg />
            ) : (
              <CheckSvgch />
            )
          }
        />
        <Center
          style={{ marginBottom: 30 }}
          _text={{
            color: '#FF0000',
          }}>
          {form.password &&
          form.confirmPassword.length &&
          form.password !== form.confirmPassword ? (
            <Text style={{ color: '#FF0000' }}>
              Password and Confirm Password Does't match
            </Text>
          ) : (
            ''
          )}
        </Center>
        <>
          <Button
            title={isLoading ? '' : 'Save'}
            isLoading={isLoading}
            style={{ marginBottom: 20 }}
            onPress={saveSettings}
            disabled={isLoading}
          />
        </>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}
