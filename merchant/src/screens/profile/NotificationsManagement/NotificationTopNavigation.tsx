import { View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../../constants';
import { useStyles } from './styles';
import { Header } from '../../../components';
import { SophaliSvg } from '../../../svg';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles from '../../../utils/styles';

const NotificationTopNavigation = ({ setCurrent, current }) => {
  const navigation = useNavigation();
  const styles = useStyles();

  const tabs = [
    {
      id: 1,
      name: 'Order',
      icon: (
        <MaterialCommunityIcons
          name="chef-hat"
          size={24}
          color={current === 'Order' ? COLORS.orange : COLORS.tabLightColor}
        />
      ),
    },
    {
      id: 2,
      name: 'Buddy',
      icon: (
        <FontAwesome5
          name="user-friends"
          size={24}
          color={current === 'Buddy' ? COLORS.blueDark : COLORS.tabLightColor}
        />
      ),
    },
    {
      id: 3,
      name: 'Coupon',
      icon: (
        <MaterialIcons
          name="receipt"
          size={24}
          color={current === 'Coupon' ? COLORS.blueLight : COLORS.tabLightColor}
        />
      ),
    },
    {
      id: 4,
      name: 'Chat',
      icon: (
        <Ionicons
          name="chatbubble-sharp"
          size={24}
          color={current === 'Chat' ? COLORS.purple : COLORS.tabLightColor}
        />
      ),
    },
    {
      id: 5,
      name: 'Sophali',
      icon: <SophaliSvg colorAllow={current === 'Sophali' ? true : false} />,
    },
  ];

  return (
    <View style={[Styles.w100, Styles.pV10]}>
      <Header
        onPress={() => navigation.goBack()}
        title={'Notification Details'}
        titleStyle={{ fontSize: 20 }}
      />
      <View style={[Styles.w100, Styles.pH20]}>
        <View style={[styles.navigation]}>
          {tabs.map((i: any) => (
            <TouchableOpacity
              key={i.id}
              activeOpacity={0.7}
              onPress={() => {
                setCurrent(i?.name);
              }}>
              {i?.icon}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NotificationTopNavigation;
