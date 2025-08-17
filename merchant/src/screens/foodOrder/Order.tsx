import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  BasketSvg,
  MinusSvg,
  PlusSvg,
  ProfileArrowSvg,
  PromocodeAppliedSvg,
  SmallMapPin,
  StarTwoSvg,
} from '../../svg';
import { Button } from '../../components';
import { AndroidSafeArea, COLORS, FONTS } from '../../constants';
import { menu } from '../../constants/dummyData';

export default function Order() {
  const [count, setCount] = useState(0);
  const incrementCount = () => {
    setCount(count + 1);
    console.log(count);
  };
  const decrementCount = () => {
    if (count <= 0) {
      return;
    } else {
      setCount(count - 1);
    }
  };
  const navigation = useNavigation();
  const route = useRoute();

  function renderHeader() {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 20, ...FONTS.H1 }}>My order</Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingBottom: 20,
            borderBottomColor: '#E2E2E2',
          }}>
          <Image
            source={{
              uri: 'https://via.placeholder.com/219x219',
            }}
            style={{
              width: 73,
              height: 73,
              borderRadius: 20,
              marginRight: 16,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ ...FONTS.H4 }}>Desert show cafe</Text>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                color: COLORS.gray,
                fontSize: 14,
                lineHeight: 14 * 1.4,
                marginBottom: 4,
              }}>
              Bakery
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StarTwoSvg />
              <Text style={{ marginHorizontal: 5 }}>5.0 -</Text>
              <SmallMapPin />
              <Text style={{ marginHorizontal: 5 }}>0.2 km - $$</Text>
            </View>
          </View>
          <ProfileArrowSvg />
        </TouchableOpacity>
      </View>
    );
  }

  function renderItem(data: any) {
    return (
      <Shadow
        offset={[0, 0]}
        distance={15}
        startColor={'rgba(6, 38, 100, 0.04)'}
        // @ts-ignore
        finalColor={'rgba(6, 38, 100, 0.0)'}
        viewStyle={{ width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            width: '100%',
            height: 81,
            backgroundColor: COLORS.white,
            borderRadius: 20,
          }}>
          <Image
            source={{
              uri: 'https://via.placeholder.com/219x219',
            }}
            style={{
              width: 73,
              height: 73,
              borderRadius: 20,
              marginLeft: 4,
            }}
          />
          <View
            style={{
              flex: 1,
              marginTop: 12,
              marginBottom: 10,
              marginHorizontal: 10,
            }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...FONTS.Lato_700Bold,
                  fontSize: 14,
                  color: COLORS.black,
                }}>
                {data.item.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...FONTS.Lato_400Regular,
                  fontSize: 14,
                  color: COLORS.gray,
                }}>
                ${data.item.price}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={decrementCount}
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: COLORS.lightBlue,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <MinusSvg />
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 10 }}>{count}</Text>
                <TouchableOpacity
                  onPress={incrementCount}
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: COLORS.lightBlue,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <PlusSvg />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Shadow>
    );
  }

  function renderHiddenItem(data: any) {
    return (
      <TouchableOpacity
        style={{
          alignSelf: 'flex-end',
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: COLORS.carrot,
          height: 81,
          width: 300,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          paddingRight: 15,
        }}
        onPress={() => console.log('Remove Item')}>
        <BasketSvg />
      </TouchableOpacity>
    );
  }

  function renderFooter() {
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ marginBottom: 42 }}>
          <TouchableOpacity style={{ marginBottom: 30 }}>
            <PromocodeAppliedSvg />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={{ ...FONTS.H4, lineHeight: 24 * 1.2 }}>Subtotal</Text>
            <Text style={{ ...FONTS.H4, lineHeight: 24 * 1.2 }}>$76.24</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 14,
                color: COLORS.gray,
              }}>
              Discount
            </Text>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 14,
                color: COLORS.gray,
              }}>
              - $15.29
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 14,
                color: COLORS.gray,
              }}>
              Delivery
            </Text>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 14,
                color: COLORS.green,
              }}>
              Free
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#E2E2E2',
              marginBottom: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ ...FONTS.H2 }}>Total</Text>
            <Text style={{ ...FONTS.H2 }}>$76.24</Text>
          </View>
        </View>
        <Button
          title="checkout"
          onPress={() => navigation.navigate('Checkout' as never)}
        />
      </View>
    );
  }

  function renderDishes() {
    return (
      <View style={{ flex: 1 }}>
        <SwipeListView
          data={menu}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          rightOpenValue={-75}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}
          disableRightSwipe={true}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderDishes()}
    </SafeAreaView>
  );
}
