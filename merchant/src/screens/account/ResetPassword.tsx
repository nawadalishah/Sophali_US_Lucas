import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AndroidSafeArea, COLORS } from '../../constants';
import { Button, Header, InputField } from '../../components';
import Styles from '../../utils/styles';
import { useStyles } from './styles';
import { isEmpty } from 'lodash';
import { EyeVisibleIcon, EyeVisibleOffIcon } from '../../utils/icons';
import { HIT_SLOP, PERSIST_TAPS } from '../../constants/theme';
import { FormControl } from 'native-base';
import { scaleSize } from '../../utils/mixins';
import { resetPasswordHandler, resetPasswordSchema } from './helper';
import * as yup from 'yup';

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const styles = useStyles();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingState, setLoadingState] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const schema = resetPasswordSchema();

  useEffect(() => {
    setErrors({});
  }, [form]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword({ ...showPassword, password: !showPassword?.password });
  }, [showPassword]);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowPassword({
      ...showPassword,
      confirmPassword: !showPassword?.confirmPassword,
    });
  }, [showPassword]);

  const resetPassword = useCallback(async () => {
    schema
      .validate(form)
      .then(async () => {
        resetPasswordHandler(
          form,
          navigation,
          setLoadingState,
          route?.params?.email,
        );
      })
      .catch((err: yup.ValidationError) => {
        setLoadingState(false);
        if (!err.path) return;
        setErrors({ [err.path]: err.message });
      });
  }, [form, route?.params?.email]);

  function renderHeader() {
    return (
      <Header
        title="Reset Password"
        goBack={true}
        onPress={() => navigation.goBack()}
      />
    );
  }

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={PERSIST_TAPS.HANDLED}
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={[Styles.w100, Styles.flex, Styles.mT15]}>
          <FormControl
            mb={scaleSize(30)}
            isRequired
            isInvalid={!!errors?.password}>
            <InputField
              title="password"
              placeholder="••••••••"
              value={form?.password}
              secureTextEntry={!showPassword?.password}
              onchange={(v: string) => {
                setForm({ ...form, password: v });
              }}
              icon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP.FIVE}
                  onPress={togglePasswordVisibility}>
                  {showPassword?.password ? (
                    <EyeVisibleIcon />
                  ) : (
                    <EyeVisibleOffIcon />
                  )}
                </TouchableOpacity>
              }
              autoCompleteType={'new-password'}
              returnKeyType={'next'}
              ref={passwordRef}
              onSubmitEditing={() => {
                confirmPasswordRef?.current?.focus();
              }}
              error={!!errors?.password}
            />
            <FormControl.ErrorMessage>
              {errors?.password}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            mb={scaleSize(30)}
            isRequired
            isInvalid={!!errors?.confirmPassword}>
            <InputField
              title="Confirm password"
              placeholder="••••••••"
              value={form?.confirmPassword}
              secureTextEntry={!showPassword?.confirmPassword}
              onchange={(v: string) => {
                setForm({ ...form, confirmPassword: v });
              }}
              onSubmitEditing={() => {
                resetPassword();
              }}
              icon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP.FIVE}
                  onPress={toggleConfirmPasswordVisibility}>
                  {showPassword?.confirmPassword ? (
                    <EyeVisibleIcon />
                  ) : (
                    <EyeVisibleOffIcon />
                  )}
                </TouchableOpacity>
              }
              autoCompleteType={'new-password'}
              returnKeyType={'done'}
              ref={confirmPasswordRef}
              error={!!errors?.confirmPassword}
            />
            <FormControl.ErrorMessage>
              {errors?.confirmPassword}
            </FormControl.ErrorMessage>
          </FormControl>
        </View>

        <View style={[Styles.w100, Styles.pV10]}>
          <Button
            title="Reset"
            containerStyle={[Styles.w100]}
            textStyle={[
              styles.btnTextStyle,
              Styles.textTransformCap,
              { color: COLORS.white },
            ]}
            onPress={resetPassword}
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
};

export default ResetPassword;
