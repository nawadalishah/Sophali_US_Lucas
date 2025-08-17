import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../../constants';
import { scaleSize } from '../../../utils/mixins';
import { MOBILE } from '../../../utils/orientation';
import Styles from '../../../utils/styles';

export const useStyles = () =>
  StyleSheet.create({
    contentContainerStyle: {
      flexGrow: 1,
      paddingHorizontal: scaleSize(16),
      paddingTop: SIZES.paddingTop,
      paddingBottom: scaleSize(10),
    },
    buttonContainer: {
      ...Styles.w100,
      ...Styles.pV5,
      ...Styles.flexDirectionRow,
      ...Styles.justifyContentSpaceBetween,
    },
    valueText: {
      color: COLORS.gray,
      ...FONTS.Lato_400Regular,
      fontSize: MOBILE.textSize.common,
    },

    labelText: {
      ...FONTS.Lato_700Bold,
      fontSize: MOBILE.textSize.normal,
      color: COLORS.black,
    },
    textContainer: {
      ...Styles.w100,
      ...Styles.flexDirectionRow,
      ...Styles.justifyContentSpaceBetween,
      ...Styles.alignItemsCenter,
      ...Styles.pV5,
    },

    modalContainer: {
      width: '90%',
      backgroundColor: COLORS.white,
      borderRadius: scaleSize(20),
      ...Styles.pH20,
      ...Styles.pV10,
      ...Styles.alignSelfCenter,
    },
  });
