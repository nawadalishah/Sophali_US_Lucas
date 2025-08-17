import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { Button, Header, InputField } from '../../../components';
import { AndroidSafeArea, COLORS, FONTS, SIZES } from '../../../constants';
import { CopySvg, PayPalSvg, PlusTwoSvg } from '../../../svg';
import { FormControl } from 'native-base';
import { Shadow } from 'react-native-shadow-2';
import * as yup from 'yup';
import Modal from 'react-native-modal';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { orderReceiptAction } from '../../../redux/merchant/orderReceipt/orderReceiptActions';
import {
  acceptOrderAction,
  cancelOrderAction,
} from '../../../redux/orders/activeOrders/activeOrderAction';

export default function MerchantOrderReceipt() {
  const { user } = useAppSelector(state => state.auth);

  const userData: any = user;

  const { merchantPurchaseOrderReceipt } = useAppSelector(
    state => state.merchantPurchaseOrderReceipt,
  );
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { order_id }: any = route.params;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  console.log('merchantPurchaseOrderReceipt', merchantPurchaseOrderReceipt);
  useEffect(() => {
    if (order_id) {
      dispatch(orderReceiptAction(order_id));
    }
  }, [order_id]);

  useEffect(() => {}, [merchantPurchaseOrderReceipt]);

  function getSubTotal(OrderItems: any) {
    let subtotal = 0;
    if (OrderItems) {
      subtotal = OrderItems?.reduce(
        (acc: any, item: any) => acc + item.Product.price,
        0,
      );
    }
    return subtotal.toFixed(2);
  }

  function getTax(OrderItems: any) {
    console.log('setPrices', OrderItems);
    let subtotal = 0;
    let tax = 0;
    const discount = 0;
    const total = 0;
    if (OrderItems) {
      subtotal = OrderItems?.reduce(
        (acc: any, item: any) => acc + item.Product.price,
        0,
      );
      OrderItems.forEach((item: any) => {
        tax += (item.Product.price * item.Product.tax) / 100;
      });
    }
    tax = parseFloat(tax.toFixed(2));

    return tax > -1 ? tax : 0;
  }

  function getDiscount(OrderItems: any, discount_sophali_tokens: any) {
    console.log('setPrices', OrderItems);
    let subtotal = 0;
    let tax = 0;
    let discount = 0;
    let total = 0;
    if (OrderItems) {
      subtotal = OrderItems?.reduce(
        (acc: any, item: any) => acc + item.Product.price,
        0,
      );
      OrderItems.forEach((item: any) => {
        tax += (item.Product.price * item.Product.tax) / 100;
      });
    }
    tax = parseFloat(tax.toFixed(2));
    discount = discount_sophali_tokens / 5 || 0;
    total = subtotal + tax - discount;
    if (total < 0) {
      total = 0;
    }
  }

  function acceptOrder() {
    let totalTime = 0;
    merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt.forEach(
      (orderItem: any) => {
        orderItem.OrderItems.forEach((element: any) => {
          totalTime = totalTime + element.Product.time;
        });
      },
    );
    const order = {
      updatedAt:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0].updatedAt,
      total_time_in_minutes: totalTime,
    };
    const data = {
      user_id:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0].User.id,
      merchant_id:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0].Merchant
          .id,
      merchant_name:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0].Merchant
          .company_name,
      order_id:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0]
          .OrderItems[0].order_id,
      totalOrderTime: getTimeRemaining(order),
      status: 'preparing',
    };

    console.log('acceptedOrder', data);
    dispatch(acceptOrderAction(data)).then(res => {
      if (res.payload) {
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Home',
            }),
          );
        }, 1000);
      }
    });
  }

  function cancelOrder() {
    const cancelOrder = {
      user_id:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0].User.id,
      merchant_id:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0].Merchant
          .id,
      merchant_name:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0].Merchant
          .company_name,
      order_id:
        merchantPurchaseOrderReceipt.merchantPurchaseOrderReceipt[0]
          .OrderItems[0].order_id,
      status: 'cancelled',
    };

    dispatch(cancelOrderAction(cancelOrder)).then(res => {
      if (res.payload) {
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Home',
            }),
          );
        }, 1000);
      }
    });
  }

  const getTimeRemaining = (order: any) => {
    const now: any = new Date();
    const startTime = new Date(order.updatedAt);
    const totalTime = order.total_time_in_minutes * 60 * 1000; // convert to milliseconds
    const endTime: any = new Date(startTime.getTime() + totalTime);
    const timeRemaining = endTime - now;

    return timeRemaining;
  };

  function getTotal(OrderItems: any, discount_sophali_tokens: any) {
    console.log('discount_sophali_tokens', discount_sophali_tokens);
    let subtotal = 0;
    let tax = 0;
    let discount = 0;
    let total = 0;
    if (OrderItems) {
      subtotal = OrderItems?.reduce(
        (acc: any, item: any) => acc + item.Product.price,
        0,
      );
      OrderItems.forEach((item: any) => {
        tax += (item.Product.price * item.Product.tax) / 100;
      });
    }
    tax = parseFloat(tax.toFixed(2));
    discount = discount_sophali_tokens / 5 || 0;
    total = subtotal + tax - discount;
    if (total < 0) {
      total = 0;
    }
    return total;
  }

  function getTime(date: any, isTime = false) {
    if (isTime) {
      const newDate = new Date(date).getTime();
      return `${new Date(newDate).getHours()} : ${new Date(
        newDate,
      ).getMinutes()} : ${new Date(newDate).getSeconds()} sec`;
    } else {
      const newDate = new Date(date).getTime();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const month = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ];
      const monthName = month[new Date(newDate).getMonth()];
      const dayName = days[new Date(newDate).getDay()];
      return `${dayName} , ${monthName} ${new Date(
        newDate,
      ).getDate()}, ${new Date(newDate).getFullYear()}`;
    }
  }

  function renderHeader() {
    return (
      <Header title="Merchant Receipt" onPress={() => navigation.goBack()} />
    );
  }

  function renderContent() {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            // marginLeft: 160,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.green,
              borderRadius: 50,
              // marginHorizontal: 5,
            }}>
            <Text
              style={{
                paddingHorizontal: 36,
                paddingVertical: 6,
                lineHeight: 14 * 1.5,
                color: COLORS.white,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}
              onPress={() => acceptOrder()}>
              Accept Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.carrot,
              borderRadius: 50,
              // marginHorizontal: 5,
            }}
            // onPress={() => setOptionPickModal(true)}
          >
            <Text
              style={{
                paddingHorizontal: 36,
                paddingVertical: 6,
                lineHeight: 14 * 1.5,
                color: COLORS.white,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}
              onPress={() => cancelOrder()}>
              Cancel Order
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            // paddingHorizontal: 28,
            marginTop: 40,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            top: -10,
          }}>
          {merchantPurchaseOrderReceipt &&
          merchantPurchaseOrderReceipt?.merchantPurchaseOrderReceipt &&
          merchantPurchaseOrderReceipt?.merchantPurchaseOrderReceipt.length ? (
            merchantPurchaseOrderReceipt?.merchantPurchaseOrderReceipt?.map(
              (item: any, index: any) => (
                <Shadow
                  key={item.id + Math.random()}
                  offset={[0, 0]}
                  distance={15}
                  startColor={'rgba(6, 38, 100, 0.03)'}
                  // @ts-ignore
                  finalColor={'rgba(6, 38, 100, 0.0)'}>
                  <TouchableOpacity>
                    <View
                      style={{
                        width: screenWidth - 32,
                        height: screenHeight - 10,
                        backgroundColor: COLORS.white,
                        borderRadius: 20,
                        padding: 14,
                        // paddingBottom: 5,
                      }}>
                      <View
                        style={{
                          marginBottom: 10,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            // marginTop: 5
                          }}
                          numberOfLines={1}>
                          Purchase Item ID(P - ID)
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            // marginTop: 5
                          }}>
                          P-{item.id}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            // marginTop: 5
                          }}
                          numberOfLines={1}>
                          Date of Transaction
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            // marginTop: 5
                          }}>
                          {getTime(item.createdAt)}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Time of Transaction
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getTime(item.createdAt, true)}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          User Name
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.User.first_name} {item?.User.last_name}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Merchant ID
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          M {item?.Merchant.id}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Merchant Name
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.Merchant.company_name}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Merchant Address
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.Merchant.address}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Special Instructions
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.special_instructions}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                            alignItems: 'center',
                            fontWeight: 'bold',
                            marginLeft: 139,
                          }}
                          numberOfLines={1}>
                          Order Detail
                        </Text>
                      </View>

                      {item?.OrderItems?.map((order: any) => (
                        <View
                          style={{
                            marginBottom: 10,
                            marginHorizontal: 12,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                ...FONTS.Lato_700Bold,
                                fontSize: 14,
                                lineHeight: 14 * 1.3,
                                flex: 1,
                                color: COLORS.black,
                                marginTop: 5,
                              }}
                              numberOfLines={1}>
                              Item Purchased
                            </Text>
                            <Text
                              style={{
                                color: COLORS.black,
                                ...FONTS.Lato_400Regular,
                                fontSize: 12,
                                marginTop: 5,
                              }}>
                              {order.Product.title}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                ...FONTS.Lato_700Bold,
                                fontSize: 14,
                                lineHeight: 14 * 1.3,
                                flex: 1,
                                color: COLORS.black,
                                marginTop: 5,
                              }}
                              numberOfLines={1}>
                              Description
                            </Text>
                            <Text
                              style={{
                                color: COLORS.black,
                                ...FONTS.Lato_400Regular,
                                fontSize: 12,
                                marginTop: 5,
                              }}>
                              {order && order.description
                                ? order.description
                                : ''}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                ...FONTS.Lato_700Bold,
                                fontSize: 14,
                                lineHeight: 14 * 1.3,
                                flex: 1,
                                color: COLORS.black,
                                marginTop: 5,
                              }}
                              numberOfLines={1}>
                              Ingredients
                            </Text>
                            <Text
                              style={{
                                color: COLORS.black,
                                ...FONTS.Lato_400Regular,
                                fontSize: 12,
                                marginTop: 5,
                              }}>
                              {order.ingredients}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                ...FONTS.Lato_700Bold,
                                fontSize: 14,
                                lineHeight: 14 * 1.3,
                                flex: 1,
                                color: COLORS.black,
                                marginTop: 5,
                              }}
                              numberOfLines={1}>
                              AddOns
                            </Text>
                            <Text
                              style={{
                                color: COLORS.black,
                                ...FONTS.Lato_400Regular,
                                fontSize: 12,
                                marginTop: 5,
                              }}>
                              {order.addons}
                            </Text>
                          </View>
                        </View>
                      ))}

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Addons Price (CAD)
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems && item?.OrderItems[0]
                            ? item?.OrderItems[0].addons_total_sophali_tokens
                            : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Type
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems && item?.OrderItems[0]
                            ? item?.OrderItems[0].product_order_type
                            : ''}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Price(CAD)
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems &&
                          item?.OrderItems[0] &&
                          item?.OrderItems[0].Product &&
                          item?.OrderItems[0].Product.price
                            ? item?.OrderItems[0].Product.price
                            : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Price (Sophali)
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems &&
                          item?.OrderItems[0] &&
                          item?.OrderItems[0].Product &&
                          item?.OrderItems[0].Product.price
                            ? item?.OrderItems[0].Product.price * 5
                            : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Sub Total(CAD):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getSubTotal(item?.OrderItems)} $
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Sub Total(Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems &&
                          item?.OrderItems[0] &&
                          item?.OrderItems[0].Product &&
                          item?.OrderItems[0].Product.price
                            ? (item?.OrderItems[0].Product.price * 5).toFixed(2)
                            : 0}{' '}
                          Tokens
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Coupon Redeemed(CAD):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item && item?.coupon && item?.coupon > 0
                            ? item?.coupon
                            : '0.00'}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Coupon Redeemed(Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item && item?.coupon && item?.coupon > 0
                            ? item?.coupon
                            : '0.00'}{' '}
                          Tokens
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Tax(CAD)
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getTax(item.OrderItems).toFixed(2)}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Tax (Sophali)
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getTax(item.OrderItems).toFixed(2)} Tokens
                        </Text>
                      </View>
                      <View
                        style={{
                          marginBottom: 5,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Total (CAD):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getTotal(
                            item.OrderItems,
                            item.discount_sophali_tokens,
                          )}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginBottom: 15,
                          marginHorizontal: 12,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            ...FONTS.Lato_700Bold,
                            fontSize: 14,
                            lineHeight: 14 * 1.3,
                            flex: 1,
                            color: COLORS.black,
                            marginTop: 5,
                          }}
                          numberOfLines={1}>
                          Total (Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.black,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getTotal(
                            item.OrderItems,
                            item.discount_sophali_tokens,
                          ).toFixed(2)}
                          Tokens
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Shadow>
              ),
            )
          ) : (
            <Text
              style={{
                ...FONTS.H2,
                textTransform: 'capitalize',
                marginBottom: 10,
              }}>
              No Receipt Found
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}
