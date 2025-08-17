import { View } from 'react-native';
import React from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { Text } from '../../../constants';
import Styles from '../../../utils/styles';
import { CheckSuccess, SophaliMerchantLogo } from '../../../svg';
import { Button } from '../../../components';

export default function WithDrawSuccess() {
  const navigation = useNavigation();

  function clearAndNavigate(screen: any) {
    navigation.dispatch(StackActions.replace(screen, { initial: false }));
  }

  function renderContent() {
    return (
      <View
        style={[
          Styles.flex,
          Styles.alignItemsCenter,
          Styles.w100,
          Styles.alignContentCenter,
        ]}>
        <View
          style={[
            Styles.justifyContentCenter,
            Styles.alignItemsCenter,
            Styles.w100,
            Styles.alignContentCenter,
            Styles.pV20,
          ]}>
          <SophaliMerchantLogo />
          <View style={[Styles.mT20]} />
          <CheckSuccess />
        </View>

        <View
          style={[
            Styles.w100,
            Styles.pH20,
            Styles.justifyContentCenter,
            Styles.alignItemsCenter,
            Styles.flex06,
          ]}>
          <View
            style={[
              Styles.w100,
              Styles.justifyContentCenter,
              Styles.alignItemsCenter,
              Styles.pH15,
              Styles.pV10,
            ]}>
            <Text style={[Styles.pV10, Styles.textCenter]}>
              Thank you for your withdrawal request!
            </Text>
            <Text style={[Styles.pV10, Styles.textCenter]}>
              We've received it, and your funds will be processed shortly.
            </Text>
          </View>

          <Button
            title="Done"
            containerStyle={[Styles.mT20]}
            textStyle={[Styles.textTransformCap]}
            onPress={() => clearAndNavigate('Transactions')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[Styles.flex, Styles.primaryBackground]}>
      {renderContent()}
    </View>
  );
}
