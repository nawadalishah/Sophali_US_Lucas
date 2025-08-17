import { SafeAreaView, View } from 'react-native';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { AndroidSafeArea, COLORS } from '../../constants';
import { Button, Header, InputField } from '../../components';
import { FormControl } from 'native-base';
import Styles from '../../utils/styles';
import { useStyles } from './styles';
import { scaleSize } from '../../utils/mixins';
import { CheckSvgch } from '../../svg';
import { isEmpty } from 'lodash';
import { forgetPasswordSchema, forgotPasswordOtpHandler } from './helper';
import { PERSIST_TAPS } from '../../constants/theme';
import * as yup from 'yup';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingState, setLoadingState] = useState(false);
  const emailRef = useRef();
  const styles = useStyles();
  const schema = forgetPasswordSchema();

  useEffect(() => {
    setErrors({});
  }, [form]);

  function renderHeader() {
    return (
      <Header
        title="Forgot password"
        goBack={true}
        onPress={() => navigation.goBack()}
      />
    );
  }

  const forgetPassword = useCallback(async () => {
    schema
      .validate(form)
      .then(async () => {
        forgotPasswordOtpHandler(form, navigation, setLoadingState);
      })
      .catch((err: yup.ValidationError) => {
        setLoadingState(false);
        if (!err.path) return;
        setErrors({ [err.path]: err.message });
      });
  }, [form]);

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={PERSIST_TAPS.HANDLED}
        contentContainerStyle={[styles.contentContainerStyle]}>
        <View style={[Styles.flex, Styles.mT15]}>
          <FormControl
            mb={scaleSize(30)}
            isInvalid={!!errors?.email}
            isRequired>
            <InputField
              title="email"
              value={form?.email}
              placeholder="merchant@sophali.com"
              icon={form?.email && !errors?.email && <CheckSvgch />}
              onchange={(v: string) => {
                setForm({ ...form, email: v });
              }}
              keyboardType={'email-address'}
              autoCompleteType={'email'}
              returnKeyType={'done'}
              ref={emailRef}
              onSubmitEditing={() => {}}
              maxLength={150}
              error={!!errors?.email}
            />
            <FormControl.ErrorMessage>{errors?.email}</FormControl.ErrorMessage>
          </FormControl>
        </View>
        <View style={[Styles.w100, Styles.pV10]}>
          <Button
            title="Reset Password"
            containerStyle={[Styles.w100]}
            textStyle={[
              styles.btnTextStyle,
              Styles.textTransformCap,
              { color: COLORS.white },
            ]}
            onPress={forgetPassword}
            isLoading={loadingState}
            disabled={loadingState || !isEmpty(errors)}
          />
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
