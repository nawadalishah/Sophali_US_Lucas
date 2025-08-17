import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { FONTS, COLORS, Text } from '../constants';
import { ArrowSvg } from '../svg';
import { HIT_SLOP } from '../constants/theme';
import { scaleSize } from '../utils/mixins';
import { MOBILE } from '../utils/orientation';
import Styles from '../utils/styles';

const Header = ({
  goBack = true,
  onPress = () => {},
  title = '',
  titleStyle,
  subTitle = '',
  subTitleStyle,
  containerStyle,
}: any) => (
  <View style={[styles.headerContainerStyle, containerStyle]}>
    {goBack && (
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={HIT_SLOP.FIFTEEN}
        style={[styles.goBack]}
        onPress={onPress}>
        <ArrowSvg />
      </TouchableOpacity>
    )}

    <View
      style={[
        Styles.w100,
        Styles.flexDirectionColumn,
        Styles.justifyContentCenter,
        Styles.alignItemsCenter,
      ]}>
      {title && <Text style={[styles.textStyle, titleStyle]}>{title}</Text>}
      {subTitle && (
        <Text style={[styles.subTitleStyle, subTitleStyle]}>{subTitle}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  textStyle: {
    ...FONTS.H4,
    fontSize: MOBILE.textSize.large,
    color: COLORS.black,
    textTransform: 'capitalize',
    lineHeight: MOBILE.textSize.large * 1.4,
  },
  subTitleStyle: {
    fontSize: MOBILE.textSize.normal,
    color: COLORS.black,
    ...Styles.pV5,
    textTransform: 'none',
  },
  headerContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(50),
  },
  goBack: {
    position: 'absolute',
    left: 0,
    padding: scaleSize(10),
    zIndex: 1,
  },
});
export default Header;
