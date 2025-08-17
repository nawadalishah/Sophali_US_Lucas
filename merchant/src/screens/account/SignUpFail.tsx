import { View } from 'react-native';
import React from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { COLORS, Text } from '../../constants';
import Styles from '../../utils/styles';
import { Caution, SophaliMerchantLogo } from '../../svg';
import { Button } from '../../components';

const SignUpFail = () => {
  const navigation = useNavigation();

  const clearAndNavigate = (screen: any) => {
    navigation.dispatch(StackActions.replace(screen, { initial: false }));
  };

  const RenderContent = () => (
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
        <View
          style={[
            Styles.w100,
            Styles.justifyContentCenter,
            Styles.alignItemsCenter,
            Styles.pT10,
          ]}>
          <Caution />
        </View>
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
            You have successfully registered with us!
          </Text>
          <Text style={[Styles.pV10, Styles.textCenter]}>
            To activate your account, a verification link has been sent to your
            email.
          </Text>

          <Text color={COLORS.red} style={[Styles.pV10, Styles.textCenter]}>
            Unfortunately, your banking information is not verified. Please
            update them from settings.
          </Text>
        </View>

        <Button
          title="Done"
          containerStyle={[Styles.mT20]}
          textStyle={[Styles.textTransformCap]}
          onPress={() => clearAndNavigate('SignIn')}
        />
      </View>
    </View>
  );

  return (
    <View style={[Styles.flex, Styles.primaryBackground]}>
      <RenderContent />
    </View>
  );
};

export default SignUpFail;
