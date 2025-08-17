import { Dimensions, Platform } from 'react-native';
import { scaleFont, scaleSize } from '../mixins';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;
export const deviceAspectRatio = deviceWidth / deviceHeight;

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  (deviceHeight >= 812 ||
    deviceWidth >= 812 ||
    deviceHeight >= 896 ||
    deviceWidth >= 896);
export const IS_PAD = IS_IOS;
export const getActionBarHeight = () => {
  if (IS_IPHONE_X) {
    return 80;
  }
  if (IS_IOS) {
    return 50;
  }
  return 30;
};

export const getFixedHeaderHeight = () => {
  if (IS_IPHONE_X) {
    return 80;
  }
  if (IS_IOS) {
    return 80;
  }
  return 50;
};
export function isLandscape() {
  const { width, height } = Dimensions.get('window');
  return width > height;
}

export const getPageHeight = (extra = 0) =>
  deviceHeight - getFixedHeaderHeight() - 125 - extra;

export const MOBILE = {
  weight: {
    bold: '600',
    semi_bold: '500',
    regular: '400',
  },
  textSize: {
    xxsSmall: scaleFont(8),
    xxSmall: scaleFont(10),
    xSmall: scaleFont(11),
    common: scaleFont(12),
    mxSmall: scaleFont(12.5),
    mSmall: scaleFont(13),
    small: scaleFont(13.5),
    normal: scaleFont(14),
    medium: scaleFont(16),
    large: scaleFont(17),
    xLarge: scaleFont(19),
    mLarge: scaleFont(20),
    vLarge: scaleFont(21),
    xxlarge: scaleFont(36),
  },
  headingSize: {
    heading1: scaleFont(27),
    heading2: scaleFont(15),
    heading3: scaleFont(22),
    heading4: scaleFont(27),
    heading5: scaleFont(25),
  },

  fieldSize: scaleSize(65),
  fieldSizeMedium: scaleSize(60),
  fieldSizeSmall: scaleSize(50),

  iconSize: {
    xxLarge: scaleSize(40),
    xLarge: scaleSize(30),
    VLarge: scaleSize(26),
    large: scaleSize(24),
    mmLarge: scaleSize(23),
    mLarge: scaleSize(22),
    common: scaleSize(20),
    vMedium: scaleSize(18),
    medium: scaleSize(17),
    small: scaleSize(15),
    vmSmall: scaleSize(13.5),
    vSmall: scaleSize(11.25),
    vvSmall: scaleSize(12.25),
    xSmall: scaleSize(10),
    smallest: scaleSize(6),
  },

  spinner: {
    xsmall: scaleSize(20),
    small: scaleSize(30),
    large: scaleSize(40),
  },
};
