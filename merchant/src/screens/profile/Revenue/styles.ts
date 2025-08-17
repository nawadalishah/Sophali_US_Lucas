import { StyleSheet } from 'react-native';
import { scaleSize } from '../../../utils/mixins/index';
import { COLORS, FONT_FAMILY, WEIGHT } from '../../../constants/theme';
import { MOBILE } from '../../../utils/orientation';
import Styles from '../../../utils/styles/index';

export const useStyles = () =>
  StyleSheet.create({
    textHeader: {
      fontWeight: WEIGHT.w700,
      fontSize: MOBILE.textSize.normal,
      fontFamily: FONT_FAMILY.SEMI_BOLD,
      textAlign: 'center',
    },

    textRow: {
      fontWeight: WEIGHT.w400,
      fontSize: MOBILE.textSize.mxSmall,
      fontFamily: FONT_FAMILY.REGULAR,
      textAlign: 'center',
      color: COLORS.black,
    },
    textRowRejected: {
      color: COLORS.carrot,
    },
    w25: {
      width: '25%',
    },
    tabButton: {
      height: scaleSize(25),
      width: scaleSize(75),
      backgroundColor: COLORS.lightBlue,
      ...Styles.justifyContentCenter,
      ...Styles.alignItemsCenter,
      borderRadius: scaleSize(15),
      elevation: 3.5,
    },
    tabButtonActive: {
      height: scaleSize(25),
      width: scaleSize(75),
      backgroundColor: COLORS.green,
      ...Styles.justifyContentCenter,
      ...Styles.alignItemsCenter,
      borderRadius: scaleSize(15),
      elevation: 3.5,
    },
    filterButton: {
      height: scaleSize(25),
      width: scaleSize(75),
      backgroundColor: COLORS.filterButton,
      ...Styles.justifyContentCenter,
      ...Styles.alignItemsCenter,
      borderRadius: scaleSize(15),
      elevation: 3.5,
    },
    emptyComponent: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '50%',
    },
    textAlignLeft: { textAlign: 'left' },
    textAlignRight: { textAlign: 'right' },
    earningsCard: {
      height: scaleSize(40),
      borderWidth: scaleSize(1),
      borderRadius: scaleSize(5),
      borderColor: COLORS.green,
      backgroundColor: COLORS.lightBlue,
      ...Styles.flexDirectionRow,
      ...Styles.justifyContentCenter,
      ...Styles.pH10,
      ...Styles.alignItemsCenter,
      width: scaleSize(120),
      elevation: 3.5,
    },
    dateField: {
      ...Styles.primaryBackground,
      ...Styles.h100,
      ...Styles.justifyContentCenter,
      ...Styles.alignItemsCenter,
      ...Styles.pH5,
      borderWidth: scaleSize(1),
      borderColor: COLORS.tableHeader,
      borderRadius: scaleSize(5),
    },
    dateContainer: {
      ...Styles.w100,
      ...Styles.pH15,
      ...Styles.flexDirectionRow,
      ...Styles.justifyContentSpaceBetween,
      ...Styles.alignItemsCenter,
      ...Styles.pB5,
    },
    dateFieldContainer: {
      height: scaleSize(30),
      ...Styles.flexDirectionRow,
      ...Styles.alignItemsCenter,
    },
    dailyContainer: {
      ...Styles.w100,
      ...Styles.flexDirectionRow,
      ...Styles.pB10,
      ...Styles.pT5,
      ...Styles.justifyContentSpaceBetween,
      ...Styles.alignItemsCenter,
      ...Styles.pH20,
    },
    listHeaderContainer: {
      ...Styles.w100,
      ...Styles.flexDirectionRow,
      ...Styles.justifyContentSpaceBetween,
      ...Styles.alignContentCenter,
      ...Styles.alignItemsCenter,
      ...Styles.pH20,
      height: scaleSize(40),
      borderBottomWidth: scaleSize(1.5),
      backgroundColor: COLORS.tableHeader,
      borderBottomColor: COLORS.black,
    },

    listItemContainer: {
      ...Styles.w100,
      ...Styles.flexDirectionRow,
      ...Styles.pH20,
      ...Styles.alignContentCenter,
      ...Styles.alignItemsCenter,
      height: scaleSize(30),
    },
    earningContainer: {
      ...Styles.w100,
      ...Styles.pH20,
      ...Styles.alignItemsCenter,
      ...Styles.pV10,
      ...Styles.flexDirectionRow,
      ...Styles.justifyContentSpaceBetween,
    },
    earningInfo: {
      ...Styles.flexDirectionColumn,
      ...Styles.alignItemsCenter,
      ...Styles.pL5,
    },
  });
