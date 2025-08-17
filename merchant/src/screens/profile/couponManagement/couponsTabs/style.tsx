import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../../../constants';
import { scaleFont, scaleSize } from '../../../../utils/mixins';
import { MOBILE, deviceWidth } from '../../../../utils/orientation';
import { WEIGHT } from '../../../../constants/theme';

export const useStyles = () =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: COLORS.lightGray,
      borderBottomColor: 'black',
      // borderBottomWidth: 2,
      paddingVertical: scaleSize(8),
      paddingHorizontal: 7,
      alignItems: 'center',

      // width: '100%',
    },

    dateTimeField: {
      marginBottom: scaleSize(20),
      borderWidth: scaleSize(1),
      borderColor: COLORS.lightGray,
      borderRadius: scaleSize(3.5),
      paddingHorizontal: scaleSize(5),
      paddingVertical: scaleSize(10),
    },
    dateTimeText: {
      color: COLORS.gray,
      paddingRight: scaleSize(10),
    },

    headerRowText: {
      fontWeight: 'bold',
      fontSize: scaleFont(15),
      width: '15%',
      textAlign: 'center',

      // width: deviceWidth / 7.5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 7,
      paddingVertical: scaleSize(8),
      width: '100%',
      alignItems: 'center',
    },
    col: {
      width: '15%',
      textAlign: 'center',

      // width: deviceWidth / 7.5,
    },
    viewButton: {
      backgroundColor: COLORS.green,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 50,
    },
    delBtn: {
      backgroundColor: COLORS.carrot,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 50,
    },
    btnText: {
      color: 'white',
    },
    centeredView: {
      flex: 1,
      backgroundColor: 'white',
    },
    contentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    conrentRowHeading: {
      fontWeight: 'bold',
    },
    headerTabs: {
      width: '100%',
      paddingHorizontal: 10,
      justifyContent: 'center',
      marginVertical: 10,
    },
    coupontableHeading: {
      ...FONTS.H3,
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    tablefooter: {
      backgroundColor: 'black',
      height: 1,
    },
    priceView: {
      paddingVertical: 15,
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
    productheaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: COLORS.lightGray,
      marginVertical: 5,
      alignItems: 'center',
      borderRadius: 5,
      // padding: 10,
      paddingVertical: 10,
    },
    productheaderRowText: {
      // ...FONTS.H4,
      fontSize: MOBILE.textSize.normal,
      fontWeight: WEIGHT.w600,
    },
    productcontentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      // padding: 10,
      paddingVertical: 10,
      width: '100%',
      alignItems: 'center',
    },
    deleteBtn: {
      backgroundColor: COLORS.green,
      // paddingHorizontal: 5,
      paddingVertical: 4,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      width: deviceWidth * 0.15,
      marginLeft: 10,
    },
    productdelbtnText: {
      color: 'white',
      fontSize: 10,
    },
    qantityBtn: {
      flexDirection: 'row',
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    incrementBtn: {
      backgroundColor: COLORS.lightGray,
      // padding: 5,
      borderRadius: 100,
      height: 25,
      width: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    countText: {
      height: 25,
      width: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowWidth: {
      width: '20%',
      textAlign: 'center',
    },
  });
