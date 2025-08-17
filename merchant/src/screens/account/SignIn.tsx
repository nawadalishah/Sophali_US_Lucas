import { SafeAreaView, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { AndroidSafeArea } from '../../constants';
import { SophaliMerchantLogo } from '../../svg';
import { useAppDispatch } from '../../redux/Store';
import { signInAction } from '../../redux/authentication/authAction';
import * as yup from 'yup';
import Styles from '../../utils/styles';
import { validationSignInSchema } from './helper';
import SignInForm from './SignInForm';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SignInFormErrorsTypes, SignInFormTypes, SignInRouteParamsTypes } from '../../interfaces/dtos';

const SignIn = () => {
  const [errors, setErrors] = useState<SignInFormErrorsTypes>({});
  const [form, setForm] = useState<SignInFormTypes>({
    email: '',
    password: '',
    role: 'Merchant',
    isMerchant: true,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const schema = validationSignInSchema();
  const route = useRoute<RouteProp<SignInRouteParamsTypes, 'SignIn'>>();

  useEffect(() => {
    setForm(prev => ({ ...prev, email: route?.params?.email?? "" }));
  }, [route?.params?.email]);

  useEffect(() => {
    setErrors({});
  }, [form]);

  const onSubmit = useCallback(() => {
    setLoading(true);
    schema
      .validate(form)
      .then(() => {
        dispatch(signInAction(form)).catch(err => {
          console.log(err);
          setLoading(false);
        });
        setLoading(false);
      })
      .catch((err: yup.ValidationError) => {
        setLoading(false);
        if (!err.path) return;
        setErrors({ [err.path]: err.message });
      });
  }, [form, loading]);

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      <View style={[Styles.flex, Styles.primaryBackground, Styles.w100]}>
        <View style={[Styles.w100, Styles.alignItemsCenter, Styles.pV25]}>
          <SophaliMerchantLogo />
        </View>
        <SignInForm
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={onSubmit}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
