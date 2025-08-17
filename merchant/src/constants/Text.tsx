import React, { ReactNode, FC } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { COLORS, FONT_FAMILY } from './theme';
import { scaleFont } from '../utils/mixins';

interface RawTextProps extends TextProps {
  size?: number;
  color?: string;
  style?: TextStyle;
  children: ReactNode;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  fontFamily?: string;
  lines?: number;
  weight?: string;
  onPress?: () => void;
}

const RawText: FC<RawTextProps> = ({
  size = scaleFont(14),
  color = '',
  style = {},
  children,
  ellipsizeMode = 'tail',
  fontFamily = FONT_FAMILY.REGULAR,
  lines = 100,
  weight = '400',
  onPress,
  ...rest
}) => {
  const textStyle: TextStyle = {
    color: color || COLORS.black,
    fontSize: size,
    fontFamily,
    fontWeight: weight || '400',
  };

  return (
    <Text
      {...rest}
      allowFontScaling
      ellipsizeMode={ellipsizeMode}
      numberOfLines={lines}
      style={[textStyle, style]}
      onPress={onPress}>
      {children}
    </Text>
  );
};

export default RawText;
