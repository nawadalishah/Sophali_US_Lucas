import { SafeAreaView, Text, View } from 'react-native';
import React from 'react';
import { AndroidSafeArea } from '../../constants';

import Styles from '../../utils/styles';

const Chats = () => (
  <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
    <View style={[Styles.flexCenter]}>
      <Text>Coming Soon!</Text>
    </View>
  </SafeAreaView>
);
export default Chats;
