import { TouchableOpacity, View, Image } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { COLORS, Text } from '../../constants';
import { Header, InputField } from '../../components';
import { CheckSvgch } from '../../svg';
import { FormControl, Select } from 'native-base';
import PhoneInput from 'react-native-phone-input';
import moment from 'moment';
import { useStyles } from './styles';
import { CAPITALIZE, HIT_SLOP, RESIZE_MODE } from '../../constants/theme';
import Styles from '../../utils/styles';
import {
  ACCOUNT_CATEGORY_DATA,
  COUNTRY_DATA,
  GENDER_DATA,
  SALUTATION_DATA,
  STRIPE_KEY,
} from './helper';
import { scaleSize } from '../../utils/mixins';
import {
  CloseIcon,
  EyeVisibleIcon,
  EyeVisibleOffIcon,
} from '../../utils/icons';
import { deviceWidth } from '../../utils/orientation';
import { StripeProvider } from '@stripe/stripe-react-native';

export const SignUpHeader = () => {
  const navigation = useNavigation();
  return (
    <Header
      containerStyle={[Styles.mV10]}
      title={'Welcome!'}
      subTitle={'Tell us about your restaurant'}
      onPress={() => navigation.goBack()}
    />
  );
};

export const PersonalInfo = ({
  form,
  setForm,
  errors,
  showDatePicker,
  dobModalEnabled,
}) => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const styles = useStyles();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const usernameRef = useRef();
  const roleRef = useRef();
  const contactPersonNumberRef = useRef();

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
    <View style={[Styles.w100]}>
      <FormControl mb={scaleSize(30)} isInvalid={!!errors?.email} isRequired>
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
          onSubmitEditing={() => {
            passwordRef?.current?.focus();
          }}
          maxLength={200}
          error={!!errors?.email}
        />
        <FormControl.ErrorMessage>{errors?.email}</FormControl.ErrorMessage>
      </FormControl>
      <FormControl mb={scaleSize(30)} isRequired isInvalid={!!errors?.password}>
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
        <FormControl.ErrorMessage>{errors?.password}</FormControl.ErrorMessage>
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
          error={!!errors?.confirmPassword}
        />
        <FormControl.ErrorMessage>
          {errors?.confirmPassword}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl mb={scaleSize(30)} isReadOnly>
        <Text style={[styles.labelStyle, Styles.pB5]}>Salutation</Text>
        <Select
          style={[styles.valueStyle]}
          key="Salutation"
          placeholder="Select Salutation"
          selectedValue={form?.salutationValue}
          width={deviceWidth - 35}
          onValueChange={(itemValue: any) => {
            const salutation = SALUTATION_DATA?.find((x: any) => {
              if (x.id == itemValue) {
                return x;
              }
            });
            setForm({
              ...form,
              salutation: salutation,
              salutationValue: salutation?.id,
            });
          }}>
          {SALUTATION_DATA?.map((item: any, index: any) => (
            <Select.Item key={index} label={item.title} value={item.id} />
          ))}
        </Select>
      </FormControl>

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
          error={!!errors?.firstName}
        />
        <FormControl.ErrorMessage>{errors?.firstName}</FormControl.ErrorMessage>
      </FormControl>
      <FormControl mb={scaleSize(30)} isInvalid={!!errors?.lastName} isRequired>
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
          error={!!errors?.lastName}
        />
        <FormControl.ErrorMessage>{errors?.lastName}</FormControl.ErrorMessage>
      </FormControl>
      <FormControl mb={scaleSize(30)} isInvalid={!!errors?.username} isRequired>
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
          error={!!errors?.username}
        />
        <FormControl.ErrorMessage>{errors?.username}</FormControl.ErrorMessage>
      </FormControl>
      <FormControl mb={scaleSize(30)} isInvalid={!!errors?.role} isRequired>
        <InputField
          title="Role"
          value={form?.role}
          placeholder="Owner"
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
            !!errors?.contactPersonNumber && { borderBottomColor: COLORS.red },
          ]}>
          <Text style={styles.labelStyle}>Contact Person Phone Number</Text>
          <PhoneInput
            ref={contactPersonNumberRef}
            placeholderTextColor={COLORS.gray}
            initialCountry={'ca'}
            textProps={{
              style: styles.phoneInputStyle,
              placeholderTextColor: COLORS.gray,
              placeholder: '13178675309',
              maxLength: 15,
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
      <FormControl mb={scaleSize(20)} isInvalid={!!errors?.dob} isRequired>
        <View
          style={[
            styles.phoneInputContainer,
            !!errors?.dob && { borderBottomColor: COLORS.red },
          ]}>
          <Text style={styles.labelStyle}>Date of Birth</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[Styles.w100]}
            onPress={showDatePicker}>
            <Text style={styles.phoneInputStyle}>
              {dobModalEnabled
                ? moment(form?.dob).format('DD MMMM YYYY')
                : 'YYYY-MM-DD'}
            </Text>
          </TouchableOpacity>
        </View>

        <FormControl.ErrorMessage>{errors?.dob}</FormControl.ErrorMessage>
      </FormControl>
      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.gender}
        isReadOnly
        isRequired>
        <Text style={[styles.labelStyle, Styles.pB5]}>Gender</Text>

        <Select
          style={[styles.valueStyle]}
          key="Gender"
          placeholder="Select Gender"
          selectedValue={form?.genderValue}
          width={deviceWidth - 35}
          onValueChange={(itemValue: any) => {
            const gender = GENDER_DATA.find((x: any) => {
              if (x.id == itemValue) {
                return x;
              }
            });
            setForm({ ...form, gender: gender, genderValue: gender?.id });
          }}>
          {GENDER_DATA?.map((item: any, index: any) => (
            <Select.Item key={index} label={item.title} value={item.id} />
          ))}
        </Select>
        <FormControl.ErrorMessage>{errors?.gender}</FormControl.ErrorMessage>
      </FormControl>
    </View>
  );
};

export const RestaurantInfo = ({
  form,
  errors,
  setForm,
  setCountryAndGetStates,
  pickImage,
  clearImage,
  statesRecord,
}) => {
  const styles = useStyles();
  const companyNameRef = useRef();
  const streetNameRef = useRef();
  const streetNumberRef = useRef();
  const cityRef = useRef();
  const postalCodeRef = useRef();
  const mobileRef = useRef();
  return (
    <View style={[Styles.w100]}>
      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.companyName}
        isRequired>
        <InputField
          title="Restaurant Name"
          value={form?.companyName}
          placeholder="Tea Cafe"
          icon={form?.companyName && !errors?.companyName && <CheckSvgch />}
          onchange={(v: string) => {
            setForm({ ...form, companyName: v });
          }}
          autoCapitalize={CAPITALIZE.WORDS}
          autoCompleteType={'name'}
          returnKeyType={'next'}
          ref={companyNameRef}
          onSubmitEditing={() => {
            streetNumberRef?.current?.focus();
          }}
          error={!!errors?.companyName}
        />
        <FormControl.ErrorMessage>
          {errors?.companyName}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.streetNumber}
        isRequired>
        <InputField
          title="Street Number"
          value={form?.streetNumber}
          placeholder="#"
          icon={form?.streetNumber && !errors?.streetNumber && <CheckSvgch />}
          onchange={(v: string) => {
            setForm({ ...form, streetNumber: v });
          }}
          returnKeyType={'next'}
          keyboardType={'numeric'}
          ref={streetNumberRef}
          onSubmitEditing={() => {
            streetNameRef?.current?.focus();
          }}
          error={!!errors?.streetNumber}
        />
        <FormControl.ErrorMessage>
          {errors?.streetNumber}
        </FormControl.ErrorMessage>
      </FormControl>
      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.streetName}
        isRequired>
        <InputField
          title="Street Name"
          value={form?.streetName}
          placeholder="Street"
          icon={form?.streetName && !errors?.streetName && <CheckSvgch />}
          onchange={(v: string) => {
            setForm({ ...form, streetName: v });
          }}
          autoCompleteType={'street-address'}
          returnKeyType={'next'}
          autoCapitalize={CAPITALIZE.SENTENCES}
          ref={streetNameRef}
          onSubmitEditing={() => {
            cityRef?.current?.focus();
          }}
          error={!!errors?.streetName}
        />
        <FormControl.ErrorMessage>
          {errors?.streetName}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl mb={scaleSize(30)} isInvalid={!!errors?.city} isRequired>
        <InputField
          title="City"
          value={form?.city}
          placeholder="City"
          icon={form?.city && !errors?.city && <CheckSvgch />}
          onchange={(v: string) => {
            setForm({ ...form, city: v });
          }}
          autoCompleteType={'street-address'}
          returnKeyType={'next'}
          autoCapitalize={CAPITALIZE.SENTENCES}
          ref={cityRef}
          onSubmitEditing={() => {
            postalCodeRef?.current?.focus();
          }}
          error={!!errors?.city}
        />
        <FormControl.ErrorMessage>{errors?.city}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.postalCode}
        isRequired>
        <InputField
          title="Postal Code"
          value={form?.postalCode}
          placeholder="Postal Code"
          icon={form?.postalCode && !errors?.postalCode && <CheckSvgch />}
          onchange={(v: string) => {
            setForm({ ...form, postalCode: v });
          }}
          autoCompleteType={'postal-code'}
          autoCapitalize={CAPITALIZE.CHARACTERS}
          returnKeyType={'next'}
          ref={postalCodeRef}
          onSubmitEditing={() => {
            mobileRef?.current?.focus();
          }}
          error={!!errors?.postalCode}
          maxLength={15}
        />
        <FormControl.ErrorMessage>
          {errors?.postalCode}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl mb={scaleSize(20)} isInvalid={!!errors?.mobile} isRequired>
        <View
          style={[
            styles.phoneInputContainer,
            !!errors?.mobile && { borderBottomColor: COLORS.red },
          ]}>
          <Text style={styles.labelStyle}>Restaurant Phone Number</Text>
          <PhoneInput
            ref={mobileRef}
            placeholderTextColor={COLORS.gray}
            initialCountry={'ca'}
            textProps={{
              style: styles.phoneInputStyle,
              placeholderTextColor: COLORS.gray,
              placeholder: '13178675309',
              maxLength: 15,
            }}
            onChangePhoneNumber={v => {
              setForm({ ...form, mobile: parseInt(v) });
            }}
          />
        </View>
        <FormControl.ErrorMessage>{errors?.mobile}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.country}
        isReadOnly
        isRequired>
        <Text style={[styles.labelStyle, Styles.pB5]}>Country</Text>

        <Select
          style={[styles.valueStyle]}
          key="country"
          placeholder="Select Country"
          selectedValue={form?.countryValue}
          width={deviceWidth - 35}
          onValueChange={(itemValue: any) => {
            const country = COUNTRY_DATA.find((x: any) => {
              if (x.id == itemValue) {
                return x;
              }
            });
            setForm({ ...form, country: country, countryValue: country?.id });
            setCountryAndGetStates(country?.id);
          }}>
          {COUNTRY_DATA?.map((item: any, index: any) => (
            <Select.Item key={index} label={item.title} value={item.id} />
          ))}
        </Select>
        <FormControl.ErrorMessage>{errors?.country}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.state}
        isReadOnly
        isRequired>
        <Text style={[styles.labelStyle, Styles.pB5]}>State</Text>

        <Select
          style={[styles.valueStyle]}
          key="state"
          placeholder="Select State"
          selectedValue={form?.stateValue}
          width={deviceWidth - 35}
          onValueChange={(itemValue: any) => {
            const state = statesRecord.find((x: any) => {
              if (x.id == itemValue) {
                return x;
              }
            });
            setForm({ ...form, state: state, stateValue: state?.id });
          }}>
          {statesRecord?.map((item: any, index: any) => (
            <Select.Item key={index} label={item.name} value={item.id} />
          ))}
        </Select>
        <FormControl.ErrorMessage>{errors?.state}</FormControl.ErrorMessage>
      </FormControl>

      <FormControl
        mb={scaleSize(30)}
        isInvalid={!!errors?.companyLogo}
        isReadOnly
        isRequired>
        <View
          style={[
            Styles.w100,
            Styles.justifyContentCenter,
            Styles.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.logoContainer,
              !!errors?.companyLogo && { borderColor: COLORS.red },
            ]}
            onPress={pickImage}>
            <Text style={[styles.valueStyle]}>Upload Restaurant's Logo</Text>
          </TouchableOpacity>
          {form?.image && (
            <>
              <Image
                source={{ uri: form?.image }}
                resizeMode={RESIZE_MODE.COVER}
                style={[styles.logoStyle]}
              />

              <CloseIcon
                color={COLORS.red}
                onPress={clearImage}
                style={styles.closeIconStyle}
              />
            </>
          )}
        </View>
        <FormControl.ErrorMessage>
          {errors?.companyLogo}
        </FormControl.ErrorMessage>
      </FormControl>
    </View>
  );
};

export const BankingInfo = ({ form, setForm, errors }) => {
  const styles = useStyles();
  const bankNameRef = useRef();
  const accountHolderName = useRef();
  const accountNumber = useRef();
  // const routingNumber = useRef();
  const transitNumber = useRef();
  const institutionNumber = useRef();

  return (
    <StripeProvider
      publishableKey={STRIPE_KEY}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <View style={[Styles.w100]}>
        <FormControl
          mb={scaleSize(30)}
          isInvalid={!!errors?.bankName}
          isRequired>
          <InputField
            title="Bank Name"
            value={form?.bankName}
            placeholder="Bank"
            icon={form?.bankName && !errors?.bankName && <CheckSvgch />}
            onchange={(v: string) => {
              setForm({ ...form, bankName: v });
            }}
            autoCompleteType={'name'}
            returnKeyType={'next'}
            ref={bankNameRef}
            autoCapitalize={CAPITALIZE.WORDS}
            onSubmitEditing={() => {
              accountHolderName?.current?.focus();
            }}
            error={!!errors?.bankName}
          />
          <FormControl.ErrorMessage>
            {errors?.bankName}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          mb={scaleSize(30)}
          isInvalid={!!errors?.accountHolderName}
          isRequired>
          <InputField
            title="Account Holder Name"
            value={form?.accountHolderName}
            placeholder="John Smith"
            icon={
              form?.accountHolderName &&
              !errors?.accountHolderName && <CheckSvgch />
            }
            onchange={(v: string) => {
              setForm({ ...form, accountHolderName: v });
            }}
            autoCompleteType={'additional-name'}
            autoCapitalize={CAPITALIZE.WORDS}
            returnKeyType={'next'}
            ref={accountHolderName}
            onSubmitEditing={() => {
              accountNumber?.current?.focus();
            }}
            error={!!errors?.accountHolderName}
          />
          <FormControl.ErrorMessage>
            {errors?.accountHolderName}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          mb={scaleSize(30)}
          isInvalid={!!errors?.accountNumber}
          isRequired>
          <InputField
            title="Bank Account Number"
            value={form?.accountNumber}
            placeholder="000123456789"
            icon={
              form?.accountNumber && !errors?.accountNumber && <CheckSvgch />
            }
            onchange={(v: string) => {
              setForm({ ...form, accountNumber: v });
            }}
            autoCompleteType={'cc-number'}
            returnKeyType={'next'}
            keyboardType={'numeric'}
            ref={accountNumber}
            onSubmitEditing={() => {
              transitNumber?.current?.focus();
            }}
            error={!!errors?.accountNumber}
          />
          <FormControl.ErrorMessage>
            {errors?.accountNumber}
          </FormControl.ErrorMessage>
        </FormControl>
        {/* 
        <FormControl
          mb={scaleSize(30)}
          isInvalid={!!errors?.routingNumber}
          isRequired>
          <InputField
            title="Bank Routing Number"
            value={form?.routingNumber}
            placeholder="11000000"
            icon={
              form?.routingNumber && !errors?.routingNumber && <CheckSvgch />
            }
            onchange={(v: string) => {
              setForm({ ...form, routingNumber: v });
            }}
            autoCompleteType={'cc-number'}
            returnKeyType={'next'}
            keyboardType={'numeric'}
            ref={routingNumber}
            error={!!errors?.routingNumber}
          />
          <FormControl.ErrorMessage>
            {errors?.routingNumber}
          </FormControl.ErrorMessage>
        </FormControl> */}

        <FormControl
          mb={scaleSize(30)}
          isInvalid={!!errors?.transitNumber}
          isRequired>
          <InputField
            title="Transit/Branch Number"
            value={form?.transitNumber}
            placeholder="11000"
            icon={
              form?.transitNumber && !errors?.transitNumber && <CheckSvgch />
            }
            onchange={(v: string) => {
              setForm({ ...form, transitNumber: v });
            }}
            autoCompleteType={'cc-number'}
            returnKeyType={'next'}
            keyboardType={'numeric'}
            ref={transitNumber}
            error={!!errors?.transitNumber}
            maxLength={5}
            onSubmitEditing={() => {
              institutionNumber?.current?.focus();
            }}
          />
          <FormControl.ErrorMessage>
            {errors?.transitNumber}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl
          mb={scaleSize(30)}
          isInvalid={!!errors?.institutionNumber}
          isRequired>
          <InputField
            title="Institution Number"
            value={form?.institutionNumber}
            placeholder="000"
            icon={
              form?.institutionNumber &&
              !errors?.institutionNumber && <CheckSvgch />
            }
            onchange={(v: string) => {
              setForm({ ...form, institutionNumber: v });
            }}
            autoCompleteType={'cc-number'}
            returnKeyType={'next'}
            keyboardType={'numeric'}
            ref={institutionNumber}
            error={!!errors?.institutionNumber}
            maxLength={3}
          />
          <FormControl.ErrorMessage>
            {errors?.institutionNumber}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl
          mb={scaleSize(30)}
          isInvalid={!!errors?.accountHolderType}
          isReadOnly
          isRequired>
          <Text style={[styles.labelStyle, Styles.pB5]}>
            Account Holder Type
          </Text>
          <Select
            style={[styles.valueStyle]}
            key="account"
            placeholder="Select Account Holder Type"
            selectedValue={form?.accountHolderTypeValue}
            width={deviceWidth - 35}
            onValueChange={(itemValue: any) => {
              const accountHolderType = ACCOUNT_CATEGORY_DATA.find((x: any) => {
                if (x.id == itemValue) {
                  return x;
                }
              });
              setForm({
                ...form,
                accountHolderType: accountHolderType,
                accountHolderTypeValue: accountHolderType?.id,
              });
            }}>
            {ACCOUNT_CATEGORY_DATA?.map((item: any, index: any) => (
              <Select.Item key={index} label={item.title} value={item.id} />
            ))}
          </Select>
          <FormControl.ErrorMessage>
            {errors?.accountHolderType}
          </FormControl.ErrorMessage>
        </FormControl>
      </View>
    </StripeProvider>
  );
};
