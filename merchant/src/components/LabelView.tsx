import { View } from 'react-native';
import React from 'react';
import Styles from '../utils/styles';
import { COLORS, FONTS, Text } from '../constants';
import { MOBILE } from '../utils/orientation';

const LabelView = ({
  label = '',
  value = '',
  labelStyle = {},
  containerStyle = {},
  valueStyle = {},
}) => (
  <View
    style={[
      Styles.w100,
      Styles.alignItemsCenter,
      Styles.justifyContentSpaceBetween,
      Styles.flexDirectionRow,
      Styles.pV10,
      containerStyle,
    ]}>
    <Text
      style={[
        {
          ...FONTS.Lato_700Bold,
          fontSize: MOBILE.textSize.normal,
          color: COLORS.black,
        },
        labelStyle,
      ]}
      lines={1}>
      {label}
    </Text>
    <Text
      style={[
        {
          color: COLORS.gray,
          ...FONTS.Lato_400Regular,
          fontSize: MOBILE.textSize.common,
        },
        valueStyle,
      ]}>
      {value}
    </Text>
  </View>
);

export default LabelView;
