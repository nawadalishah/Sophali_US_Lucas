import React, { useEffect, useState } from 'react';
import { AndroidSafeArea, COLORS, FONTS } from '../../constants';
import { SafeAreaView, Text, View } from 'react-native';
import { Button, Header, InputField } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { CheckSvgch } from "../../svg";
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import * as yup from 'yup';
import { FormControl, Toast } from 'native-base';
import { axiosInstance } from '../../config/axios';
import { HEADERS } from '../../utils/helpers';

const schema = yup.object().shape({
  address: yup.string().required('Address is required'),
});

const UserAddress = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user, stepOne, register } = useAppSelector(state => state.auth);
  const { error } = useAppSelector(state => state.error);
  const [form, setForm] = useState({
    address: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onClick = () => {
    schema
      .validate(form)
      .then(async () => {
        try {
          const data = {
            first_name: stepOne.firstName,
            last_name: stepOne.lastName,
            username: stepOne.companyName,
            email: register.email,
            company_name: stepOne.companyName,
            mobile: stepOne.companyContact,
            password: register.password,
            address: form.address,
            photo: 123,
            user_type_id: 3,
            status: 1,
            web_token: 7878787,
          };
          // console.log('form',data)
          const res = await axiosInstance.post<any>(
            'merchants/add',
            data,
            HEADERS,
          );
          Toast.show({
            title: 'Register successfully',
          });
          if (res.data) {
            navigation.navigate('SignIn' as never);
          }
          return res.data;
        } catch (e: any) {
          console.log(e, 'error');
          // dispatch(setSignUpError())
          Toast.show({
            title: e?.response?.data?.message || 'Unable to register',
          });
        }

        // console.log(stepOne)
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
      <Header
        title="Step 3"
        goBack={true}
        onPress={() => navigation.goBack()}
      />
    );
  }

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        <Text
          style={{
            marginBottom: 54,
            ...FONTS.H1,
            color: COLORS.black,
          }}>
          Complete address
        </Text>
        <FormControl mb={30} isInvalid={!!errors.streetNumber}>
          <InputField
            title="Address"
            placeholder="Address"
            onchange={(v: string) => {
              setForm({ ...form, address: v });
            }}
          />
          <FormControl.ErrorMessage>
            {errors.streetNumber}
          </FormControl.ErrorMessage>
        </FormControl>

        <Button
          title="Next"
          containerStyle={{ marginBottom: 20 }}
          onPress={onClick}
        />
        {/*<View*/}
        {/*    style={{*/}
        {/*        flexDirection: "row",*/}
        {/*        alignItems: "center",*/}
        {/*        marginBottom: 63,*/}
        {/*    }}*/}
        {/*>*/}
        {/*    <Text style={{color: COLORS.gray, ...FONTS.bodyText}}>*/}
        {/*        Already have an account?{" "}*/}
        {/*    </Text>*/}
        {/*    <TouchableOpacity*/}
        {/*        onPress={() => navigation.navigate("SignIn" as never)}*/}
        {/*    >*/}
        {/*        <Text*/}
        {/*            style={{*/}
        {/*                textAlign: "right",*/}
        {/*                ...FONTS.bodyText,*/}
        {/*                color: COLORS.carrot,*/}
        {/*                lineHeight: 16 * 1.5,*/}
        {/*            }}*/}
        {/*        >*/}
        {/*            Sign in.*/}
        {/*        </Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*</View>*/}
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default UserAddress;
