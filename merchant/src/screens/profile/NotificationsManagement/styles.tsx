import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants';
import { deviceHeight, deviceWidth } from '../../../utils/orientation';
import Styles from '../../../utils/styles';
import { scaleSize } from '../../../utils/mixins';

export const useStyles = () =>
  StyleSheet.create({
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderWidth: 1,
      borderRadius: 5,
    },
    unreadContainer: {
      // backgroundColor: 'green',
      height: '43%',
      // ...Styles.pV20,
    },
    readContainer: {
      height: deviceHeight / 2 - 135,
    },
    subNotificationContainer: {
      backgroundColor: COLORS.white,
      flex: 1,
      // paddingHorizontal: 20,
    },
    unreadlist: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: COLORS.white,
      borderRadius: 10,
      marginTop: 5,
      elevation: 1.5,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      borderColor: COLORS.gray,
      borderWidth: 0.4,
    },
    readlist: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: COLORS.white,
      borderRadius: 15,
      marginVertical: 5,
    },
    unreadListDate: {
      textAlign: 'right',
    },
    hrline: {
      backgroundColor: COLORS.gray,
      height: 5,
      width: deviceWidth - 40,
      marginVertical: scaleSize(5),
      borderRadius: scaleSize(5),
    },
    row: { width: scaleSize(25), alignSelf: 'flex-end' },
    modalContainer: {
      ...Styles.primaryBackground,
      height: deviceHeight / 2.8,
      borderRadius: scaleSize(10),
      ...Styles.mH20,
      ...Styles.pH20,
    },
    closeBtn: {
      backgroundColor: COLORS.carrot,
      width: scaleSize(20),
      height: scaleSize(20),
      borderRadius: scaleSize(10),
      position: 'absolute',
      top: scaleSize(10),
      right: scaleSize(10),
      ...Styles.justifyContentCenter,
      ...Styles.alignItemsCenter,
    },
  });
