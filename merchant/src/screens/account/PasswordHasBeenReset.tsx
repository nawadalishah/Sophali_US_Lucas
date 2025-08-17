import { Image, ScrollView, View } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, Text } from '../../constants';
import { Button } from '../../components';
import { scaleSize } from '../../utils/mixins';
import Styles from '../../utils/styles';
import { WEIGHT } from '../../constants/theme';

export default function PasswordHasBeenReset() {
  const navigation = useNavigation();
  const route = useRoute();

  function renderContent() {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: scaleSize(16),
        }}>
        <View style={[Styles.flex, Styles.mT40]}>
          <Image
            source={require('../../assets/images/key.png')}
            style={{
              width: scaleSize(260),
              height: scaleSize(260),
              alignSelf: 'center',
            }}
          />
          <Text
            weight={WEIGHT.w700}
            style={{
              textAlign: 'center',
              marginBottom: scaleSize(10),
              fontSize: scaleSize(16),
            }}>
            Password Reset
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: scaleSize(10),
              fontSize: scaleSize(14),
            }}>
            Your password has been reset!
          </Text>
        </View>
        <View style={[Styles.w100, Styles.pV15]}>
          <Button
            title="done"
            onPress={() =>
              navigation.navigate('SignIn' as never, {
                email: route?.params?.email,
              })
            }
          />
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
