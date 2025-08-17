import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export const isBronzePlan = (planType: string): boolean =>
  planType === 'Bronze Plan';

export const isSilverPlan = (planType: string): boolean =>
  planType === 'Silver Plan';

export const isGoldPlan = (planType: string): boolean =>
  planType === 'Gold Plan';

export const isCouponAllowed = (permissions = []): boolean =>
  !!permissions.length && permissions.some(i => i.name === 'Coupon Management');

export const isMenuAllowed = (permissions = []): boolean =>
  !!permissions.length && permissions.some(i => i.name === 'Menu');

export const isMerchantOrderAllowed = (permissions = []): boolean =>
  !!permissions.length && permissions.some(i => i.name === 'KOB');

export const isSubMerchant = (role: string): boolean => role === 'Sub Merchant';

export const HEADERS = {
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
};

export const FORMDATAHEADERS = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const convertDate = (date: string) => {
  if (date) {
    return moment(date).format('MMM Do YYYY');
  }
};

export const convertTime = (date: string) => {
  if (date) {
    const newDate = moment(date);
    const formattedTime = newDate.format('hh:mm A');
    return formattedTime;
  }
};

export const formatDate = (dateString: any) =>
  moment(dateString).format('ddd MMM DD YYYY');

export const getRole = async () => {
  try {
    const role = await AsyncStorage.getItem('role');
    return JSON.parse(role as string);
  } catch (error: any) {
    console.log('Error getting Role:', error);
    return null;
  }
};


export function getFullDayStart() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}