import { Text, TextInput, View } from 'react-native';
import React from 'react';

import { COLORS, FONTS } from '../constants';

export default function InputFieldArea({
  placeholder,
  containerStyle,
  icon,
  title,
  secureTextEntry,
  onchange,
  value,
}: any) {
  return (
    <View
      style={{
        width: '100%',
        height: 53,
        ...containerStyle,
      }}>
      <Text
        style={{
          marginBottom: 2,
          textTransform: 'uppercase',
          color: COLORS.black,
          fontSize: 12,
          lineHeight: 12 * 1,
          ...FONTS.fieldLabel,
        }}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: COLORS.lightGray,
        }}>
        <TextInput
          placeholder={placeholder}
          style={{
            flex: 1,
            paddingRight: 15,
            paddingVertical: 4,
            fontSize: 15,
            fontFamily: 'Lato-Regular',
          }}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={secureTextEntry}
          onChangeText={onchange}
          value={value}
          multiline
        />
        {icon && icon}
      </View>
    </View>
  );
}
