import { StyleSheet } from 'react-native';
import { scaleSize } from '../../../utils/mixins/index';
import { COLORS, FONT_FAMILY, WEIGHT, FONTS } from '../../../constants/theme';
import { MOBILE, deviceHeight } from '../../../utils/orientation';
import Styles from '../../../utils/styles/index';

export const useStyles = () =>
  StyleSheet.create({
    textHeader: {
      fontWeight: WEIGHT.w700,
      fontSize: MOBILE.textSize.mSmall,
      fontFamily: FONT_FAMILY.SEMI_BOLD,
      textAlign: 'center',
    },

    textRow: {
      fontWeight: WEIGHT.w400,
      fontSize: MOBILE.textSize.common,
      fontFamily: FONT_FAMILY.REGULAR,
      textAlign: 'center',
      color: COLORS.black,
    },
    textRowRejected: {
      color: COLORS.carrot,
    },
    w25: {
      width: '14%',
    },

    emptyComponent: {
      justifyContent: 'center',
      alignItems: 'center',
      height: deviceHeight / 1.4,
    },
    textAlignLeft: { textAlign: 'left' },
    textAlignRight: { textAlign: 'right' },
    textStyle: {
      ...FONTS.H4,
      fontSize: MOBILE.textSize.large,
      color: COLORS.black,
    },
    headerContainerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: scaleSize(42),
      paddingHorizontal: scaleSize(15),
    },
    goBack: {
      width: '10%',
    },

    listHeaderContainer: {
      ...Styles.w100,
      ...Styles.flexDirectionRow,
      ...Styles.justifyContentSpaceBetween,
      ...Styles.alignContentCenter,
      ...Styles.alignItemsCenter,
      ...Styles.pH15,
      height: scaleSize(40),
      borderBottomWidth: scaleSize(1.5),
      backgroundColor: COLORS.tableHeader,
      borderBottomColor: COLORS.black,
    },

    listItemContainer: {
      ...Styles.w100,
      ...Styles.flexDirectionRow,
      ...Styles.pH15,
      ...Styles.alignContentCenter,
      ...Styles.alignItemsCenter,
      ...Styles.justifyContentSpaceBetween,
      ...Styles.pV5,
      //   height: scaleSize(30),
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 2,
      borderBottomColor: 'black',
      paddingVertical: 10,
      backgroundColor: 'lightgrey',
    },
    headerCell: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
    },

    evenRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
      paddingVertical: 10,
      backgroundColor: 'white',
    },
    oddRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
      paddingVertical: 10,
      backgroundColor: '#f9f9f9',
    },
    cell: {
      flex: 1,
      textAlign: 'center',
    },
    headerCellDouble: {
      flex: 2,
      fontWeight: 'bold',
    },
    headerCellTriple: {
      flex: 3,
      fontWeight: 'bold',
    },
    cellWrapperDouble: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    cellWrapperTriple: {
      flex: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff',
      // flexDirection: 'column',
    },
    selectContainer: {
      width: '100%',
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    submitButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    container: {
      flex: 1,
      padding: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    col: {
      width: '25%', // Assuming 4 columns
    },
    strong: {
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 15,
      paddingBottom: 10,
    },
    button: {
      padding: 10,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: COLORS.customButton,
    },
    buttonText: {
      color: 'white',
    },
    orderSummary: {
      paddingHorizontal: 10,
      marginVertical: 10,
      backgroundColor: 'lightgrey',
      paddingVertical: 15,
      borderBottomColor: 'black',
      borderBottomWidth: 2,
    },
    orderSummaryContent: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
    },
    searchBar: {
      paddingHorizontal: 20,
      marginVertical: 20,
    },
    mainView: {
      flex: 1,
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
    subView1: {
      flexDirection: 'row',
    },
    subView1_2: {
      flex: 1,
      gap: 2,
    },
    subView2: {
      marginTop: 20,
    },
    dotLine: {
      borderColor: 'black',
      borderBottomWidth: 1,
      borderStyle: 'dotted',
      marginVertical: 25,
    },
    hrline: {
      borderColor: 'black',
      borderBottomWidth: 1,
      // height: 1,
      borderStyle: 'solid',
      marginVertical: 25,
    },
    header: {
      borderRadius: 5,
      backgroundColor: 'cadetblue',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginVertical: 15,
    },
    renderitem: {
      borderRadius: 5,
      // backgroundColor: 'cadetblue',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 10,
      // marginVertical: 15
    },
    heading: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    text_: {
      fontSize: 11,
    },
    renderPrices: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    billtitle: {
      gap: 10,
    },
    billamount: {
      gap: 10,
    },
    closeBtn: {
      marginVertical: 20,
      backgroundColor: COLORS.green,
      paddingVertical: 15,
      borderRadius: 50,
    },
    closeBtnBtn: {
      alignItems: 'center',
    },
  });
