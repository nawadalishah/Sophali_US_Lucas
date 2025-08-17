import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SIZES } from '../../constants';
import { Button } from '../../components';

export default function CheckoutSuccess() {
  const navigation = useNavigation();

  function renderContent() {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: SIZES.height * 0.08,
          paddingBottom: 30,
          paddingHorizontal: 16,
        }}>
        <Image
          source={require('../../assets/images/Checkout-Success.png')}
          style={{
            width: 297,
            height: 297,
            alignSelf: 'center',
            top: 42,
          }}
        />
        <Text
          style={{
            ...FONTS.H1,
            textAlign: 'center',
            lineHeight: 40 * 1,
            marginBottom: 10,
          }}>
          Thank you for your order!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            ...FONTS.bodyText,
            color: COLORS.gray,
            lineHeight: 16 * 1.5,
            marginBottom: 70,
          }}>
          You can track your order by clicking the {'\n'} voluptate button
          below.
        </Text>
        <Button
          title="track my order"
          onPress={() => navigation.navigate('OrderTracking' as never)}
          containerStyle={{ marginBottom: 20 }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ ...FONTS.bodyText, color: COLORS.gray }}>
            Continue{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainLayout' as never)}>
            <Text style={{ ...FONTS.bodyText, color: COLORS.carrot }}>
              Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      {renderContent()}
    </View>
  );
}
