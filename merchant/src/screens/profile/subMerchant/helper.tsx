import * as yup from 'yup';
import { axiosInstance } from '../../../config/axios';
import { Toast } from 'native-base';
import { HEADERS } from '../../../utils/helpers';

const USER_NAME_REGEX = /^[A-Za-z][a-zA-Z ]+$/i;
const NUMBER_REGEX = /^[0-9]+$/;
const PASSWORD_REGEX =
  /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

export const subMerchantValidationSchema = () =>
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
    username: yup
      .string()
      .trim()
      .required('Please enter contact person name.')
      .min(1, 'Contact person name must be more than 1 letter.'),
    role: yup.string().trim().required('Please enter role.'),
    contactPersonNumber: yup
      .string()
      .trim()
      .required('Please enter contact person number.')
      .min(7, 'Contact person number must be more 6 digits.')
      .matches(NUMBER_REGEX, 'Field must contain digits'),
    permissions: yup
      .array()
      .min(1, 'At least one permission must be selected')
      .required('Permissions are required'),
  });

export const subMerchantValidationEditSchema = () =>
  yup.object().shape({
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
    username: yup
      .string()
      .trim()
      .required('Please enter contact person name.')
      .min(1, 'Contact person name must be more than 1 letter.'),
    role: yup.string().trim().required('Please enter role.'),
    contactPersonNumber: yup
      .string()
      .trim()
      .required('Please enter contact person number.')
      .min(7, 'Contact person number must be more 6 digits.')
      .matches(NUMBER_REGEX, 'Field must contain digits'),
    permissions: yup
      .array()
      .min(1, 'At least one permission must be selected')
      .required('Permissions are required'),
  });

export const SUB_MERCHANT_VALUES = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  username: '',
  contactPerson: '',
  role: '',
  contactPersonNumber: 0,
  mobile: '',
  permissions: [],
};

export const SUB_MERCHANT_EDIT_VALUES = {
  email: '',
  id: '',
  firstName: '',
  lastName: '',
  username: '',
  contactPerson: '',
  role: '',
  contactPersonNumber: 0,
  mobile: '',
  values: null,
  permissions: [],
};

export const setFormInitialValues = (subMerchant, setForm, setLoading) => {
  const mobile = subMerchant?.mobile.replace(/^\+/, '') ?? 0;
  setForm({
    firstName: subMerchant?.first_name || '',
    lastName: subMerchant?.last_name || '',
    username: subMerchant?.username || '',
    contactPerson: subMerchant?.username || '',
    email: subMerchant?.email || '',
    mobile: mobile || '',

    contactPersonNumber: mobile || '',
    role: subMerchant?.merchant_defined_role || '',

    id: subMerchant?.id || '',
    values: subMerchant,
    permissions:
      (subMerchant?.UserPermissions?.length &&
        subMerchant?.UserPermissions?.map(i => i?.Permission)) ||
      [],
  });
  setTimeout(() => {
    setLoading && setLoading(false);
  }, 1000);
};

export const addSubMerchantHandler = async (
  schema: yup.ObjectSchema<
    {
      email: string;
      password: string;
      confirmPassword: string;
      firstName: string;
      lastName: string;
      username: string;
      role: string;
      contactPersonNumber: string;
    },
    yup.AnyObject,
    {
      email: undefined;
      password: undefined;
      confirmPassword: undefined;
      firstName: undefined;
      lastName: undefined;
      username: undefined;
      role: undefined;
      contactPersonNumber: undefined;
    },
    ''
  >,
  form: {
    email: any;
    password: any;
    confirmPassword: any;
    firstName: any;
    lastName: any;
    username: any;
    contactPerson: any;
    role: any;
    contactPersonNumber: any;
    mobile?: string;
    permissions: [];
  },
  user: any,
  setMerchantSaving: { (value: any): void; (arg0: boolean): void },
  setErrors: any,
  setForm: any,
  navigation: any,
) => {
  schema
    .validate(form)
    .then(async () => {
      setMerchantSaving(true);
      const payload: any = {
        ...form,
        email: form?.email || '',
        password: form?.password || '',
        confirmPassword: form?.confirmPassword || '',
        first_name: form?.firstName || '',
        last_name: form?.lastName || '',
        contactPersonName: form?.contactPerson || '',
        username: form?.username || '',
        screenName: form?.contactPerson || '',
        role: form?.role || '',
        merchant_defined_role: form?.role || '',
        contactPersonPhone: '+' + form?.contactPersonNumber || '',
        mobile: '+' + form?.contactPersonNumber || '',

        user_role_id: 4,
        user_type_id: 4,
        status: 'inactive',

        company_logo: user?.company_logo,
        company_name: user?.company_name,

        permissions: form?.permissions || [],

        merchantId: user?.id,
        merchantEmail: user?.email,
        isSubMerchant: true,
      };

      try {
        const res = await axiosInstance.post<any>(
          'sub-merchants/add',
          payload,
          HEADERS,
        );
        if (res?.data) {
          Toast.show({
            title: 'Sub-Merchant account created successfully.',
          });
          setTimeout(() => {
            Toast.show({
              title:
                'To activate sub-merchant account, a verify link sent to email',
            });
          }, 200);
          setMerchantSaving(false);
          setForm(SUB_MERCHANT_VALUES);
          navigation?.goBack();
        } else {
          setMerchantSaving(false);
          setForm(SUB_MERCHANT_VALUES);
        }
      } catch (e: any) {
        setMerchantSaving(false);
        Toast.show({
          title: e?.response?.data?.message || 'Something went wrong',
        });
      }
    })
    .catch((err: yup.ValidationError) => {
      console.log('error', err);
      setMerchantSaving(false);
      if (!err.path) return;
      setErrors({ [err.path]: err.message });
    });
};

export const editSubMerchantHandler = async (
  schema,
  form: any,
  user: any,
  setMerchantSaving: { (value: any): void; (arg0: boolean): void },
  setErrors: any,
  setForm: any,
  navigation: any,
) => {
  schema
    .validate(form)
    .then(async () => {
      setMerchantSaving(true);

      const payload: any = {
        ...form,
        email: form?.email || '',
        first_name: form?.firstName || '',
        last_name: form?.lastName || '',
        contactPersonName: form?.contactPerson || '',
        username: form?.username || '',
        screenName: form?.contactPerson || '',
        role: form?.role || '',
        merchant_defined_role: form?.role || '',

        contactPersonPhone: '+' + form?.contactPersonNumber || '',
        mobile: '+' + form?.contactPersonNumber || '',

        permissions: form?.permissions || [],

        merchantId: user?.id,
        id: form?.id,
      };
      try {
        const res = await axiosInstance.post<any>(
          'sub-merchants/update',
          payload,
          HEADERS,
        );

        if (res.data) {
          setMerchantSaving(false);
          navigation?.goBack();
          Toast.show({
            title: 'Update sub merchant successfully',
          });
        } else {
          setMerchantSaving(false);
        }
      } catch (e: any) {
        setMerchantSaving(false);
        Toast.show({
          title: e?.response?.data?.message || 'Something went wrong',
        });
      }
    })
    .catch((err: yup.ValidationError) => {
      console.log('error', err);
      setMerchantSaving(false);
      if (!err.path) return;
      setErrors({ [err.path]: err.message });
    });
};

export const fetchRolePermissions = async setUserRoles => {
  try {
    const res = await axiosInstance.post<any>(
      'get-role-permissions',
      {
        role_id: 4,
      },
      HEADERS,
    );
    if (res?.data?.rolePermissions?.rows) {
      setUserRoles(res?.data?.rolePermissions?.rows);
    } else {
      setUserRoles([]);
    }
  } catch (e: any) {
    Toast.show({
      title: e?.response?.data?.message || 'Something went wrong',
    });
  }
};

export const hasMatchingPermissions = (
  userPermissions = '',
  subMerchantPermissions = [],
) =>
  subMerchantPermissions &&
  subMerchantPermissions.length > 0 &&
  subMerchantPermissions.some(
    subMerchantPermission => subMerchantPermission.id === userPermissions,
  );
