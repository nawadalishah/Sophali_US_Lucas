import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants';
import { scaleSize } from '../../../utils/mixins';

export const useStyles = () =>
  StyleSheet.create({
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
  });
