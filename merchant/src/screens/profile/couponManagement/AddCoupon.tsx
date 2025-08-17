import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { productAction } from '../../../redux/merchant/product/productAction';
import AmountOff from './couponsTabs/AmountOff';
import Styles from '../../../utils/styles';
import { COLORS } from '../../../constants';

export default function AddCoupon({ setCurrentTab = () => {} }) {
  const dispatch = useAppDispatch();
  const [tabs, setTabs] = useState<any>('amount');
  const { user } = useAppSelector(state => state.auth);
  const userData = user;

  useEffect(() => {
    dispatch(productAction({ data: userData?.userDetail }));
  }, []);

  const tabHandler = (e: any) => {
    setTabs(e);
  };

  const navToList = useCallback(() => {
    setTabs('amount');
    setCurrentTab && setCurrentTab('active');
  }, [tabs, setCurrentTab]);

  const renderCouponsTabs = () => (
    <View
      style={{
        height: 50,
        width: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        // marginVertical: 10,
      }}>
      <ScrollView
        contentContainerStyle={{}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            // marginVertical: 10,
            height: 40,
            gap: 10,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: tabs === 'amount' ? COLORS.green : '#F3F7FF',
              paddingHorizontal: 25,
              paddingVertical: 3,
              borderRadius: 50,
            }}
            onPress={() => tabHandler('amount')}>
            <Text
              style={{
                color: tabs === 'amount' ? 'white' : 'black',
              }}>
              $ Amount Off
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: tabs === '%age' ? COLORS.green : '#F3F7FF',
              paddingHorizontal: 15,
              paddingVertical: 3,
              borderRadius: 50,
            }}
            onPress={() => tabHandler('%age')}>
            <Text
              style={{
                color: tabs === '%age' ? 'white' : 'black',
              }}>
              % age Off
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor:
                tabs === 'buyonegetone' ? COLORS.green : '#F3F7FF',
              paddingHorizontal: 15,
              paddingVertical: 3,
              borderRadius: 50,
            }}
            onPress={() => tabHandler('buyonegetone')}>
            <Text
              style={{
                color: tabs === 'buyonegetone' ? 'white' : 'black',
              }}>
              Buy one get one
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: tabs === 'deals' ? COLORS.green : '#F3F7FF',
              paddingHorizontal: 15,
              paddingVertical: 3,
              borderRadius: 50,
            }}
            onPress={() => tabHandler('deals')}>
            <Text
              style={{
                color: tabs === 'deals' ? 'white' : 'black',
              }}>
              Deals
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={[Styles.flex, Styles.w100, Styles.pV10]}>
      {renderCouponsTabs()}
      <AmountOff tabs={tabs} navToList={navToList} />
    </View>
  );
}
