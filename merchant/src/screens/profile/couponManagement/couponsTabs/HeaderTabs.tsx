import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useStyles } from './style';
import { COLORS } from '../../../../constants';
import { Header } from '../../../../components';
import { useNavigation } from '@react-navigation/native';

const HeaderTabs = ({ currentTab, setCurrentTab }: any) => {
  const styles = useStyles();
  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: 'white', width: '100%' }}>
      <Header
        title={'Coupons List'}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.headerTabs}>
        <ScrollView
          contentContainerStyle={{}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={{
              backgroundColor:
                currentTab === 'active' ? COLORS.green : '#F3F7FF',
              borderRadius: 50,
              marginHorizontal: 5,
            }}
            onPress={() => {
              setCurrentTab('active');
            }}>
            <Text
              style={{
                paddingHorizontal: 26,
                paddingVertical: 6,
                // width: 180,
                lineHeight: 14 * 1.5,
                color: currentTab === 'active' ? COLORS.white : COLORS.gray,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
                textAlign: 'center',
              }}>
              Active Coupons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                currentTab === 'template' ? COLORS.green : '#F3F7FF',
              borderRadius: 50,
              marginHorizontal: 5,
            }}
            onPress={() => {
              setCurrentTab('template');
            }}>
            <Text
              style={{
                paddingHorizontal: 26,
                paddingVertical: 6,
                // width: 180,
                lineHeight: 14 * 1.5,
                color: currentTab === 'template' ? COLORS.white : COLORS.gray,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
                textAlign: 'center',
              }}>
              Create Template
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                currentTab === 'expired' ? COLORS.green : '#F3F7FF',
              borderRadius: 50,
              marginHorizontal: 5,
            }}
            onPress={() => {
              setCurrentTab('expired');
            }}>
            <Text
              style={{
                paddingHorizontal: 26,
                paddingVertical: 6,
                // width: 180,
                lineHeight: 14 * 1.5,
                color: currentTab === 'expired' ? COLORS.white : COLORS.gray,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
                textAlign: 'center',
              }}>
              Expired Coupons
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default HeaderTabs;
