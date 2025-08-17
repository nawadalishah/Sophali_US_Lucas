import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from 'native-base';

const Loader: React.FC = () => (
  <View style={styles.container}>
    <Spinner color="blue" size={30} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
