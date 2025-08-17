import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { AndroidSafeArea, COLORS, FONTS, SIZES } from '../../constants';
import { Button, InputField } from '../../components';
import {
  CheckSvgch,
  EyeOffSvg,
  FacebookSvg,
  GoogleSvg,
  TwitterSvg,
} from '../../svg';
import { useAppDispatch } from '../../redux/Store';
import { register } from '../../redux/authentication/authReducer';
import * as yup from 'yup';
import { FormControl } from 'native-base';
import { signUpAction } from '../../redux/authentication/authAction';

const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function SignUp() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onClick = () => {
    console.log('form ===', form);
    schema
      .validate(form)
      .then(() => {
        dispatch(register(form));
        navigation.navigate('UserInfoScreen' as never);
      })
      .catch((err: yup.ValidationError) => {
        if (!err.path) return;
        setErrors({ [err.path]: err.message });
      });
  };

  useEffect(() => {
    setErrors({});
  }, [form]);

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 42,
        }}>
        <Text
          style={{
            // @ts-ignore
            fontSize: 18,
            ...FONTS.H3,
            color: COLORS.black,
            textTransform: 'capitalize',
          }}>
          Step 1
        </Text>
      </View>
    );
  }

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: SIZES.paddingTop,
          paddingBottom: 20,
        }}>
        <Text
          style={{
            marginBottom: 54,
            ...FONTS.H1,
            color: COLORS.black,
          }}>
          Sign up
        </Text>
        <FormControl mb={30} isInvalid={!!errors.name}>
          <InputField
            title="email"
            placeholder="xyz@mail.com"
            icon={<CheckSvgch />}
            onchange={(v: string) => {
              setForm({ ...form, email: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>

        {/*<InputField*/}
        {/*    containerStyle={{marginBottom: 30}}*/}
        {/*    title="email"*/}
        {/*    placeholder="darlenerobertson@mail.com"*/}
        {/*    icon={<CheckSvgch/>}*/}
        {/*/>*/}
        <FormControl mb={30} isInvalid={!!errors.password}>
          <InputField
            title="password"
            placeholder="••••••••"
            secureTextEntry={true}
            onchange={(v: string) => {
              setForm({ ...form, password: v });
            }}
            icon={
              <TouchableOpacity>
                <EyeOffSvg />
              </TouchableOpacity>
            }
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        {/*<InputField*/}
        {/*    containerStyle={{marginBottom: 30}}*/}
        {/*    title="confirm password"*/}
        {/*    placeholder="••••••••"*/}
        {/*    secureTextEntry={true}*/}
        {/*    icon={*/}
        {/*        <TouchableOpacity>*/}
        {/*            <EyeOffSvg/>*/}
        {/*        </TouchableOpacity>*/}
        {/*    }*/}
        {/*/>*/}

        <Button
          title="Next"
          containerStyle={{ marginBottom: 20 }}
          onPress={onClick}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 63,
          }}>
          <Text style={{ color: COLORS.gray, ...FONTS.bodyText }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn' as never)}>
            <Text
              style={{
                textAlign: 'right',
                ...FONTS.bodyText,
                color: COLORS.carrot,
                lineHeight: 16 * 1.5,
              }}>
              Sign in.
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <TouchableOpacity style={{ marginHorizontal: 7.5 }}>
            <FacebookSvg />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 7.5 }}>
            <TwitterSvg />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 7.5 }}>
            <GoogleSvg />
          </TouchableOpacity>
        </View>
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
