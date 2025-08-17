import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from '../../../../components';
import { useNavigation } from '@react-navigation/native';
import { AndroidSafeArea } from '../../../../constants';

const BuyOneGetOne = () => {
  const navigation = useNavigation();

  const renderHeader = () => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold' }}>Buy One Get One Free</Text>
    </View>
  );

  const renderContent = () => (
    <KeyboardAwareScrollView>
      <Text>Buy One get One Free</Text>
    </KeyboardAwareScrollView>
  );

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default BuyOneGetOne;

const styles = StyleSheet.create({});
