/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { MOBILE } from '../utils/orientation';
import { COLORS, FONT_FAMILY, WEIGHT } from '../constants/theme';
import { scaleSize } from '../utils/mixins';
import Styles from '../utils/styles';
import { Text } from '../constants';

interface TitleProps {
  title: string;
  subTitle?: string;
}

const TitleText: React.FC<TitleProps> = ({ title, subTitle }) => (
  <View style={[Styles.w100, Styles.flexDirectionRow]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={[{ color: COLORS.gray }]}>{subTitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  title: {
    fontSize: MOBILE.textSize.normal,
    fontWeight: WEIGHT.w600 as TextStyle['fontWeight'],
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    marginBottom: scaleSize(5),
    color: COLORS.black,
    ...Styles.textTransformCap,
  },
});

export default TitleText;
