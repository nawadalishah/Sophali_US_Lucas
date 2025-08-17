import { Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { CheckSvgch } from '../../../svg';
import { FormControl } from 'native-base';
import { Button, InputField } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  CAPITALIZE,
  COLORS,
  HIT_SLOP,
  PERSIST_TAPS,
} from '../../../constants/theme';
import { useStyles } from './styles';
import Styles from '../../../utils/styles';
import { scaleSize } from '../../../utils/mixins';
import { EyeVisibleIcon, EyeVisibleOffIcon } from '../../../utils/icons';
import PhoneInput from 'react-native-phone-input';
import { isEmpty } from 'lodash';
import { MOBILE } from '../../../utils/orientation';
import { hasMatchingPermissions } from './helper';

const SubMerchantForm = ({
  form,
  errors,
  setForm,
  onClickSubmit = () => {},
  isMerchantSaving = false,
  isEdit = false,
  userRoles = [],
  togglePermission = () => {},
}) => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const usernameRef = useRef();
  const roleRef = useRef();
  const contactPersonNumberRef = useRef();
  const styles = useStyles();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword({ ...showPassword, password: !showPassword?.password });
  }, [showPassword]);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowPassword({
      ...showPassword,
      confirmPassword: !showPassword?.confirmPassword,
    });
  }, [showPassword]);

  return (
    <View style={[Styles.flex, Styles.w100, Styles.primaryBackground]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={PERSIST_TAPS.HANDLED}
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={[Styles.flex, Styles.w100, Styles.primaryBackground]}>
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
              returnKeyType={'next'}
              ref={emailRef}
              onSubmitEditing={() =>
                isEdit
                  ? firstNameRef?.current?.focus()
                  : passwordRef?.current?.focus()
              }
              maxLength={150}
              defaultValue={form?.email || ''}
              error={!!errors?.email}
              editable={!isEdit}
            />
            <FormControl.ErrorMessage>{errors?.email}</FormControl.ErrorMessage>
          </FormControl>
          {!isEdit && (
            <>
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
                  defaultValue={form?.password || ''}
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
                    firstNameRef?.current?.focus();
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
                  returnKeyType={'next'}
                  ref={confirmPasswordRef}
                  defaultValue={form?.confirmPassword || ''}
                  error={!!errors?.confirmPassword}
                />
                <FormControl.ErrorMessage>
                  {errors?.confirmPassword}
                </FormControl.ErrorMessage>
              </FormControl>
            </>
          )}
          <FormControl
            mb={scaleSize(30)}
            isInvalid={!!errors?.firstName}
            isRequired>
            <InputField
              title="First Name"
              value={form?.firstName}
              placeholder="John"
              icon={form?.firstName && !errors?.firstName && <CheckSvgch />}
              onchange={(v: string) => {
                setForm({ ...form, firstName: v });
              }}
              autoCompleteType={'name'}
              returnKeyType={'next'}
              ref={firstNameRef}
              autoCapitalize={CAPITALIZE.WORDS}
              onSubmitEditing={() => {
                lastNameRef?.current?.focus();
              }}
              defaultValue={form?.email || ''}
              error={!!errors?.firstName}
            />
            <FormControl.ErrorMessage>
              {errors?.firstName}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            mb={scaleSize(30)}
            isInvalid={!!errors?.lastName}
            isRequired>
            <InputField
              title="Last Name"
              value={form?.lastName}
              placeholder="Smith"
              icon={form?.lastName && !errors?.lastName && <CheckSvgch />}
              onchange={(v: string) => {
                setForm({ ...form, lastName: v });
              }}
              autoCompleteType={'family-name'}
              autoCapitalize={CAPITALIZE.WORDS}
              returnKeyType={'next'}
              ref={lastNameRef}
              onSubmitEditing={() => {
                usernameRef?.current?.focus();
              }}
              defaultValue={form?.lastName || ''}
              error={!!errors?.lastName}
            />
            <FormControl.ErrorMessage>
              {errors?.lastName}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            mb={scaleSize(30)}
            isInvalid={!!errors?.username}
            isRequired>
            <InputField
              title="Contact Person Name"
              value={form?.username}
              placeholder="John"
              icon={form?.username && !errors?.username && <CheckSvgch />}
              onchange={(v: string) => {
                setForm({ ...form, username: v, contactPerson: v });
              }}
              autoCompleteType={'username'}
              autoCapitalize={CAPITALIZE.WORDS}
              returnKeyType={'next'}
              ref={usernameRef}
              onSubmitEditing={() => {
                roleRef?.current?.focus();
              }}
              defaultValue={form?.username || ''}
              error={!!errors?.username}
            />
            <FormControl.ErrorMessage>
              {errors?.username}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl mb={scaleSize(30)} isInvalid={!!errors?.role} isRequired>
            <InputField
              title="Role"
              value={form?.role}
              placeholder="Manager"
              icon={form?.role && !errors?.role && <CheckSvgch />}
              onchange={(v: string) => {
                setForm({ ...form, role: v });
              }}
              returnKeyType={'next'}
              ref={roleRef}
              onSubmitEditing={() => {
                contactPersonNumberRef?.current?.focus();
              }}
              autoCapitalize={CAPITALIZE.WORDS}
              defaultValue={form?.role || ''}
              error={!!errors?.role}
            />
            <FormControl.ErrorMessage>{errors?.role}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            mb={scaleSize(20)}
            isInvalid={!!errors?.contactPersonNumber}
            isRequired>
            <View
              style={[
                styles.phoneInputContainer,
                !!errors?.contactPersonNumber && {
                  borderBottomColor: COLORS.red,
                },
              ]}>
              <Text style={styles.labelStyle}>Contact Person Phone Number</Text>
              <PhoneInput
                ref={contactPersonNumberRef}
                placeholderTextColor={COLORS.gray}
                initialCountry={'ca'}
                initialValue={form?.mobile || ''}
                // defaultValue={form?.contactPersonNumber || ''}
                textProps={{
                  style: styles.phoneInputStyle,
                  placeholderTextColor: COLORS.gray,
                  placeholder: '13178675309',
                  maxLength: 15,
                  // defaultValue: form?.contactPersonNumber || '',
                  onSubmitEditing: () => {
                    onClickSubmit();
                  },
                }}
                onChangePhoneNumber={v => {
                  setForm({ ...form, contactPersonNumber: parseInt(v) });
                }}
              />
            </View>
            <FormControl.ErrorMessage>
              {errors?.contactPersonNumber}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl
            mb={scaleSize(30)}
            isInvalid={!!errors?.permissions}
            isRequired>
            <View style={[Styles.w100, Styles.justifyContentCenter]}>
              <Text style={styles.labelStyle}>Permissions</Text>

              {userRoles.length > 0 &&
                userRoles.map(roles => (
                  <TouchableOpacity
                    key={roles?.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      togglePermission(roles?.Permission);
                    }}
                    style={[
                      Styles.w100,
                      Styles.flexDirectionRow,
                      Styles.alignItemsCenter,
                      Styles.mT5,
                      Styles.alignContentCenter,
                    ]}>
                    <View style={[styles.checkBox]}>
                      {hasMatchingPermissions(
                        roles?.Permission?.id,
                        form?.permissions,
                      ) ? (
                        <View style={styles.filledBox} />
                      ) : null}
                    </View>
                    <View style={[Styles.mL5, Styles.pV5]}>
                      <Text
                        style={[
                          styles.valueStyle,
                          {
                            fontSize: MOBILE.textSize.small,
                            lineHeight: MOBILE.textSize.large,
                          },
                        ]}>
                        {roles?.Permission?.name || ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
            <FormControl.ErrorMessage>
              {errors?.permissions}
            </FormControl.ErrorMessage>
          </FormControl>
        </View>
      </KeyboardAwareScrollView>
      <View style={[Styles.w100, Styles.pH20, Styles.pV10]}>
        <Button
          title={isEdit ? 'Update' : 'Add'}
          containerStyle={[Styles.w100]}
          textStyle={[
            styles.btnTextStyle,
            Styles.textTransformCap,
            { color: COLORS.white },
          ]}
          onPress={onClickSubmit}
          isLoading={isMerchantSaving}
          disabled={isMerchantSaving || !isEmpty(errors)}
        />
      </View>
    </View>
  );
};

export default SubMerchantForm;
