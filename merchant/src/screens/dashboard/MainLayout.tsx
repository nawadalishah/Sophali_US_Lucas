import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import Home from './Home';
import Styles from '../../utils/styles';

export default function MainLayout() {
  const [selectedTab, setSelectedTab] = useState('Home');
  const route = useRoute();

  useEffect(() => {
    if (route?.params?.screen) {
      setSelectedTab(route.params.screen);
    }
  }, [route]);

  return (
    <View style={[Styles.flex, Styles.primaryBackground]}>
      {selectedTab === 'Home' && <Home />}
    </View>
  );
}
