import React from 'react';
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { AndroidSafeArea, COLORS, FONTS } from '../../constants';
import { Header } from '../../components';
const { width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

const toolsData = [
  {
    id: '1',
    name: 'Role Management',
    screen: 'roleManagement',
  },
  {
    id: '2',
    name: 'Coupons',
    screen: 'CouponList',
    // icon: require('../../assets/icons/coupons.png')
  },
  {
    id: '3',
    name: 'Transactions',
    screen: 'Transactions',
    // icon: require('../../assets/icons/transactions.png'),
  },
  {
    id: '4',
    name: 'Merchant Tokens',
    screen: 'TokenList',
    // icon: require('../../assets/icons/chat.png')
  },
  {
    id: '5',
    name: 'Coupon Management',
    screen: 'CouponList',
    // icon: require('../../assets/icons/products.png'),
  },
  {
    id: '6',
    name: 'Subscriptions',
    screen: 'subscriptions',
    // icon: require('../../assets/icons/products.png'),
  },
];

export default function ToolsScreen() {
  const navigation = useNavigation();
  function renderToolItem({ item }: any) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(item.screen as never)}>
        <View style={styles.iconContainer}>
          <Image
            source={{
              uri: 'https://d3aux7tjp119y2.cloudfront.net/images/Tak2-CMSTemplate_IrMZHla.width-1650.jpg',
            }}
            style={styles.icon}
          />
        </View>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  }
  function renderHeader() {
    return <Header title="Tools" goBack={false} />;
  }
  function renderContent() {
    return (
      <FlatList
        data={toolsData}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={renderToolItem}
        contentContainerStyle={styles.container}
      />
    );
  }
  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea, flex: 1 }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    padding: 16,
  },
  title: {
    ...FONTS.H2,
    color: COLORS.black,
  },
  container: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 8,
    padding: 16,
    borderRadius: 20,
    elevation: 3, // Shadow for Android
    shadowOffset: { width: 1, height: 1 }, // Shadow for iOS
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  iconContainer: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: width * 0.2,
    height: width * 0.2,
  },
  text: {
    ...FONTS.H4,
    color: COLORS.black,
    textAlign: 'center', // Centering the text horizontally
  },
});
