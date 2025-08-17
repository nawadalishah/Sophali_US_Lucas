import { TextInput, View } from 'react-native';
import React from 'react';
import { COLORS, Text } from '../constants';
import { scaleSize } from '../utils/mixins';
import Styles from '../utils/styles';
import { MOBILE } from '../utils/orientation';
import { FONT_FAMILY, WEIGHT } from '../constants/theme';

const InputField = React.forwardRef((props, ref) => {
  const {
    placeholder,
    containerStyle,
    icon,
    title = '',
    secureTextEntry,
    onchange,
    value,
    keyboardType = 'default',
    editable = true,
    placeholderTextColor,
    placeholderColor,
    titleColor,
    textColor,
    fontSize,
    autoCapitalize,
    autoCorrect,
    autoCompleteType,
    returnKeyType,
    maxLength,
    error,
    defaultValue,
    multiline = false,
    titleStyle,
  } = props;

  return (
    <View
      style={{
        width: '100%',
        height: scaleSize(50),
        opacity: editable ? 1 : 0.6,
        ...containerStyle,
      }}>
      {title && (
        <Text
          size={MOBILE.textSize.normal}
          weight={WEIGHT.w600}
          fontFamily={FONT_FAMILY.SEMI_BOLD}
          style={{
            marginBottom: scaleSize(2),
            color: titleColor || COLORS.black,
            ...Styles.textTransformCap,
            ...titleStyle,
          }}>
          {title}
        </Text>
      )}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: scaleSize(1),
            borderBottomColor: error ? COLORS.red : COLORS.lightGray,
          },
          Styles.w100,
        ]}>
        <TextInput
          {...props}
          ref={ref}
          defaultValue={defaultValue}
          placeholder={placeholder}
          style={{
            flex: 1,
            paddingRight: scaleSize(15),
            paddingVertical: scaleSize(4),
            fontSize: fontSize || MOBILE.textSize.medium,
            fontFamily: FONT_FAMILY.REGULAR,
            color: textColor || COLORS.black,
          }}
          keyboardType={keyboardType}
          placeholderTextColor={
            placeholderColor || placeholderTextColor || COLORS.gray
          }
          secureTextEntry={secureTextEntry}
          onChangeText={onchange}
          value={value}
          editable={editable}
          blurOnSubmit={false}
          cursorColor={COLORS.cursorColor}
          selectionColor={COLORS.cursorColor}
          underlineColorAndroid={COLORS.transparent}
          allowFontScaling
          autoCapitalize={autoCapitalize || 'none'}
          autoCorrect={autoCorrect || false}
          autoCompleteType={autoCompleteType || 'none'}
          returnKeyType={returnKeyType || 'default'}
          maxLength={maxLength || 40}
          multiline={multiline}
        />
        {icon && icon}
      </View>
    </View>
  );
});
InputField.displayName = 'InputField';
export default InputField;
