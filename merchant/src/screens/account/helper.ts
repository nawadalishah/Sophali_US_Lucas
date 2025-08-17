import moment from 'moment';
import * as yup from 'yup';
import { AppConfig } from '../../config';
import * as FileSystem from 'expo-file-system';
import { Toast } from 'native-base';
import { axiosInstance } from '../../config/axios';
import { HEADERS } from '../../utils/helpers';
import keys from '../../constants/keys';

export const validationSignInSchema = () =>
  yup.object().shape({
    password: yup.string().trim().required('Please enter your password.'),
    //   .min(8, 'Password must be at least 8 characters.'),
    email: yup
      .string()
      .trim()
      .required('Please enter your email.')
      .email('Please enter a valid email.'),
  });

const USER_NAME_REGEX = /^[A-Za-z][a-zA-Z ]+$/i;
const NUMBER_REGEX = /^[0-9]+$/;
const PASSWORD_REGEX =
  /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

export const signUpValidationSchema = () =>
  yup.object().shape({
    email: yup
      .string()
      .trim()
      .required('Please enter your email.')
      .email('Please enter a valid email.'),
    password: yup
      .string()
      .trim()
      .required('Please enter your password.')
      .min(8, 'Password must be at least 8 characters.')
      .matches(
        PASSWORD_REGEX,
        'Password must contain at least 8 characters, including uppercase, lowercase letters, numbers and special characters.',
      ),
    confirmPassword: yup
      .string()
      .trim()
      .required('Please confirm your password.')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    firstName: yup
      .string()
      .trim()
      .required('Please enter your first name.')
      .min(1, 'First name must be more than 1 letter.')
      .matches(
        USER_NAME_REGEX,
        'First name only contains letters & more than a character.',
      ),
    lastName: yup
      .string()
      .trim()
      .required('Please enter your last name.')
      .min(1, 'Last name must be more than 1 letter.')
      .matches(
        USER_NAME_REGEX,
        'Last name only contains letters & more than a character.',
      ),
    // dob: yup.string().trim(),
    // gender: yup.object().optional(),

    // username: yup
    //   .string()
    //   .trim()
    //   .required('Please enter contact person name.')
    //   .min(1, 'Contact person name must be more than 1 letter.'),
    // role: yup.string().trim().required('Please enter role.'),
    // contactPersonNumber: yup
    //   .string()
    //   .trim()
    //   .required('Please enter contact person number.')
    //   .min(7, 'Contact person number must be more 6 digits.')
    //   .matches(NUMBER_REGEX, 'Field must contain digits'),
    // companyName: yup
    //   .string()
    //   .trim()
    //   .required('Please enter company name.')
    //   .min(1, 'Company name must be more than 1 letter.'),
    // streetNumber: yup.string().trim().required('Please enter street number.'),
    // streetName: yup
    //   .string()
    //   .trim()
    //   .required('Please enter street name.')
    //   .min(1, 'Street name must be more than 1 letter.'),
    // city: yup
    //   .string()
    //   .trim()
    //   .required('Please enter city.')
    //   .min(1, 'City must be more than 1 letter.'),
    // streetAddress: yup.string().trim().optional(),
    // postalCode: yup
    //   .string()
    //   .required('Please enter postal code.')
    //   .min(4, 'Postal code must be of at least 4 characters. ')
    //   .max(10, 'Postal code must be of at most 10 characters.'),
    // country: yup
    //   .object()
    //   .required('Please select country.')
    //   .test(
    //     'notEmpty',
    //     'Please select country.',
    //     value => Object.keys(value).length > 0,
    //   ),
    // state: yup.object().optional().nullable(),
    // mobile: yup
    //   .string()
    //   .trim()
    //   .required('Please enter phone number.')
    //   .min(7, 'Phone number must be more 6 digits.')
    //   .matches(NUMBER_REGEX, 'Field must contain digits'),
    // companyLogo: yup.string().trim().required('Please select company logo.'),

    // bankName: yup.string().trim(),
    // accountHolderName: yup.string().trim(),
    // accountNumber: yup.string().trim(),
    // // routingNumber: yup.string().trim().required('Please enter routing number.'),
    // transitNumber: yup.string().trim(),
    // institutionNumber: yup.string().trim(),

    // accountHolderType: yup.object().optional(),
  });

export const forgetPasswordSchema = () =>
  yup.object().shape({
    email: yup
      .string()
      .trim()
      .required('Please enter your email.')
      .email('Please enter a valid email.'),
  });

export const resetPasswordSchema = () =>
  yup.object().shape({
    confirmPassword: yup
      .string()
      .trim()
      .required('Please confirm your password.')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    password: yup
      .string()
      .trim()
      .required('Please enter your password.')
      .min(8, 'Password must be at least 8 characters.')
      .matches(
        PASSWORD_REGEX,
        'Password must contain at least 8 characters, including uppercase, lowercase letters, numbers and special characters.',
      ),
  });

export const SIGN_UP_VALUES = {
  email: '',
  password: '',
  confirmPassword: '',
  salutation: {},
  salutationValue: '',
  firstName: '',
  lastName: '',
  dob: moment('1960-01-01').toDate(),
  username: '',
  contactPerson: '',
  role: '',
  contactPersonNumber: 0,
  gender: {},
  //Restaurant Info
  companyName: '',
  streetNumber: '',
  streetName: '',
  city: '',
  postalCode: '',
  country: {},
  state: {},
  address: '',
  mobile: '',
  companyLogo: '',
  image: '',
  //Account Info
  bankName: '',
  accountHolderName: '',
  accountHolderType: {},
  accountNumber: '',
  currency: 'cad',
  routingNumber: '',
  transitNumber: '',
  institutionNumber: '',

  genderValue: '',
  accountHolderTypeValue: '',
  countryValue: '',
  stateValue: '',
};

export const ACCOUNT_CATEGORY_DATA = [
  { id: 1, value: 'company', title: 'Company' },
  { id: 2, value: 'individual', title: 'Individual' },
];

export const GENDER_DATA = [
  { id: 1, value: 'male', title: 'Male' },
  { id: 2, value: 'female', title: 'Female' },
  { id: 3, value: 'other', title: 'Other' },
];

export const SALUTATION_DATA = [
  { id: 1, value: 'mr', title: 'Mr' },
  { id: 2, value: 'mrs', title: 'Mrs' },
  { id: 3, value: 'miss', title: 'Miss' },
];

export const COUNTRY_DATA = [
  { id: 38, value: 'CA', title: 'Canada' },
  { id: 231, value: 'US', title: 'US' },
];

export const COUPON_HOURS = [
  { _id: 0, value: 24, hour: 'Full Day' },
  { _id: 1, value: 1, hour: '1 hour' },
  { _id: 2, value: 2, hour: '2 hour' },
  { _id: 3, value: 3, hour: '3 hour' },
  { _id: 4, value: 4, hour: '4 hour' },
  { _id: 5, value: 5, hour: '5 hour' },
  { _id: 6, value: 6, hour: '6 hour' },
  { _id: 7, value: 7, hour: '7 hour' },
  { _id: 8, value: 8, hour: '8 hour' },
  { _id: 9, value: 9, hour: '9 hour' },
  { _id: 10, value: 10, hour: '10 hour' },
  { _id: 11, value: 11, hour: '11 hour' },
  { _id: 12, value: 12, hour: '12 hour' },
  { _id: 13, value: 13, hour: '13 hour' },
  { _id: 14, value: 14, hour: '14 hour' },
  { _id: 15, value: 15, hour: '15 hour' },
  { _id: 16, value: 16, hour: '16 hour' },
  { _id: 17, value: 17, hour: '17 hour' },
  { _id: 18, value: 18, hour: '18 hour' },
  { _id: 19, value: 19, hour: '19 hour' },
  { _id: 20, value: 20, hour: '20 hour' },
];


export const handleSubmit = async (
  schema,
  form,
  setLoadingState,
  setErrors,
  createToken,
  navigation,
  isTermsAndConditions,
  setForm,
  setIsTermsAndConditions,
) => {
  schema
    .validate(form)
    .then(async () => {
      try {
        setLoadingState(true);
        if (!isTermsAndConditions) {
          Toast.show({
            title: 'Kindly accept Terms & Conditions',
          });
          setLoadingState(false);
          return;
        }
        if (!checkAgeValidity(form?.dob)) {
          Toast.show({
            title: 'Age must be greater than 13.',
          });
          setErrors({ dob: 'Age must be greater than 13.' });
          setLoadingState(false);
          return;
        }

        // const uploadImage = await uploadImageHandler(form);
        const uploadImage = 'restaurant.png';
        if (!uploadImage) {
          setLoadingState(false);
          return;
        }
        const DOB = moment(form?.dob).format('YYYY-MM-DD');
        const address = `${form?.streetNumber || ''} ${form?.streetName || ''}, ${form?.city || ''}, ${form?.state?.name || ''}, ${form?.country?.value || ''}, ${form?.postalCode?.toUpperCase() || ''}`;
        const routingNumber =
          (form?.transitNumber || '') + '-' + (form?.institutionNumber || '');
        const data = {
          ...form,
          email: form?.email,
          password: form?.password,
          confirmPassword: form?.confirmPassword,
          first_name: form?.firstName,
          last_name: form?.lastName,
          dob: DOB,
          contactPersonName: form?.contactPerson,
          username: form?.username,
          screenName: form?.contactPerson,
          role: form?.role,
          contactPersonPhone: '+' + form?.contactPersonNumber,
          gender: form?.gender?.value,

          company_name: form?.companyName,
          street_number: form?.streetNumber,
          street_name: form?.streetName,
          city: form?.city,
          state: form?.state?.name,
          postal_code: form?.postalCode?.toUpperCase() || '',
          country: form?.country?.value,

          address: address,
          mobile: '+' + form?.mobile,
          company_logo: uploadImage,

          status: 1,
          user_type_id: 3,
          user_role_id: 3,

          bankName: form?.bankName,
          type: 'BankAccount',
          accountHolderName: form?.accountHolderName,
          accountHolderType: form?.accountHolderType?.value,
          accountNumber: form?.accountNumber,
          currency: 'cad',
          routingNumber: routingNumber,
        };
        const body = { ...data };
        console.log('The data is---.', data);
        const res = await axiosInstance.post<any>('register', data, HEADERS);
        console.log('The res is---.', res?.data);
        if (res?.data?.code === 200) {
          const userResponse = res?.data.data;
          body.user_id = userResponse?.id;
          body.accountId = userResponse?.stripe_account_id;
          const tokenBody = {
            type: 'BankAccount',
            accountHolderName: form?.accountHolderName || '',
            accountHolderType: form?.accountHolderType?.value || '',
            accountNumber: form?.accountNumber || '',
            country: 'CA',
            currency: 'cad',
            routingNumber: routingNumber || '',
            bankName: form?.bankName || '',
          };
          const { error, token } = await createToken(tokenBody);
          if (error) {
            console.log('[error]', error);
            // Toast.show({
            //   title: error.message,
            // });
            setLoadingState(false);
            navigation.navigate('SignUpFail' as never);

            return;
          } else {
            try {
              console.log('The bodyyy', body?.accountId, body);
              const response = await axiosInstance.post<any>(
                'userInfo/add-banking-info-stripe',
                {
                  accountId: body?.accountId,
                  externalAccountToken: token?.id,
                },
                HEADERS,
              );
              if (response) {
                try {
                  const bankBody = {
                    ...body,
                    bank_name: body?.bankName,
                    account_holder_name: body?.accountHolderName,
                    bank_account_number: body?.accountNumber,
                    account_type: body?.accountHolderType,
                    bank_routing_number: routingNumber,
                    business_name: body?.company_name,
                    contact_number: body?.mobile,
                    business_address: body?.address,
                  };
                  const bankResponse = await axiosInstance.post<any>(
                    'userInfo/add-banking-info',
                    bankBody,
                    HEADERS,
                  );
                  if (bankResponse?.data) {
                    Toast.show({
                      title: 'Registered successfully',
                    });
                    setLoadingState(false);
                    navigation.navigate('SignUpSuccess' as never);
                    setForm(SIGN_UP_VALUES);
                    setIsTermsAndConditions(false);
                  }
                } catch (e: any) {
                  setLoadingState(false);
                  console.log('The Regetser', e);
                  Toast.show({
                    title:
                      e?.response?.data?.message ||
                      "Couldn't add banking information",
                  });
                }
              } else {
                setLoadingState(false);
                navigation.navigate('SignUpFail' as never);
                setForm(SIGN_UP_VALUES);
                setIsTermsAndConditions(false);
              }
            } catch (errors) {
              setLoadingState(false);
              navigation.navigate('SignUpFail' as never);
              setForm(SIGN_UP_VALUES);
              setIsTermsAndConditions(false);

              console.error('Error:', errors);
            }
          }
          // setLoadingState(false);
          // Toast.show({
          //   title: 'Register successfully',
          // });
          // navigation.navigate('SignIn' as never);
        } else {
          Toast.show({
            title: "Couldn't register right now. Please try again",
          });
        }
      } catch (e: any) {
        console.log('The Register', e, e?.response?.data?.message);

        setLoadingState(false);
        Toast.show({
          title: e?.response?.data?.message || 'Something went wrong',
        });
      }
    })
    .catch((err: yup.ValidationError) => {
      console.log('error', err);
      setLoadingState(false);
      setIsTermsAndConditions(false);
      if (!err.path) return;
      setErrors({ [err.path]: err.message });
    });
};

function checkAgeValidity(dob: any) {
  const dateOfBirth = new Date(dob);
  const ageInMilliseconds = Date.now() - dateOfBirth.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  if (ageInYears < 13) {
    return false;
  } else {
    return true;
  }
}

const uploadImageHandler = async form => {
  try {
    const res = await FileSystem.uploadAsync(
      `${AppConfig.BaseUrl}upload`,
      form?.companyLogo,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'Files',
      },
    );
    // Toast.show({
    //   title: 'Resturant logo uploaded successfully',
    // });
    const { data: imageUpload } = JSON.parse(res.body);
    return imageUpload;
  } catch (e: any) {
    console.log(JSON.stringify(e), e.message);
    Toast.show({
      title: e?.response?.data?.message || 'Something went wrong',
    });
    return null;
  }
};

export const STRIPE_KEY = keys.STRIPE_KEY;

export const cellBlockStyle = (error, isFocused, styles) => [
  styles.cell,
  error ? styles.errorCel : {},
  isFocused ? styles.filledCell : {},
];

export const disabledButton = value => {
  const disabled = value === '' || value.length < 3;
  return disabled;
};

export const otpVerificationHandler = async (
  email,
  value,
  setError,
  setValue,
  setLoading,
  navigation,
) => {
  try {
    setLoading(true);
    if (!email) {
      Toast.show({
        title: 'Email is required',
      });
      return;
    }
    const data = { email: email, otp: value };
    const response = await axiosInstance.post(
      'forgot-password-otp-verification',
      data,
      HEADERS,
    );
    const res = response?.data;
    if (res && res.code === 200) {
      setError(false);
      setValue('');
      Toast.show({
        title: res?.message,
      });
      setTimeout(() => {
        navigation.navigate('ResetPassword', { email: email });
      }, 100);
    } else {
      setError(true);
      setLoading(false);
    }
  } catch (err: any) {
    console.log('333', err);
    setError(true);
    setLoading(false);
    Toast.show({
      title: err?.response?.data?.message || 'Something went wrong',
    });
  }
};

export const forgotPasswordOtpHandler = async (
  form,
  navigation,
  setLoadingState,
) => {
  try {
    setLoadingState && setLoadingState(true);
    if (!form?.email) {
      Toast.show({
        title: 'Email is required',
      });
      return;
    }
    const data = {
      email: form.email,
    };
    const res = await axiosInstance.post<any>(
      'forgot-password-otp',
      data,
      HEADERS,
    );
    if (res.data) {
      Toast.show({
        title: res.data.message,
      });
      navigation &&
        navigation.navigate('ForgotPasswordOTP', { email: form?.email });
      setLoadingState && setLoadingState(false);
    }
    setLoadingState && setLoadingState(false);
  } catch (e: any) {
    setLoadingState && setLoadingState(false);

    Toast.show({
      title: e?.response?.data?.message || 'Unable to forget password',
    });
  }
};

export const resetPasswordHandler = async (
  form,
  navigation,
  setLoadingState,
  email,
) => {
  try {
    setLoadingState && setLoadingState(true);
    if (!email) {
      Toast.show({
        title: 'Email is required',
      });
      return;
    }
    if (!form?.password) {
      Toast.show({
        title: 'Password is required',
      });
      return;
    }
    if (!form?.confirmPassword || form?.password !== form?.confirmPassword) {
      Toast.show({
        title: 'Confirm password should be same to password',
      });
      return;
    }
    const data = {
      email: email,
      password: form?.password?.trim(),
    };
    const res = await axiosInstance.post<any>(
      'user-reset-password',
      data,
      HEADERS,
    );
    if (res.data) {
      Toast.show({
        title: res.data.message,
      });
      navigation &&
        navigation.navigate('PasswordHasBeenReset', { email: email });
      setLoadingState && setLoadingState(false);
    }
    setLoadingState && setLoadingState(false);
  } catch (e: any) {
    setLoadingState && setLoadingState(false);

    Toast.show({
      title: e?.response?.data?.message || 'Unable to forget password',
    });
  }
};
