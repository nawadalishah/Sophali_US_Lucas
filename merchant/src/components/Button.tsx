import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { COLORS, FONT_FAMILY } from '../constants/theme';
import { Spinner } from 'native-base';
import { MOBILE } from '../utils/orientation/index';
import Styles from '../utils/styles/index';
import Text from '../constants/Text';
import { scaleSize } from '../utils/mixins';
import { StyleSheet } from 'react-native';

const Button = ({
  title,
  containerStyle,
  onPress,
  textStyle,
  disabled,
  textColor = COLORS.white,
  isLoading = false,
}: any) => (
  <TouchableOpacity
    activeOpacity={0.7}
    disabled={disabled || isLoading}
    onPress={onPress}
    style={[
      styles.buttonContainer,
      containerStyle,
      disabled && styles.opacity,
    ]}>
    {isLoading ? (
      <View style={Styles.flexCenter}>
        <Spinner color={COLORS.white} />
      </View>
    ) : (
      <Text
        size={MOBILE.textSize.normal}
        fontFamily={FONT_FAMILY.REGULAR}
        color={textColor}
        style={[styles.buttonText, textStyle]}>
        {title}
      </Text>
    )}
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    borderRadius: scaleSize(25),
    ...Styles.justifyContentCenter,
    ...Styles.alignItemsCenter,
    height: scaleSize(50),
    backgroundColor: COLORS.green,
    elevation: 1,
  },
  buttonText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    textAlignVertical: 'center',
    fontFamily: FONT_FAMILY.REGULAR,
  },
  opacity: {
    opacity: 0.5,
  },
});

export default Button;
