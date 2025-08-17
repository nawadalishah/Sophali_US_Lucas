import { Keyboard, SafeAreaView, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AndroidSafeArea, COLORS, FONTS, Text } from '../../constants';
import { Button, Header } from '../../components';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useStyles } from './styles';
import {
  cellBlockStyle,
  disabledButton,
  forgotPasswordOtpHandler,
  otpVerificationHandler,
} from './helper';
import Styles from '../../utils/styles';
import { PERSIST_TAPS } from '../../constants/theme';

const ForgotPasswordOTP = () => {
  const navigation = useNavigation();
  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const styles = useStyles();

  useEffect(() => {
    setTimeout(() => {
      setValue('');
      setError(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (value && value.length === 4) {
      Keyboard.dismiss();
      verificationCode();
    }
  }, [value]);

  const verificationCode = useCallback(() => {
    otpVerificationHandler(
      route?.params?.email,
      value,
      setError,
      setValue,
      setLoading,
      navigation,
    );
  }, [error, navigation, value, loading, route?.params?.email]);

  const resendCodeHandler = useCallback(() => {
    forgotPasswordOtpHandler({ email: route?.params?.email }, null, null);
  }, [route?.params?.email]);

  const renderHeader = () => (
    <Header
      title="Verification"
      goBack={true}
      onPress={() => navigation.goBack()}
    />
  );

  const renderContent = () => (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={PERSIST_TAPS.HANDLED}
      contentContainerStyle={styles.contentContainerStyle}>
      <Text
        style={{
          ...FONTS.bodyText,
          color: COLORS.gray,
          ...Styles.mV10,
        }}>
        We have sent you an email with a code.
      </Text>
      <View style={[Styles.flex]}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={val => {
            setValue(val);
            setError(false);
          }}
          cellCount={CELL_COUNT}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View style={cellBlockStyle(error, isFocused, styles)}>
              <Text
                key={index}
                color={COLORS.black}
                style={[styles.textCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        <View style={[Styles.w100, Styles.flexDirectionRow, Styles.pV10]}>
          <Text
            style={{
              ...FONTS.bodyText,
              color: COLORS.gray,
            }}>
            Didn’t receive the OTP?
          </Text>
          <Text
            onPress={resendCodeHandler}
            style={{
              ...FONTS.bodyText,
              color: COLORS.skyBlue,
              ...Styles.pL5,
            }}>
            Resend Code
          </Text>
        </View>
      </View>
      <View style={[Styles.w100, Styles.pV10]}>
        <Button
          title="Verify"
          onPress={verificationCode}
          textStyle={[Styles.textTransformCap]}
          disabled={disabledButton(value)}
        />
      </View>
    </KeyboardAwareScrollView>
  );

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default ForgotPasswordOTP;
