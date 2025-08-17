import { StyleSheet } from 'react-native';
import Styles from '../../utils/styles';
import { COLORS } from '../../constants';
import { FONT_FAMILY, WEIGHT } from '../../constants/theme';
import { MOBILE } from '../../utils/orientation';
import { scaleFont, scaleSize } from '../../utils/mixins';

export const useStyles = () =>
  StyleSheet.create({
    contentContainerStyle: {
      flexGrow: 1,
      ...Styles.w100,
      ...Styles.pH20,
    },
    btnTextStyle: {
      color: COLORS.black,
      textTransform: 'none',
      fontWeight: WEIGHT.w600,
      fontFamily: FONT_FAMILY.SEMI_BOLD,
    },

    labelStyle: {
      fontSize: MOBILE.textSize.normal,
      fontWeight: WEIGHT.w600,
      fontFamily: FONT_FAMILY.SEMI_BOLD,
      marginBottom: scaleSize(5),
      color: COLORS.black,
      ...Styles.textTransformCap,
    },
    valueStyle: {
      fontSize: MOBILE.textSize.medium,
      fontFamily: FONT_FAMILY.REGULAR,
      color: COLORS.black,
    },
    phoneInputStyle: {
      fontSize: MOBILE.textSize.medium,
      fontFamily: FONT_FAMILY.REGULAR,
      color: COLORS.black,
      paddingVertical: scaleSize(5),
    },
    phoneInputContainer: {
      ...Styles.w100,
      ...Styles.pB5,
      borderBottomWidth: scaleSize(1),
      borderBottomColor: COLORS.lightGray,
    },

    logoContainer: {
      borderWidth: scaleSize(1),
      borderRadius: scaleSize(5),
      borderColor: COLORS.lightGray,
      ...Styles.justifyContentCenter,
      ...Styles.alignItemsCenter,
      ...Styles.w100,
      height: scaleSize(45),
      borderStyle: 'dashed',
    },

    logoStyle: {
      ...Styles.mV10,
      ...Styles.w100,
      aspectRatio: 1,
      borderRadius: scaleSize(5),
    },

    closeIconStyle: {
      position: 'absolute',
      top: scaleSize(60),
      right: scaleSize(15),
    },

    cell: {
      width: scaleSize(60),
      height: scaleSize(60),
      borderRadius: scaleSize(5),
      borderWidth: scaleSize(1),
      borderColor: COLORS.cursorColor,
      textAlignVertical: 'top',
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingCell: {
      height: scaleSize(60),
    },
    textCell: {
      fontSize: scaleFont(18),
      fontWeight: WEIGHT.w500,
    },
    filledCell: {
      borderColor: COLORS.cursorColor,
      backgroundColor: COLORS.blue,
    },
    errorCel: {
      borderColor: COLORS.carrot,
      backgroundColor: COLORS.tickerWarningTimeColor,
    },
    simpleText: {
      fontFamily: FONT_FAMILY.REGULAR,
      fontSize: MOBILE.textSize.common,
      // lineHeight: MOBILE.textSize.normal,
      fontWeight: WEIGHT.w400,
      textAlign: 'justify',
    },
    boldText: {
      fontFamily: FONT_FAMILY.SEMI_BOLD,
      fontSize: MOBILE.textSize.common,
      textAlign: 'justify',
      // lineHeight: MOBILE.textSize.normal,
      fontWeight: WEIGHT.w800,
    },
    underLineText: {
      fontFamily: FONT_FAMILY.REGULAR,
      fontSize: MOBILE.textSize.common,
      textAlign: 'justify',
      // lineHeight: MOBILE.textSize.normal,
      fontWeight: WEIGHT.w400,
      textDecorationLine: 'underline',
    },
    dotStyle: {
      width: scaleSize(6),
      height: scaleSize(6),
      borderRadius: scaleSize(6),
      backgroundColor: COLORS.black,
      ...Styles.mT5,
    },
    scrollButton: {
      position: 'absolute',
      bottom: scaleSize(2),
      backgroundColor: COLORS.gray,
      alignSelf: 'center',
    },
  });
