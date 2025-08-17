import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { scaleSize } from '../utils/mixins/index';
import { COLORS } from '../constants';
import { MOBILE } from '../utils/orientation';
import Styles from '../utils/styles';

interface SubheadingProps {
  text: string;
  count: string;
}

interface CardProps {
  image: any;
  title: string;
  screen: string;
  subheadings: SubheadingProps[];
  disabled?: boolean;
}
const CardMainPage: React.FC<CardProps> = ({
  image,
  title,
  subheadings,
  screen,
  disabled,
}) => {
  const navigation = useNavigation();

  function ScreenNavigator(screens: string) {
    navigation.dispatch(
      CommonActions.navigate({
        name: screens,
      }),
    );
  }
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      onPress={() => ScreenNavigator(screen ? screen : '')}
      style={[styles.cardContainer, disabled && { opacity: 0.7 }]}>
      <View style={styles.imageContainer}>{image}</View>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.subheadingsContainer}>
          {subheadings.map((subheading, index) => (
            <View key={index} style={styles.subheadingContainer}>
              <Text style={styles.count}>{subheading.count}</Text>
              <Text style={styles.subheading}>{subheading.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        disabled={disabled}
        style={styles.arrowContainer}
        activeOpacity={0.7}
        onPress={() => ScreenNavigator(screen ? screen : '')}>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={MOBILE.iconSize.VLarge}
          color="black"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContainer: {
    alignItems: 'center',
    ...Styles.pH15,
    ...Styles.w100,
    marginTop: scaleSize(5),
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: scaleSize(5),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: scaleSize(70),
  },
  image: {
    width: scaleSize(100),
    height: scaleSize(100),
    borderRadius: scaleSize(10),
  },
  textContainer: {
    paddingLeft: scaleSize(10),
    flex: 1,
  },
  title: {
    fontSize: MOBILE.textSize.normal,
    fontWeight: '700',
    ...Styles.pL5,
  },
  subheadingsContainer: {
    flexDirection: 'row',
    ...Styles.w100,
  },
  subheadingContainer: {
    alignItems: 'center',
    paddingRight: scaleSize(15),
    paddingTop: scaleSize(5),
    width: scaleSize(130),
  },

  count: {
    fontSize: MOBILE.textSize.common,
  },
  subheading: {
    fontSize: MOBILE.textSize.xSmall,
  },
  arrowContainer: {},
});

export default CardMainPage;
