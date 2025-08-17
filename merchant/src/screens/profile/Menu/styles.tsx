import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants';
import Styles from '../../../utils/styles';
import { scaleSize } from '../../../utils/mixins';
import { MOBILE } from '../../../utils/orientation/index';

export const useStyles = () =>
  StyleSheet.create({
    container: {
      ...Styles.pH15,
      ...Styles.primaryBackground,
    },
    menuContainer: {
      ...Styles.pH10,
      ...Styles.pV5,
      ...Styles.mT5,
      borderColor: COLORS.gray,
      borderWidth: scaleSize(1),
      borderRadius: scaleSize(5),
    },
    listContainer: {
      height: scaleSize(150),
      ...Styles.primaryBackground,
      borderRadius: scaleSize(5),
    },
    menuHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...Styles.pV5,
    },
    listItemStyle: {
      flexDirection: 'row',
      ...Styles.pV10,
      borderBottomWidth: scaleSize(1),
      borderBottomColor: COLORS.gray,
      ...Styles.primaryBackground,
    },
    view5: {
      gap: 20,
      flexDirection: 'row',
    },
    addBtn: {
      height: scaleSize(40),
    },
    btnText: {
      textTransform: 'capitalize',
    },
    catModalStyle: {
      ...Styles.pH10,
      ...Styles.pV15,
      ...Styles.primaryBackground,
      ...Styles.mH15,
      borderRadius: scaleSize(5),
    },
    modalHeading: {
      fontWeight: 'bold',
      fontSize: MOBILE.textSize.mLarge,
      textAlign: 'center',
      ...Styles.mB10,
    },
    modalInput: {
      ...Styles.pH10,
      ...Styles.pV5,
      borderColor: COLORS.gray,
      borderWidth: scaleSize(1),
      borderRadius: scaleSize(5),
      fontSize: MOBILE.textSize.normal,
      ...Styles.mB10,
    },
    image: { ...Styles.mV5, width: scaleSize(150), height: scaleSize(150) },
  });
