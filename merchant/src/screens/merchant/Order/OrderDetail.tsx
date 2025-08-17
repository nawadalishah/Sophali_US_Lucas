import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Header } from '../../../components';
import { AndroidSafeArea, COLORS, FONTS } from '../../../constants';
import { Spinner } from 'native-base';
import { Shadow } from 'react-native-shadow-2';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';

export default function PurchaseItemReceipt() {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const userData: any = user;
  const { order_id, title }: any = route.params;

  const [userOrderReceiptHeader, setUserOrderReceiptHeader] =
    useState<string>('');
  const [userOrderReceipt, setUserOrderReceipt] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState<any>(false);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (order_id) {
      setUserOrderReceiptHeader(title);
    }
  }, [order_id]);

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

  function getValueWithTaxSophali(tax: number, price: number, fee: number) {
    let taxValue = 0;
    if (tax && price) {
      taxValue = tax / price;
    }

    const priceValue = price && price > 0 ? price : 0;

    return priceValue + taxValue + fee;
  }

  function getValueWithTax(tax: number, price: number, fee: number) {
    let taxValue = 0;
    if (tax) {
      taxValue = tax / price;
    }

    const priceValue = price && price > 0 ? price : 0;

    return priceValue + taxValue + fee;
  }

  function renderHeader() {
    return (
      <Header
        title={userOrderReceiptHeader}
        onPress={() => navigation.goBack()}
      />
    );
  }

  function renderContent() {
    if (loadingState) {
      return (
        <Spinner
          size={50}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      );
    } else {
      return (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginTop: 40,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              top: -10,
              width: '100%',
            }}>
            {userOrderReceipt && userOrderReceipt.length ? (
              userOrderReceipt.map((item: any, index: any) => (
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
                        height: 700,
                        backgroundColor: COLORS.white,
                        marginBottom: 8,
                        borderRadius: 20,
                        padding: 4,
                        paddingBottom: 15,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Purchase Item ID (P-ID):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          P{item.id}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Date of Transaction
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getTime(item.createdAt)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getTime(item.createdAt, true)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          User ID:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {'U ' + item?.User.id}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          User Name:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.User && item?.User.screenName
                            ? item?.User.screenName
                            : `${item.User.first_name} ${item.User.last_name}`}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Merchant Name:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.Merchant.company_name}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Merchant Address:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.Merchant?.address || ''}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Details
                        </Text>
                      </View>

                      {item?.OrderItems && item?.OrderItems.length
                        ? item?.OrderItems?.map((order: any) => (
                            <View
                              style={{
                                // flex: 1,
                                marginHorizontal: 4,
                                marginVertical: 4,
                                marginBottom: 4,
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
                                  Item Purchased:
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.gray,
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
                                  Price (CAD):
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.gray,
                                    ...FONTS.Lato_400Regular,
                                    fontSize: 12,
                                    marginTop: 5,
                                  }}>
                                  {order.Product && order.Product.price > 0
                                    ? order.Product.price
                                    : 0}
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
                                  Price (Sophali):
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.gray,
                                    ...FONTS.Lato_400Regular,
                                    fontSize: 12,
                                    marginTop: 5,
                                  }}>
                                  {order.Product && order.Product.price > 0
                                    ? order.Product.price
                                    : 0}
                                </Text>
                              </View>
                            </View>
                          ))
                        : item?.TransferRedeemItems?.map((order: any) => (
                            <View
                              style={{
                                // flex: 1,
                                marginHorizontal: 4,
                                marginVertical: 4,
                                marginBottom: 4,
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
                                  Item Purchased:
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.gray,
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
                                  Price (CAD):
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.gray,
                                    ...FONTS.Lato_400Regular,
                                    fontSize: 12,
                                    marginTop: 5,
                                  }}>
                                  {order.Product && order.Product.price > 0
                                    ? order.Product.price
                                    : 0}
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
                                  Price (Sophali):
                                </Text>
                                <Text
                                  style={{
                                    color: COLORS.gray,
                                    ...FONTS.Lato_400Regular,
                                    fontSize: 12,
                                    marginTop: 5,
                                  }}>
                                  {order.Product && order.Product.price > 0
                                    ? order.Product.price
                                    : 0}
                                </Text>
                              </View>
                            </View>
                          ))}

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0]?.Product.description
                            ? item?.OrderItems[0]?.Product.description
                            : item?.TransferRedeemItems[0]?.Product.description}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Ingredients:
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginBottom: 4,
                          flexDirection: 'row',
                        }}>
                        <ScrollView style={{ maxHeight: 100 }}>
                          <Text
                            style={{
                              color: COLORS.gray,
                              ...FONTS.Lato_400Regular,
                              fontSize: 12,
                              marginTop: 5,
                              marginLeft: 10,
                            }}>
                            {item?.OrderItems[0].ingredients}
                          </Text>
                        </ScrollView>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Type:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0].product_order_type
                            ? item?.OrderItems[0].product_order_type
                            : ''}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Reciever Name:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item && item?.User ? item?.User?.screenName : ''}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Addons:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] && item?.OrderItems[0].addons
                            ? item?.OrderItems[0].addons
                            : ''}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Addons Price(CAD):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0].addons_total_sophali_tokens
                            ? item?.OrderItems[0].addons_total_sophali_tokens /
                              5
                            : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Addons Price(Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0].addons_total_sophali_tokens
                            ? item?.OrderItems[0].addons_total_sophali_tokens
                            : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Sub Total (CAD):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0]?.Product.price
                            ? item?.OrderItems[0]?.Product.price
                              ? (item?.OrderItems[0]?.Product.price).toFixed(2)
                              : 0
                            : item?.TransferRedeemItems &&
                                item?.TransferRedeemItems[0] &&
                                item?.TransferRedeemItems[0]?.Product?.price
                              ? (item?.TransferRedeemItems[0]?.Product?.price).toFixed(
                                  2,
                                )
                              : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Sub Total (Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0]?.Product.price
                            ? item?.OrderItems[0]?.Product.price
                              ? (item?.OrderItems[0]?.Product.price).toFixed(2)
                              : 0
                            : item?.TransferRedeemItems &&
                                item?.TransferRedeemItems[0] &&
                                item?.TransferRedeemItems[0]?.Product?.tax
                              ? (item?.TransferRedeemItems[0]?.Product?.price).toFixed(
                                  2,
                                )
                              : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Coupon Redeemed (CAD):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item && item?.coupon ? item?.coupon : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Coupon Redeemed (Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item && item?.coupon ? item?.coupon : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Tax (CAD):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0]?.Product.tax
                            ? item?.OrderItems[0]?.Product.tax
                              ? (
                                  item?.OrderItems[0]?.Product.tax /
                                  item?.OrderItems[0]?.Product.price
                                ).toFixed(2)
                              : 0
                            : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Tax (Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.OrderItems[0] &&
                          item?.OrderItems[0]?.Product.tax
                            ? item?.OrderItems[0]?.Product.tax
                              ? (
                                  item?.OrderItems[0]?.Product.tax /
                                  item?.OrderItems[0]?.Product.price
                                ).toFixed(2)
                              : 0
                            : 0}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Transaction Charges (cad):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {0.4}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Transaction Charges (Sophali):
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {2}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getValueWithTax(
                            item?.OrderItems[0]?.Product.tax,
                            item?.OrderItems[0]?.Product.price,
                            0.4,
                          ).toFixed(2)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {getValueWithTaxSophali(
                            item?.OrderItems[0]?.Product.tax,
                            item?.OrderItems[0]?.Product.price,
                            2,
                          )}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          marginHorizontal: 4,
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
                          Comments:
                        </Text>
                        <Text
                          style={{
                            color: COLORS.gray,
                            ...FONTS.Lato_400Regular,
                            fontSize: 12,
                            marginTop: 5,
                          }}>
                          {item?.special_instructions ? '' : ''}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Shadow>
              ))
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
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}
