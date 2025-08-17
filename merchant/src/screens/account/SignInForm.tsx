import { TouchableOpacity, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { COLORS, Text } from '../../constants';
import { Button, InputField } from '../../components';
import { CheckSvgch } from '../../svg';
import { FormControl } from 'native-base';
import Styles from '../../utils/styles';
import { useStyles } from './styles';
import { scaleSize } from '../../utils/mixins';
import { HIT_SLOP, PERSIST_TAPS } from '../../constants/theme';
import { MOBILE } from '../../utils/orientation';
import { EyeVisibleIcon, EyeVisibleOffIcon } from '../../utils/icons';
import { isEmpty } from 'lodash';

const SignInForm = ({ form, setForm, errors, onSubmit, loading }) => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const styles = useStyles();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.contentContainerStyle}
      keyboardShouldPersistTaps={PERSIST_TAPS.HANDLED}
      showsVerticalScrollIndicator={false}>
      <View
        style={[
          Styles.flex,
          Styles.w100,
          Styles.flexDirectionColumn,
          Styles.mT40,
        ]}>
        <FormControl mb={scaleSize(30)} isInvalid={!!errors.email} isRequired>
          <InputField
            title="email"
            value={form.email}
            placeholder="merchant@sophali.com"
            icon={form?.email && !errors.email && <CheckSvgch />}
            onchange={(v: string) => {
              setForm({ ...form, email: v });
            }}
            keyboardType={'email-address'}
            autoCompleteType={'email'}
            returnKeyType={'next'}
            ref={emailRef}
            titleColor={COLORS.black}
            placeholderTextColor={COLORS.gray}
            onSubmitEditing={() => {
              passwordRef?.current.focus();
            }}
            error={!!errors.email}
            defaultValue={form?.email || ''}
            maxLength={200}
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          mb={scaleSize(30)}
          isRequired
          isInvalid={!!errors.password}>
          <InputField
            title="password"
            placeholder="••••••••"
            value={form.password}
            secureTextEntry={!showPassword}
            onchange={(v: string) => {
              setForm({ ...form, password: v });
            }}
            icon={
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={HIT_SLOP.FIVE}
                onPress={togglePasswordVisibility}>
                {showPassword ? <EyeVisibleIcon /> : <EyeVisibleOffIcon />}
              </TouchableOpacity>
            }
            autoCompleteType={'current-password'}
            returnKeyType={'done'}
            ref={passwordRef}
            onSubmitEditing={onSubmit}
            error={!!errors.password}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        <Button
          title="Sign In"
          containerStyle={[Styles.w100]}
          textStyle={[
            styles.btnTextStyle,
            Styles.textTransformCap,
            { color: COLORS.white },
          ]}
          onPress={onSubmit}
          disabled={loading || !isEmpty(errors)}
          isLoading={loading}
        />
        <View
          style={[
            Styles.w100,
            { justifyContent: 'flex-end' },
            Styles.mV10,
            Styles.flexDirectionRow,
          ]}>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={HIT_SLOP.FIVE}
            style={[Styles.pV5]}
            onPress={() => navigation.navigate('ForgotPassword' as never)}>
            <Text
              size={MOBILE.textSize.large}
              style={{
                textAlign: 'right',
                color: COLORS.carrot,
                ...Styles.pV5,
              }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button
        title="Register your restaurant"
        containerStyle={{
          ...Styles.mV20,
          backgroundColor: COLORS.lightBlue,
        }}
        textStyle={styles.btnTextStyle}
        onPress={() => navigation.navigate('SignUp' as never)}
        disabled={loading}
      />
    </KeyboardAwareScrollView>
  );
};

export default SignInForm;
