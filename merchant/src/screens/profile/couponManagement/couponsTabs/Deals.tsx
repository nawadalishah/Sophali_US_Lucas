import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AndroidSafeArea } from '../../../../constants';

const Deals = () => {
  const renderHeader = () => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold' }}>Deals</Text>
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

export default Deals;

const styles = StyleSheet.create({});
