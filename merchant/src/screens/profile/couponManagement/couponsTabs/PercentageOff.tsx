import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AndroidSafeArea } from '../../../../constants';

const PercentageOff = () => {
  const renderHeader = () => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold' }}>Percentage Off</Text>
    </View>
  );

  const renderContent = () => (
    <KeyboardAwareScrollView>
      <Text></Text>
    </KeyboardAwareScrollView>
  );
  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default PercentageOff;

const styles = StyleSheet.create({});
