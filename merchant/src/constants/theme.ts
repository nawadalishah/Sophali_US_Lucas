import { Dimensions } from 'react-native';
import { Platform, StatusBar } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  green: '#00824B',
  white: '#FFFFFF',
  lightBlue: '#F3F7FF',
  black: '#222222',
  gray: '#7D849A',
  lightGray: '#E2E2E2',
  carrot: '#FD5252',
  blue: '#1a9ef0',
  customButton: '#6ac8c7',
  customButtonDisable: '#75c7c6',
  tickerWarningTimeColor: '#ff705d',
  tickerPreparingTimeColor: '#fffc69',
  preparingOrder: '#68ac5f',
  warning: 'gold',
  danger: '#E94A58',
  darkPrimary: '#2C2646',
  primary: '#00824B',
  mediumPrimary: '#ece0f5',
  lightPrimary: '#F4EEF8',
  secondary: '#1836B2',
  mediumSecondary: '#E6E6E6',
  red: '#FD5252',
  blackOverlay: 'rgba(0,0,0,0.6)',
  transparent: 'transparent',
  transparentWhite1: 'rgba(255, 255, 255, 0.1)',
  shadowStartColor: 'rgb(196,196,196, 0.08)',
  shadowFinalColor: 'rgb(255, 255, 255, 0.08)',
  navigationLightColor: '#EFF0F3',
  shadowDistance: 12,
  tabLightColor: '#999999',
  orange: '#FF6633',
  blueDark: '#000066',
  purple: '#660066',
  blueLight: '#6666FF',
  tableHeader: '#D9D9D9',
  activeTab: '#08822A',
  tabTextColor: '#808692',
  filterButton: '#514672',
  skyBlue: '#0B97FF',
  redShade: '#FF0000',
  orangeShade: '#ED6C02',
  reddish: '#5A0606',
  cursorColor: '#33ACF5',
};
export const SIZES = {
  width,
  height,
  paddingTop: height * 0.12,
};
export const FONTS = {
  H1: { fontSize: 40, fontFamily: 'Lato-Bold' },
  H2: { fontSize: 28, fontFamily: 'Lato-Bold' },
  H3: { fontSize: 22, fontFamily: 'Lato-Bold' },
  H5: { fontSize: 20, fontFamily: 'Lato-Bold' },
  H4: { fontSize: 16, fontFamily: 'Lato-Bold' },
  MYFONTSIZE: { fontSize: 16, fontFamily: 'Lato-Bold' },

  Lato_400Regular: { fontFamily: 'Lato-Regular' },
  Lato_700Bold: { fontFamily: 'Lato-Bold' },
  Lato_900Black: { fontFamily: 'Lato-Black' },

  bodyText: { fontSize: 16, fontFamily: 'Lato-Regular' },
  fieldLabel: { fontSize: 12, fontFamily: 'Lato-Regular' },
};

export const AndroidSafeArea = {
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
};

export const HIDE_HEADER = { headerShown: false };
export const FONT_FAMILY = {
  BOLD: 'Lato-Bold',
  SEMI_BOLD: 'Lato-SemiBold',
  REGULAR: 'Lato-Regular',
  LIGHT: 'Lato-Light',
};

export const MODAL_ANIMATION = {
  IN: 'slideInRight',
  OUT: 'slideOutRight',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  DOWN: 'down',
  SLIDE_IN_UP: 'slideInUp',
  SLIDE_IN_DOWN: 'slideInDown',
  SWIPE_DIRECTION_DOWN: 'down',
  SWIPE_DIRECTION_RIGHT: 'right',
  SWIPE_DIRECTION_LEFT: 'left',
  SLIDE_IN_RIGHT: 'slideInRight',
  SLIDE_OUT_RIGHT: 'slideOutRight',
  SLIDE_OUT_LEFT: 'slideOutLeft',
  SLIDE_OUT_DOWN: 'slideOutDown',
};

export const PERSIST_TAPS = {
  ALWAYS: 'always',
  HANDLED: 'handled',
  NONE: 'none',
};
export const EVENT_LISTENER = {
  KEYBOARD_DID_HIDE: 'keyboardDidHide',
  HARDWARE_BACK_PRESS: 'hardwareBackPress',
  CHANGE: 'change',
};

export const CAPITALIZE = {
  NONE: 'none',
  WORDS: 'words',
  SENTENCES: 'sentences',
  CHARACTERS: 'characters',
};

export const RETURN_TYPE = {
  NEXT: 'next',
  DEFAULT: 'default',
  DONE: 'done',
  SEARCH: 'search',
};

export const WEIGHT = {
  w300: '300',
  w400: '400',
  w500: '500',
  w600: '600',
  w700: '700',
  w800: '800',
};

export const ALIGNMENT = {
  CENTER: 'center',
  RIGHT: 'right',
  LEFT: 'left',
  TOP: 'top',
  BOTTOM: 'bottom',
};

export const RESIZE_MODE = {
  CONTAIN: 'contain',
  STRETCH: 'stretch',
  COVER: 'cover',
};

export const FORCE_INSETS = { top: 'always', bottom: 'always' };
export const HIT_SLOP = {
  FIFTEEN: { top: 15, bottom: 15, left: 15, right: 15 },
  TWENTY: { top: 20, bottom: 20, left: 20, right: 20 },
  TWENTY_FIFTY: { top: 20, bottom: 20, left: 50, right: 50 },
  TEN_EIGHT: { top: 10, bottom: 10, left: 8, right: 8 },
  FIFTEEN_FIVE: { top: 15, bottom: 15, left: 15, right: 5 },
  FIVE: { top: 5, bottom: 5, left: 5, right: 5 },
  RIGHT_ZERO: { top: 20, bottom: 20, left: 20, right: 0 },
};
