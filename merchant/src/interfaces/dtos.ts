import { ParamListBase } from '@react-navigation/native';

export interface IUser {
  company_logo: any;
  createdAt: string;
  updatedAt: string;
  parent_id: number;
  deletedAt: string;
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  uuid: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  street_number: string;
  street_name: string;
  city: string;
  country: string;
  dob: string;
  screenName: string;
  contactPersonName: string;
  contactPersonPhone: string;
  address: string;
  photo: string;
  user_type_id: number;
  status: number;
  web_token: number;
  UserRoles: string[];
}

export interface IAuthUser {
  token: string;
  authUser: IUser;
  userDetail: IUser;
  planType: string;
  role: any;
  allowedPermissions: [];
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignUp {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile: number;
  password: string;
  address: string;
  photo: number;
  user_type_id: number;
  status: number;
  web_token: number;
}

export interface ISignUpResponse {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  address: string;
  photo: string;
  user_type_id: number;
  status: number;
  web_token: number;
}

export interface IRegister {
  // name: string
  email: string;
  password: string;
}

export interface IStepOne {
  firstName: string;
  lastName: string;
  contactPerson: string;
  companyContact: number;
  companyName: string;
}

export interface IStepTwo {
  address: string;
  // streetName: string,
  // city: string,
  // country: string,
  // phone: string
}

interface IMerchantsRow {
  id: number;
  parent_id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  uuid: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  street_number: string;
  street_name: string;
  city: string;
  country: string;
  dob: Date;
  screenName: string;
  contactPersonName: string;
  contactPersonPhone: string;
  address: string;
  photo: string;
  user_type_id: number;
  status: string;
  web_token: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface IMerchants {
  count: number;
  rows: IMerchantsRow[];
}

export interface IMerchantsResponse {
  merchants: IMerchants;
}


//Sign In Types
export interface SignInFormTypes {
  email: string;
  password: string;
  role: string;
  isMerchant: boolean;
}


export interface SignInFormErrorsTypes {
  [key: string]: string;
}

export interface SignInRouteParamsTypes extends ParamListBase {
  SignIn: {
    email?: string;
  };
}

//Settings

export interface SettingsObjectTypes {
  isSwitchOn: boolean;
  settings: Record<string, any>;
  form: {
    taxValue: number;
  };
  merchantSettings: Record<string, any>;
  favorite: string;
  isSettingLoading: boolean;
  isSavingLoading: boolean;
  restaurantStatus: string;
  adminSetting: Record<string, any>;
  openModal: boolean;
  date: Date;
  startDate: Date;
  showStartDatePicker: boolean;
  showCloseDatePicker: boolean;
  isDatePickerVisible: boolean;
  openDeleteModal: {
    open: boolean;
    confirmModal: boolean;
  };
}

export interface DeleteModalPropTypes {
  isConfirmModal?: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface User {
  userDetail: {
    id: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AppState {
  auth: {
    user?: User;
  };
  deleteUser: {
    success: boolean;
  };
}


export interface OpenClosePayloadTypes {
    id: number;
    merchant_id: number;
    status?: 'Open' | 'Close';
    start_time?: Date;
    end_time?: Date
}