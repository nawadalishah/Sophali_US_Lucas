import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React from 'react';

import { FONTS, COLORS } from '../constants';
import {
  AnalyticsSvg,
  BellNewSvg,
  CheckedInSvg,
  CouponNewSvg,
  KOBSvg,
  LogOutSvgTwo,
  MessageSvg,
  TransactionSvg,
  UserNewSvg,
} from '../svg';
import { useNavigation } from '@react-navigation/native';
const ICON_SIZE = 50;
const ICON_COLOR = 'white';
export default function HeaderNew({
  name,
  notificationCounter,
  orderCounter,
}: any) {
  const navigation = useNavigation();
  return (
    <View>
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text
          style={{
            alignContent: 'center',
            ...FONTS.H4,
            color: COLORS.white,
            lineHeight: 24 * 1.2,
          }}>
          Welcome {name}
        </Text>
      </View>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { right: -5 }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications' as never)}>
            <BellNewSvg color={ICON_COLOR} size={ICON_SIZE} />
            <View
              style={{
                width: 22,
                height: 22,
                backgroundColor: COLORS.transparent,
                borderRadius: 11,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: -13,
                bottom: 24,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  ...FONTS.Lato_900Black,
                  color: COLORS.white,
                }}>
                {notificationCounter | 0}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Messages' as never)}>
            <MessageSvg color={ICON_COLOR} size={ICON_SIZE} />
          </TouchableOpacity>
        </View>

        <View style={[styles.iconContainer, { right: 5 }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile' as never)}>
            <UserNewSvg color={ICON_COLOR} size={ICON_SIZE} />
          </TouchableOpacity>
        </View>

        <View style={[styles.iconContainer, { right: 6 }]}>
          <TouchableOpacity
          // onPress={() => signOutNavigator()}
          >
            <LogOutSvgTwo color={ICON_COLOR} size={ICON_SIZE} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.containerLevel2, { marginTop: 0 }]}>
        <View style={[styles.iconContainer]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('OrdersList' as never)}>
            <KOBSvg color={ICON_COLOR} size={ICON_SIZE} />
            <View
              style={{
                width: 22,
                height: 22,
                backgroundColor: COLORS.transparent,
                borderRadius: 11,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: -18,
                bottom: 24,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  ...FONTS.Lato_900Black,
                  color: COLORS.white,
                }}>
                {orderCounter | 0}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <TransactionSvg color={ICON_COLOR} size={ICON_SIZE} />
          </TouchableOpacity>
        </View>

        <View style={[styles.iconContainer]}>
          <TouchableOpacity>
            <CheckedInSvg color={ICON_COLOR} size={ICON_SIZE} />
          </TouchableOpacity>
        </View>

        <View style={[styles.iconContainer]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CouponList' as never)}>
            <CouponNewSvg color={ICON_COLOR} size={ICON_SIZE} />
          </TouchableOpacity>
        </View>

        <View style={[styles.iconContainer]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Analytics' as never)}>
            <AnalyticsSvg color={ICON_COLOR} size={ICON_SIZE} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#013266',
    paddingTop: Platform.OS === 'ios' ? 46 : 30,
    paddingHorizontal: 27,
    justifyContent: 'space-between', // Added flex justification
  },
  containerLevel2: {
    flexDirection: 'row',
    backgroundColor: '#013266',
    paddingBottom: Platform.OS === 'ios' ? 46 : 30,
    paddingHorizontal: 27,
    justifyContent: 'space-between', // Added flex justification
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1, // Equal spacing using flex
    marginRight: 12,
    marginLeft: 10,
  },
});
