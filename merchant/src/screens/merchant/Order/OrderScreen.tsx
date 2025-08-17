import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Select, Toast } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button, Header, InputField } from '../../../components';
import { COLORS, Text } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import {
  acceptOrderAction,
  activeOrders,
  cancelOrderAction,
} from '../../../redux/orders/activeOrders/activeOrderAction';
import { Spinner } from 'native-base';
import TimerTick from '../../../components/TimerTick';
import PickUpOrder from './PickUpOrder';
import moment from 'moment';
import OrderModel from '../../../components/OrderModel';
import TopNavigation from '../../../components/TopNavigation';
import { SearchSvg } from '../../../svg';
import Styles from './../../../utils/styles/index';
import { MOBILE, deviceHeight, deviceWidth } from '../../../utils/orientation';
import { isEmpty, capitalize } from 'lodash';
import { axiosInstance } from './../../../config/axios';
import { scaleSize } from '../../../utils/mixins';
import { FONT_FAMILY, WEIGHT } from '../../../constants/theme';
import { pusherEventHandler } from '../../../utils';
import { isSubMerchant } from '../../../utils/helpers';

export default function OrdersScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [orderArray, setOrders] = useState<any>([]);
  const [orderNewArray, setNewOrders] = useState<any>([]);
  const [favorite, setFavorite] = useState('New');
  const { user } = useAppSelector(state => state.auth);
  const { orders } = useAppSelector(state => state.activeOrders);
  const loading = useAppSelector(state => state.activeOrders.loadingOrder);
  const userData = user;
  const [loadingState, setLoadingState] = useState<any>(false);
  const [pickUp, setPickUp] = useState<any>(false);
  const [pickedUpOrder, setPickedUpOrder] = useState<any>({});
  const [view, setView] = useState<any>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>({}); // for details modal
  const [visible, setVisible] = useState<any>(false);
  const [rejectionVisible, setRejectionVisible] = useState<any>(false);
  const [reasons, setReasons] = useState<any>([]);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [transfer, setTransfer] = useState<any>([]);
  const [searchloading, setSearchLoading] = useState<boolean>(false);
  const [transid, setTid] = useState<any>('');
  //Manage the Order Details Modal
  const [orderDetialModal, setOrdeDetailModal] = useState<any>(false);
  const isFocused = useIsFocused();
  const isSubMerchantRole = isSubMerchant(user?.role?.name);

  const toggleOrderDetailModal = () => {
    setOrdeDetailModal(!orderDetialModal);
  };
  const formatDate = (dateString: any) =>
    moment(dateString).format('ddd MMM DD YYYY');
  const formatTime = (dateString: any) => {
    const date = moment(dateString);
    return date.format('hh:mm A');
  };
  const handleOk = () => {
    setVisible(!visible);
    setSelectedOrder(null);
  };
  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  const fetchData = async () => {
    setLoadingState(true);
    await dispatch(activeOrders(userData?.userDetail));
    setLoadingState(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) return;
    pusherActivate();
  }, [user, isFocused]);

  const pusherActivate = async () => {
    try {
      pusherEventHandler(user?.userDetail.id, pusherHandlers);
    } catch (error) {
      console.log('Error activating Pusher:', error);
    }
  };

  const pusherHandlers = async () => {
    await fetchData();
    await transferLater();
  };

  const openRejectionModal = async (item: any) => {
    // setLoadingState(true);
    setSelectedOrder(item);
    try {
      const response = await axiosInstance.get<any>('reasons');
      setReasons(response.data.reasons);
      setLoadingState(false);
    } catch (error) {
      console.log(error);
    }

    setRejectionVisible(true);
  };
  useEffect(() => {
    if (favorite.includes('trans')) {
      transferLater();
    }
  }, [favorite]);
  const transferLater = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const response = await axiosInstance.get<any>(
        `order/merchant-transfer-order?user_id=${id}`,
      );
      const res = (await response?.data?.userTransferOrder) || [];
      let Orders = res;

      Orders = Orders.map((order: any) => {
        const Items = [
          ...(order?.OrderItems || []),
          ...(order?.TransferRedeemItems || []),
        ];
        const orderTotalTime = Items.reduce((highest, item) => {
          const timeInMinutes =
            item?.Product?.time_type === 'hours'
              ? item?.Product?.time * 60
              : (item?.Product?.time ?? 0);
          return Math.max(highest, timeInMinutes);
        }, 0);

        return {
          ...order,
          total_time_in_minutes: orderTotalTime,
        };
      });
      setTransfer(Orders);
    } catch (error) {
      console.log(error);
    }
  };
  //Get Super Admin and Merchant Settings
  const [adminSetting, setAdminSetting] = useState<any>({});
  const [merchantSetting, setMerchantSetting] = useState<any>({});

  const getDataMerChant = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get<any>(`setting/${id}`);
      setMerchantSetting(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataAdmin = async () => {
    try {
      const res = await axiosInstance.get<any>('setting/admin/1');
      setAdminSetting(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataAdmin();
    getDataMerChant();
  }, []);

  useEffect(() => {
    try {
      if (!loading && orders && orders.orders) {
        let Orders = orders.orders;

        Orders = Orders.map((order: any) => {
          const Items = [
            ...(order?.OrderItems || []),
            ...(order?.TransferRedeemItems || []),
          ];
          const orderTotalTime = Items.reduce((highest, item) => {
            const timeInMinutes =
              item?.Product?.time_type === 'hours'
                ? (item?.Product?.time || 0) * 60
                : (item?.Product?.time ?? 0);
            return Math.max(highest, timeInMinutes);
          }, 0);

          return {
            ...order,
            total_time_in_minutes: orderTotalTime,
          };
        });
        setOrders(Orders);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, [orders, loading]);
  const handleDetailsClick = async (order: any) => {
    if (favorite === 'trans') {
      setSelectedOrder(order);
    } else {
      await fetchDetails(order.id);
    }
    setVisible(true);
  };
  const fetchDetails = async (orderId: number) => {
    try {
      const response = await axiosInstance.get<any>(
        `receipt/merchant-purchase-order-m-receipt?order_id=${orderId}`,
      );

      setSelectedOrder(response.data.merchantPurchaseOrderReceipt[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const debounce = (func: any, delay: any) => {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const [searchText, setSearchText] = useState<any>('');
  useEffect(() => {
    if (favorite == 'New' && orderArray.length > 0) {
      const newOrders = orderArray.filter(
        (order: any) => order.status === 'new' || order.status === 'preparing',
      );
      if (newOrders && newOrders.length > 0) {
        setNewOrders(newOrders);
      } else {
        setNewOrders([]);
      }
    } else if (favorite == 'trans' && orderArray.length) {
      transferLater();
    } else if (favorite == 'Completed' && orderArray.length) {
      const collectedOrders = orderArray.filter(
        (order: any) =>
          order.status === 'closed' || order.status === 'prepared',
      );
      if (collectedOrders && collectedOrders.length) {
        setNewOrders(collectedOrders);
      } else {
        setNewOrders([]);
      }
    } else if (favorite == 'Declined') {
      const cancelledOrders = orderArray.filter(
        (order: any) => order.status === 'cancelled',
      );
      if (cancelledOrders && cancelledOrders.length) {
        setNewOrders(cancelledOrders);
      } else {
        setNewOrders([]);
      }
    } else if (favorite == 'Accepted') {
      const acceptedOrders = orderArray
        .filter(
          (order: any) =>
            order.status === 'preparing' || order.status === 'prepared',
        )
        .sort((a: any, b: any) => {
          if (a.status !== b.status) {
            // Sort by status first: preparing should come before prepared
            return a.status === 'preparing' ? -1 : 1;
          } else {
            // If both orders have the same status, sort by time left
            return a.total_time_in_minutes - b.total_time_in_minutes;
          }
        });
      if (acceptedOrders && acceptedOrders.length) {
        setNewOrders(acceptedOrders);
      } else {
        setNewOrders([]);
      }
    }
  }, [orderArray, favorite]);

  const [filterSearch, setFilterSearch] = useState<any>([]);
  const handleSearch = debounce((text: any) => {
    setSearchLoading(true);
    setTimeout(() => {
      if (text && text.length) {
        const filterData = List.filter((record: any) =>
          record?.custom_id?.toLowerCase().includes(text?.toLowerCase().trim()),
        );
        // setNewOrders(filterData);
        setFilterSearch(filterData);

        setSearchLoading(false);
      }
      if (text.length == 0) {
        transferLater();
      }
      setSearchLoading(false);
    }, 2000);
  }, 1000);
  function acceptOrder(item: any) {
    const order = {
      updatedAt: item?.updatedAt,
      total_time_in_minutes: item?.total_time_in_minutes,
    };
    const data = {
      user_id: item?.user_id,
      merchant_id: item?.Merchant.id,
      merchant_name: item?.Merchant.company_name,
      order_id: item?.order_number
        ? item?.id
        : item?.TransferRedeemItems[0]?.order_id ||
          item?.OrderItems[0]?.order_id ||
          0,
      totalOrderTime: item?.total_time_in_minutes,
      status: 'preparing',
    };
    dispatch(acceptOrderAction(data));

    setTimeout(() => {
      dispatch(activeOrders(userData?.userDetail));
    }, 1000);
  }

  function orderPrepared(item: any) {
    const order = {
      updatedAt: item?.updatedAt,
      total_time_in_minutes: item?.total_time_in_minutes,
    };
    const data = {
      user_id: item?.user_id,
      merchant_id: item?.Merchant.id,
      merchant_name: item?.Merchant.company_name,
      order_id: item?.order_number
        ? item?.id
        : item?.TransferRedeemItems[0]?.order_id ||
          item?.OrderItems[0]?.order_id ||
          0,
      reference_number: item?.reference_number,
      collected_color: getMinutesColor(item),
      totalOrderTime: getTimeRemaining(order),
      status: 'prepared',
    };

    dispatch(acceptOrderAction(data));

    setTimeout(() => {
      dispatch(activeOrders(userData?.userDetail));
    }, 1000);
  }

  function cancelOrder(item: any) {
    const cancelOrder = {
      user_id: item?.user_id,
      merchant_id: item?.Merchant.id,
      merchant_name: item?.Merchant.company_name,
      order_id: item?.order_number
        ? item?.id
        : item?.TransferRedeemItems[0]?.order_id ||
          item?.OrderItems[0]?.order_id ||
          0,
      status: 'cancelled',
    };

    dispatch(cancelOrderAction(cancelOrder));

    setTimeout(() => {
      dispatch(activeOrders(userData?.userDetail));
    }, 1000);
  }
  function convertDate(date: string) {
    if (date) {
      return moment(date).format('MMM Do YYYY');
    }
  }

  function convertTime(date: string) {
    if (date) {
      const newDate = moment(date);

      const formattedTime = newDate.format('hh:mm A');
      return formattedTime;
    }
  }

  const getMinutesColor = (item: any) => {
    const order = {
      updatedAt: item?.updatedAt,
      total_time_in_minutes: item?.total_time_in_minutes,
    };

    const timeRemining = getTimeRemaining(order);
    let minutes = Math.floor(timeRemining / (60 * 1000));
    if (minutes < -1) {
      // Adjust the display value for negative minutes
      minutes = minutes + 1;
    }

    const seventyPercentConsumed = isSeventyPercentConsumed(
      timeRemining,
      order.total_time_in_minutes,
    );
    if (seventyPercentConsumed && minutes > 0) {
      return COLORS.tickerPreparingTimeColor;
    }
    if (minutes < 0) return COLORS.tickerWarningTimeColor;
    return COLORS.preparingOrder;
  };

  const isSeventyPercentConsumed = (timeRemaining: any, totalTime: any) => {
    const totalTimes = totalTime * 60 * 1000;
    const elapsedPercent = ((totalTimes - timeRemaining) / totalTimes) * 100;
    return elapsedPercent >= 70;
  };
  const getTimeRemaining = (order: any) => {
    const now: any = new Date();
    const startTime = new Date(order.updatedAt);
    const totalTime = order.total_time_in_minutes * 60 * 1000;
    const endTime: any = new Date(startTime.getTime() + totalTime);
    const timeRemaining = endTime - now;
    return timeRemaining;
  };

  function renderHeader() {
    return (
      <Header
        title={pickUp ? 'Scan User QR or Enter User PIN' : 'Orders'}
        onPress={() => {
          if (pickUp) {
            setPickUp(false);
          } else {
            navigation.goBack();
          }
        }}
      />
    );
  }
  let subtotal = 0;
  let tax = 0;
  let discount = 0;
  let total = 0;

  if (selectedOrder) {
    if (selectedOrder?.OrderItems) {
      subtotal = selectedOrder?.OrderItems?.reduce(
        (acc: any, item: any) => acc + (item?.Product?.price || 0),
        0,
      );
      selectedOrder.OrderItems.forEach((item: any) => {
        tax += ((item?.Product?.price || 0) * item?.Product?.tax) / 100;
      });
    }
    tax = parseFloat(tax.toFixed(2));
    discount = (selectedOrder?.discount_sophali_tokens || 0) / 5 || 0;
    total = subtotal + tax - discount;
    if (total < 0) {
      total = 0;
    }
  }
  const onSelectReason = async (value: any) => {
    setSelectedReason(value);
  };
  const RejectionReasonSelect = ({ reasons, onValueChange }: any) => (
    <View style={[styles.selectContainer, Styles.flexDirectionColumn]}>
      <Select
        key="Reason"
        placeholder="Rejection Reason"
        width={deviceWidth - 35}
        onValueChange={onValueChange}>
        {reasons?.map(({ reason, id, label }: any, index: any) => (
          <Select.Item
            key={index}
            label={capitalize(label)}
            value={{ id: id, label: capitalize(label), reason }}
            textTransform={'capitalize'}
          />
        ))}
      </Select>
      {selectedReason && selectedReason?.id && (
        <View
          style={[
            Styles.flexDirectionColumn,
            {
              backgroundColor: COLORS.white,
              elevation: 1.5,
              borderRadius: scaleSize(5),
            },
            Styles.justifyContentCenter,
            Styles.mT10,
            Styles.p10,
          ]}>
          <Text
            style={[
              Styles.textTransformCap,
              {
                fontSize: MOBILE.textSize.normal,
                fontFamily: FONT_FAMILY.BOLD,
              },
            ]}>
            {selectedReason?.label}
          </Text>
          <Text
            style={[
              Styles.pT5,
              {
                fontSize: MOBILE.textSize.normal,
                fontFamily: FONT_FAMILY.REGULAR,
              },
            ]}>
            {selectedReason?.reason}
          </Text>
        </View>
      )}
    </View>
  );

  const handleSubmit = async (selectedOrder: any, selectedReason: any) => {
    try {
      const response = await axiosInstance.get<any>(
        `email-order-cancel?order_id=${selectedOrder.id}&reason_id=${selectedReason?.id}`,
      );
      if (response) {
        Toast.show({
          title: 'Rejection message has been sent to user',
        });
        setRejectionVisible(false);
        setSelectedReason(null);
      }
      setTimeout(() => {
        dispatch(activeOrders(userData?.userDetail));
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const OrderRow = ({
    label,
    value,
    secondaryLabel = '',
    secondaryValue = '',
    showSecondary = true,
  }: any) => (
    <View style={styles.row}>
      <View style={styles.col}>
        <Text style={styles.strong}>{label}</Text>
      </View>
      <View style={styles.col}>
        <Text>{value}</Text>
      </View>
      {showSecondary && (
        <>
          <View style={styles.col}>
            <Text style={styles.strong}>{secondaryLabel}</Text>
          </View>
          <View style={styles.col}>
            <Text>{secondaryValue}</Text>
          </View>
        </>
      )}
    </View>
  );

  const ProductItemDetail = ({ item }: any) => (
    <>
      <OrderRow
        label="Product Name:"
        value={item?.Product?.title}
        secondaryLabel="Description:"
        secondaryValue={item?.Product?.description}
      />
      {!!item?.ProductModifier && (
        <OrderRow
          label="Product Modifier Name:"
          value={item?.ProductModifier.modifier_name}
        />
      )}
      <OrderRow
        label="Product Size:"
        value={item?.ProductSize ? item?.ProductSize.scale_name : 'One Size'}
      />
      {item?.ProductAddons.length > 0 &&
        item?.ProductAddons.map((addonItem: any, index: any) => (
          <OrderRow
            key={index}
            label="Product Addon Name:"
            value={addonItem.addon_name}
          />
        ))}
    </>
  );
  const ProductItemReceipt = ({ item }: any) => (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: '60%', flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{item?.Product?.title}</Text>
          <Text>({item?.product_order_type})</Text>
        </View>

        {!(item?.product_order_type === 'Gift' && item?.new_order_id) && (
          <Text>{`$${
            item?.coupon_type === 'bogof'
              ? parseFloat(item?.amount_cad).toFixed(2)
              : parseFloat(
                  item?.Product?.price ||
                    item?.ProductScale?.price ||
                    item?.amount_cad,
                ).toFixed(2)
          }`}</Text>
        )}
      </View>
      {/* <OrderRow
        label="Product Name:"
        value={item?.Product?.title}
        secondaryLabel="Description:"
        secondaryValue={item?.Product?.description}
      /> */}
      {!!item?.ProductModifier && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '60%', flexDirection: 'row' }}>
            <Text style={{ fontWeight: 'bold' }}>
              {item?.ProductModifier.modifier_name}:
            </Text>
            <Text> (Modifier)</Text>
          </View>

          {!(item?.product_order_type === 'Gift') && (
            <Text>
              $
              {item?.coupon_type === 'bogof'
                ? parseFloat(0).toFixed(2)
                : (item?.ProductModifier?.price || 0).toFixed(2)}
            </Text>
          )}
        </View>
      )}
      {item?.ProductScale !== null && (
        <OrderRow
          label="Product Size:"
          value={
            item?.ProductScale ? item?.ProductScale?.scale_name : 'One Size'
          }
        />
      )}
      {item?.addons && Array.isArray(item?.addons) && item?.addons.length > 0
        ? item?.addons?.map((i: any, index: any) => (
            <View
              key={index}
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '60%', flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>{i.Addon.title}:</Text>
                <Text> (AddOn)</Text>
              </View>

              {!(item?.product_order_type === 'Gift') ? (
                <Text>
                  $
                  {item?.coupon_type === 'bogof'
                    ? parseFloat(0).toFixed(2)
                    : (i?.Addon?.price || 0).toFixed(2)}
                </Text>
              ) : null}
            </View>
          ))
        : null}

      <OrderRow
        {...(item?.product_order_type != 'Now'
          ? {
              label: 'T-ID/G-ID:',
              value: item?.custom_id.toString().toUpperCase(),
            }
          : {})}
      />
    </>
  );
  const MainDetailModal = ({
    visible,
    handleOk,
    selectedOrder,
    setLoadingState,
  }: any) => (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        setVisible && setVisible(false);
      }}>
      <ScrollView>
        <View style={styles.container}>
          <OrderRow
            label="Order Number:"
            value={selectedOrder?.reference_number}
          />
          <OrderRow
            label="Date of Transaction:"
            value={formatDate(selectedOrder?.createdAt)}
          />
          <OrderRow
            label="Time of Transaction:"
            value={formatTime(selectedOrder?.createdAt)}
            secondaryLabel="UserID:"
            secondaryValue={`U_${selectedOrder?.User?.id}`}
          />
          <OrderRow
            label="Customer Name:"
            value={selectedOrder?.User.username || ''}
          />
          <OrderRow
            label="Special Instructions:"
            value={selectedOrder?.special_instructions}
          />

          {selectedOrder?.OrderItems?.map((item: any, index: any) => (
            <ProductItemDetail key={index} item={item} />
          ))}
          {selectedOrder?.TransferRedeemItems?.map((item: any, index: any) => (
            <ProductItemDetail key={index} item={item} />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.button}
            onPress={async () => {
              setLoadingState(true);
              await handleOk();
              setLoadingState(false);
            }}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );

  const MainReceiptModal = ({
    visible,
    handleOk,
    selectedOrder,
    setLoadingState,
  }: any) => {
    let cacheSubTotal = 0;
    let cacheSubDiscount = 0;
    let tax = 0;
    selectedOrder?.OrderItems?.forEach((element: any) => {
      if (element?.amount_cad) {
        const isTaxFound = element.Product?.tax ? element.Product.tax : null;
        let taxValue = 0;
        let taxSource = '';
        if (isTaxFound && isTaxFound > 0) {
          taxValue = isTaxFound;
          taxSource = 'product';
        } else if (
          merchantSetting?.settings?.tax &&
          merchantSetting?.settings?.tax > 0
        ) {
          taxValue = merchantSetting?.settings?.tax;
          taxSource = 'merchant';
        } else if (
          adminSetting?.settings?.tax &&
          adminSetting?.settings?.tax > 0
        ) {
          taxValue = adminSetting?.settings?.tax;
          taxSource = 'admin';
        } else {
          taxValue = 0;
          taxSource = 'none';
        }
        tax = tax + (taxValue / 100) * (element?.amount_cad || 0);
      }
      cacheSubTotal +=
        // element.quantity *
        element && element?.amount_cad && element?.amount_cad > 0
          ? element?.amount_cad
          : 0;

      cacheSubDiscount +=
        element && element?.discount && element.discount > 0
          ? element?.discount
          : 0;
    });
    const totalTaxes = parseFloat(tax).toFixed(2); // parseFloat(cacheSubTotal * (tax / 100)).toFixed(2);
    const merchantEarned = parseFloat(
      cacheSubTotal + Number(totalTaxes) - Number(cacheSubDiscount),
    ).toFixed(2);
    const amount = parseFloat(
      cacheSubTotal +
        parseFloat(selectedOrder?.subtotal_sophali_tokens || 0).toFixed(2) -
        Number(cacheSubDiscount) +
        Number(totalTaxes),
    ).toFixed(2);
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}>
        <ScrollView>
          <View style={styles.container}>
            <OrderRow
              label="Purchase Order (P-ID):"
              value={`P_${selectedOrder?.reference_number.toUpperCase()}`}
              showSecondary={!selectedOrder?.onlyTransfer}
              secondaryLabel="Order_ID"
              secondaryValue={`${selectedOrder?.purchase_order_id}`}
            />

            <OrderRow
              label="Date of Transaction:"
              value={formatDate(selectedOrder?.createdAt)}
            />
            <OrderRow
              label="Time of Transaction:"
              value={formatTime(selectedOrder?.createdAt)}
              secondaryLabel="UserID:"
              secondaryValue={`U_${selectedOrder?.User?.id}`}
            />
            <OrderRow
              label="Customer Name:"
              value={
                selectedOrder?.User?.username ||
                `${selectedOrder?.User?.first_name || ''} ${selectedOrder?.User?.last_name || ''}`
              }
              secondaryLabel="MerchantID:"
              secondaryValue={`M_${selectedOrder?.Merchant?.id}`}
            />
            <OrderRow
              label="Merchant Name:"
              value={selectedOrder?.Merchant?.company_name}
              secondaryLabel="Merchant Address:"
              secondaryValue={selectedOrder?.Merchant?.address}
            />
            <OrderRow
              label="Special Instructions:"
              value={selectedOrder?.special_instructions || 'N/A'}
            />
            <View style={styles.dotLine}></View>
            {/* Order Detials */}
            {/*Header Section  */}
            <View style={styles.header}>
              <Text style={{ width: '40%', color: COLORS.white }}>Items</Text>
              <Text
                style={{
                  width: '20%',
                  textAlign: 'right',
                  color: COLORS.white,
                }}>
                Price
              </Text>
            </View>
            {selectedOrder?.OrderItems?.map((item: any, index: any) => (
              <ProductItemReceipt key={index} item={item} />
            ))}
            {selectedOrder?.TransferRedeemItems?.map(
              (item: any, index: any) => (
                <ProductItemReceipt key={index} item={item} />
              ),
            )}
            <View style={styles.hrline}></View>
            {/* rendering Bill */}
            <View style={styles.renderPrices}>
              <View style={styles.billtitle}>
                <Text>Sub Total: </Text>
                <Text>Tax: </Text>
                <Text>Discount: </Text>
                {selectedOrder?.Coupon?.title ? (
                  <Text>Coupon Title</Text>
                ) : null}

                {selectedOrder?.couponDiscount ? (
                  <Text>Coupon Discount: </Text>
                ) : null}
                {selectedOrder?.Coupon?.discountType ? (
                  <Text>Coupon Type</Text>
                ) : null}

                <Text>Sophali: </Text>
                <Text style={{ fontWeight: 'bold' }}>Total</Text>
                {/* <Text>Including Tax 16%</Text> */}
                <Text>Payment Status: </Text>
                {selectedOrder?.onlyTransfer ? null : (
                  <>
                    <Text>Order Picked By: </Text>
                    <Text>Order Picked Date: </Text>
                    <Text>Order Picked Time: </Text>
                  </>
                )}
              </View>
              <View style={styles.billamount}>
                <Text style={{ textAlign: 'right' }}>
                  ${(selectedOrder?.subtotal_usd || 0).toFixed(2)}
                </Text>
                <Text style={{ textAlign: 'right' }}>${totalTaxes}</Text>
                <Text style={{ textAlign: 'right' }}>
                  {'$' + cacheSubDiscount.toFixed(2)}
                </Text>
                {selectedOrder?.Coupon?.title ? (
                  <Text
                    style={[
                      Styles.textTransformCap,
                      { fontSize: 12, textAlign: 'right' },
                    ]}>
                    {selectedOrder?.Coupon?.title}
                  </Text>
                ) : null}
                {selectedOrder?.couponDiscount ? (
                  <Text style={{ textAlign: 'right' }}>
                    ${parseFloat(selectedOrder?.couponDiscount || 0).toFixed(2)}
                  </Text>
                ) : null}
                {selectedOrder?.Coupon?.discountType ? (
                  <Text
                    style={[
                      Styles.textTransformCap,
                      { fontSize: 12, textAlign: 'right' },
                    ]}>
                    {selectedOrder?.Coupon?.discountType === 'bogof'
                      ? 'Buy One Get One Free'
                      : selectedOrder?.Coupon?.discountType}
                  </Text>
                ) : null}
                <Text style={{ textAlign: 'right' }}>
                  {'$' +
                    parseFloat(
                      selectedOrder?.subtotal_sophali_tokens || 0,
                    ).toFixed(2)}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}>
                  ${parseFloat(selectedOrder?.amount_cad).toFixed(2)}
                </Text>
                <Text style={{ textAlign: 'right' }}>
                  {selectedOrder?.payment_status || ''}
                </Text>
                {selectedOrder?.onlyTransfer ? null : (
                  <>
                    <Text style={{ textAlign: 'right' }}>
                      {selectedOrder?.ReceiverUser?.username || ''}
                    </Text>
                    <Text style={{ textAlign: 'right' }}>
                      {convertDate(selectedOrder?.updatedAt) || ''}
                    </Text>
                    <Text style={{ textAlign: 'right' }}>
                      {convertTime(selectedOrder?.updatedAt) || ''}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              activeOpacity={0.7}
              onPress={async () => {
                setLoadingState(true);
                await handleOk();
                setLoadingState(false);
              }}>
              <View style={styles.closeBtnBtn}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              setLoadingState(true);
              await handleOk();
              setLoadingState(false);
            }}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View> */}
        </ScrollView>
      </Modal>
    );
  };
  //Making Summary Content

  const [summary, setSummary] = useState<any>();

  const fetchSummary = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get(
        `order/order-summary?merchant_id=${id}`,
      );
      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSummary();
  }, [orderNewArray]);

  const x = 0;
  const titlearray: any = [];

  summary?.orderSummary?.map((i: any) => {
    i?.OrderItems?.map((item: any) => {
      item?.ProductScale !== null
        ? titlearray.push(
            item?.Product?.title + '(' + item?.ProductScale?.scale_name + ')',
          )
        : titlearray.push(item?.Product?.title);
      item?.addons?.length &&
        item?.addons?.map((a: any) => titlearray.push(a.title));
      item?.ProductModifier &&
        titlearray.push(item?.ProductModifier?.modifier_name);
    });
    i?.TransferRedeemItems?.map((item: any) => {
      item?.ProductScale !== null
        ? titlearray.push(
            item?.Product?.title + '(' + item?.ProductScale?.scale_name + ')',
          )
        : titlearray.push(item?.Product?.title);
      item?.addons?.length &&
        item?.addons?.map((a: any) => titlearray.push(a.title));
      item?.ProductModifier &&
        titlearray.push(item?.ProductModifier?.modifier_name);
    });
  });

  const frequency: any = {};
  titlearray.forEach((element: any) => {
    frequency[element] = frequency[element] ? frequency[element] + 1 : 1;
  });
  let summaryCount: any = 0;
  for (const key in frequency) {
    summaryCount += frequency[key];
  }
  let totalNumberOfOrder = 0;
  orderNewArray.map(
    (item: any) => (totalNumberOfOrder += item?.OrderItems.length),
  );
  let preparingOrder = 0;
  orderNewArray.map((item: any) => {
    if (item?.status === 'preparing') {
      preparingOrder += 1;
    }
  });
  const RenderOrderSummary = () => (
    <View style={[Styles.w100]}>
      <View style={styles.orderSummary}>
        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Summary ({summaryCount} items in {orderNewArray.length} Orders)
        </Text>
      </View>
      <View style={{ height: deviceHeight / 6, padding: 3 }}>
        <ScrollView contentContainerStyle={[Styles.pB30]}>
          {!isEmpty(frequency) ? (
            Object.keys({ ...frequency }).map(key => (
              <View
                style={{
                  ...styles.orderSummaryContent,
                }}
                key={key}>
                <Text>
                  ({frequency[key]}){key}
                </Text>
              </View>
            ))
          ) : (
            <View>
              <Text style={{ color: COLORS.gray, textAlign: 'center' }}>
                Kitchen is prepare nothing right now
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );

  const HeaderRow = () =>
    favorite === 'trans' ? (
      <View style={styles.headerRow}>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          T_ID
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Customer Name
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Order Price
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Total Time
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Special Instruction
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Details
        </Text>
      </View>
    ) : (
      <View style={styles.headerRow}>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          {favorite === 'Completed' ? 'Order Number' : 'P_ID'}
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Customer Name
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Order Price
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Total Time
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCell}>
          Instructions
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCellDouble}>
          Status
        </Text>
        <Text size={MOBILE.textSize.normal} style={styles.headerCellTriple}>
          Actions
        </Text>
      </View>
    );

  const List =
    favorite === 'trans'
      ? (transfer &&
          transfer.length > 0 &&
          transfer.flatMap((i: any) => i.OrderItems)) ||
        []
      : (orderNewArray && orderNewArray.length > 0 && orderNewArray) || [];
  const p =
    searchText && searchText.length > 0 && favorite === 'trans'
      ? filterSearch
      : List;

  function renderContent() {
    if (loadingState) {
      return (
        <Spinner
          size={50}
          style={{
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      );
    } else {
      return (
        <View style={[Styles.flex, Styles.w100]}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={[Styles.w100, Styles.flexGrow]}
            contentContainerStyle={[Styles.pB30]}>
            <View style={[Styles.flex, Styles.w100]}>
              {favorite == 'New' || favorite === 'trans' ? (
                <RenderOrderSummary />
              ) : null}
              {pickUp && (
                <PickUpOrder
                  pickUp={pickUp}
                  setPickUp={setPickUp}
                  pickedUpOrder={pickedUpOrder}
                />
              )}
              {!pickUp && (
                <View style={[Styles.w100]}>
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                      marginVertical: 10,
                    }}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                          backgroundColor:
                            favorite === 'New' ? COLORS.green : '#F3F7FF',
                          borderRadius: 50,
                          marginHorizontal: 5,
                        }}
                        onPress={() => {
                          setFavorite('New');
                        }}>
                        <Text
                          lines={1}
                          weight={WEIGHT.w600}
                          fontFamily={FONT_FAMILY.SEMI_BOLD}
                          style={{
                            paddingHorizontal: 26,
                            paddingVertical: 6,
                            // width: 180,
                            lineHeight: 14 * 1.5,
                            color:
                              favorite === 'New' ? COLORS.white : COLORS.gray,
                            textAlign: 'center',
                          }}>
                          Order Queue
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                          backgroundColor:
                            favorite === 'trans' ? COLORS.green : '#F3F7FF',
                          borderRadius: 50,
                          marginHorizontal: 5,
                        }}
                        onPress={() => {
                          setFavorite('trans');
                        }}>
                        <Text
                          weight={WEIGHT.w600}
                          fontFamily={FONT_FAMILY.SEMI_BOLD}
                          lines={1}
                          style={{
                            paddingHorizontal: 26,
                            paddingVertical: 6,
                            // width: 180,
                            lineHeight: 14 * 1.5,
                            color:
                              favorite === 'trans' ? COLORS.white : COLORS.gray,
                            textAlign: 'center',
                          }}>
                          Transfers
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                          backgroundColor:
                            favorite === 'Declined' ? COLORS.carrot : '#F3F7FF',
                          borderRadius: 50,
                          marginHorizontal: 5,
                        }}
                        onPress={() => setFavorite('Declined')}>
                        <Text
                          weight={WEIGHT.w600}
                          fontFamily={FONT_FAMILY.SEMI_BOLD}
                          style={{
                            paddingHorizontal: 26,
                            // width: 150,
                            paddingVertical: 6,
                            lineHeight: 14 * 1.5,
                            color:
                              favorite === 'Declined'
                                ? COLORS.white
                                : COLORS.gray,

                            textAlign: 'center',
                          }}>
                          Declined
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                          backgroundColor:
                            favorite === 'Completed' ? COLORS.green : '#F3F7FF',
                          borderRadius: 50,
                          marginHorizontal: 5,
                        }}
                        onPress={() => setFavorite('Completed')}>
                        <Text
                          lines={1}
                          weight={WEIGHT.w600}
                          fontFamily={FONT_FAMILY.SEMI_BOLD}
                          style={{
                            paddingHorizontal: 26,
                            paddingVertical: 6,
                            // width: 170,
                            lineHeight: 14 * 1.5,
                            color:
                              favorite === 'Completed'
                                ? COLORS.white
                                : COLORS.gray,

                            textAlign: 'center',
                          }}>
                          Completed
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                  {favorite === 'trans' ? (
                    <View style={styles.searchBar}>
                      <InputField
                        placeholder="Search Orders By T_IDs"
                        onchange={(v: string) => {
                          setSearchText(v);
                          handleSearch(v);
                        }}
                        containerStyle={{
                          height: scaleSize(40),
                        }}
                        value={searchText}
                        icon={<SearchSvg color={COLORS.gray} />}
                      />
                    </View>
                  ) : null}

                  <HeaderRow />
                  <View
                    style={{
                      height:
                        favorite === 'New' || favorite === 'trans'
                          ? deviceHeight / 2.8
                          : deviceHeight / 1.5,
                    }}>
                    <ScrollView
                      style={[Styles.w100, Styles.flexGrow]}
                      contentContainerStyle={[Styles.pB65]}
                      nestedScrollEnabled>
                      {favorite === 'trans' && searchloading ? (
                        <Spinner
                          size={50}
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20,
                          }}
                        />
                      ) : favorite === 'trans' ? (
                        p.map((item: any, index: any) => (
                          // item?.Order.status === 'new' ?
                          // (
                          <View
                            key={index}
                            style={
                              index % 2 === 0 ? styles.evenRow : styles.oddRow
                            }>
                            <Text
                              style={[
                                styles.cell,
                                { textTransform: 'uppercase' },
                              ]}>
                              {favorite === 'trans'
                                ? item?.custom_id || 'N/A'
                                : favorite === 'Completed'
                                  ? (item && item?.purchase_order_id) || ''
                                  : 'P_' + item && item?.reference_number}
                            </Text>

                            <Text style={styles.cell}>
                              {item && item?.Order?.User?.username}
                            </Text>
                            <Text style={styles.cell}>
                              $
                              {parseFloat(item?.amount_cad || 0).toFixed(2) ||
                                0}
                            </Text>
                            <Text style={styles.cell}>
                              {item?.Product?.time}mins
                            </Text>
                            <Text style={styles.cell}>
                              {item?.Order?.special_instructions?.length &&
                              item?.Order?.special_instructions?.length > 0
                                ? 'Yes'
                                : 'No'}
                            </Text>
                            <TouchableOpacity
                              activeOpacity={0.7}
                              // disabled={true}
                              style={{
                                backgroundColor: COLORS.green,
                                borderRadius: 50,
                                // marginHorizontal: 5,
                              }}
                              onPress={async () => {
                                item.viewed = true;
                                setLoadingState(true);
                                await handleDetailsClick(item);
                                await setView(true);
                                setLoadingState(false);
                                toggleOrderDetailModal();
                                setTid(item?.custom_id);
                              }}>
                              <Text
                                style={{
                                  textTransform: 'capitalize',
                                  lineHeight: 24 * 1.2,
                                  color: COLORS.white,
                                  paddingRight: 10,
                                  paddingLeft: 10,
                                }}
                                lines={1}>
                                View
                              </Text>
                            </TouchableOpacity>
                          </View>
                          // )
                          // : null
                        ))
                      ) : (
                        List.map((item: any, index: any) => (
                          <View
                            key={index}
                            style={
                              index % 2 === 0 ? styles.evenRow : styles.oddRow
                            }>
                            <Text
                              size={MOBILE.textSize.common}
                              style={[
                                styles.cell,
                                { textTransform: 'uppercase' },
                              ]}>
                              {favorite === 'trans'
                                ? item?.custom_id || 'N/A'
                                : favorite === 'Completed'
                                  ? item && item?.purchase_order_id
                                  : `P_${item && item?.reference_number}`}
                            </Text>
                            <Text
                              size={MOBILE.textSize.common}
                              style={styles.cell}>
                              {item && item?.User?.username}
                            </Text>
                            <Text
                              size={MOBILE.textSize.common}
                              style={styles.cell}>
                              ${item?.amount_cad || 0}
                            </Text>
                            <Text
                              size={MOBILE.textSize.common}
                              style={styles.cell}>
                              {item?.total_time_in_minutes} mins
                            </Text>
                            <Text
                              size={MOBILE.textSize.common}
                              style={styles.cell}>
                              {item?.special_instructions?.length > 0
                                ? 'Yes'
                                : 'No'}
                            </Text>
                            <View style={styles.cellWrapperDouble}>
                              {item?.status && item?.status != 'new' ? (
                                <>
                                  {item?.status === 'prepared' ||
                                  item?.status === 'closed' ||
                                  item?.status === 'cancelled' ? (
                                    <View
                                      style={{
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        flexDirection: 'row',
                                      }}>
                                      <Text
                                        size={MOBILE.textSize.common}
                                        style={{
                                          textTransform: 'capitalize',

                                          // lineHeight: 24 * 1.2,
                                          color:
                                            item?.status == 'cancelled'
                                              ? COLORS.black
                                              : item?.collected_color,
                                          // paddingRight: 10,
                                          // paddingLeft: 10,
                                        }}
                                        lines={1}>
                                        {item?.status == 'cancelled'
                                          ? 'Rejected'
                                          : item?.status.toUpperCase()}
                                      </Text>
                                    </View>
                                  ) : (
                                    item?.status === 'preparing' && (
                                      <>
                                        {item?.onlyTransfer ? (
                                          <Text size={MOBILE.textSize.common}>
                                            Pick Later
                                          </Text>
                                        ) : (
                                          <TimerTick item={item} />
                                        )}
                                      </>
                                    )
                                  )}
                                </>
                              ) : (
                                <View
                                  style={{
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    flexDirection: 'row',
                                    // marginBottom: 12,
                                  }}>
                                  <Text
                                    size={MOBILE.textSize.common}
                                    style={{
                                      textTransform: 'capitalize',

                                      // lineHeight: 24 * 1.2,
                                      color:
                                        item?.status == 'cancelled'
                                          ? COLORS.black
                                          : item?.collected_color,
                                      // paddingRight: 10,
                                      // paddingLeft: 10,
                                    }}
                                    lines={1}>
                                    {item?.status == 'cancelled'
                                      ? 'Rejected'
                                      : item?.status.toUpperCase()}
                                  </Text>
                                </View>
                              )}
                            </View>
                            <View style={styles.cellWrapperTriple}>
                              {item?.status !== 'closed' ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                    marginTop: 10,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'flex-end',
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      marginBottom: 12,
                                    }}>
                                    {item?.status === 'new' ||
                                    item?.status === 'preparing' ||
                                    item?.status === 'prepared' ? (
                                      <>
                                        <TouchableOpacity
                                          activeOpacity={0.7}
                                          // disabled={true}
                                          style={{
                                            backgroundColor:
                                              item?.status == 'new' ||
                                              item?.status == 'closed' ||
                                              item?.status === 'preparing' ||
                                              item?.status === 'prepared'
                                                ? COLORS.green
                                                : COLORS.transparent,
                                            borderRadius: 50,
                                            // marginHorizontal: 5,
                                          }}
                                          onPress={async () => {
                                            item.viewed = true;
                                            setLoadingState(true);
                                            await handleDetailsClick(item);
                                            await setView(true);
                                            setLoadingState(false);
                                            toggleOrderDetailModal();
                                          }}>
                                          <Text
                                            size={MOBILE.textSize.common}
                                            style={{
                                              textTransform: 'capitalize',
                                              lineHeight: 24 * 1.2,
                                              color: COLORS.white,
                                              paddingRight: 10,
                                              paddingLeft: 10,
                                            }}
                                            lines={1}>
                                            View
                                          </Text>
                                        </TouchableOpacity>
                                        {item?.status === 'new' ? (
                                          <TouchableOpacity
                                            disabled={
                                              favorite === 'trans'
                                                ? true
                                                : !item.viewed
                                            }
                                            style={{
                                              backgroundColor:
                                                item?.product_order_type ===
                                                'Transfer'
                                                  ? 'grey'
                                                  : (item?.status === 'new' ||
                                                        item?.status ===
                                                          'closed') &&
                                                      item.viewed
                                                    ? COLORS.green
                                                    : 'grey',
                                              borderRadius: 50,
                                              marginLeft: 5,
                                            }}
                                            activeOpacity={0.7}
                                            onPress={() => acceptOrder(item)}>
                                            <Text
                                              size={MOBILE.textSize.common}
                                              style={{
                                                textTransform: 'capitalize',
                                                lineHeight: 24 * 1.2,
                                                color: COLORS.white,
                                                paddingRight: 10,
                                                paddingLeft: 10,
                                              }}
                                              lines={1}>
                                              {item?.status == 'new'
                                                ? 'Accept'
                                                : null}
                                            </Text>
                                          </TouchableOpacity>
                                        ) : null}
                                        {item?.status === 'preparing' ||
                                        item?.status === 'cancelled' ? (
                                          <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={{
                                              borderRadius: 50,
                                              // marginHorizontal: 5,
                                              marginLeft: 5,
                                              backgroundColor:
                                                item?.status == 'new'
                                                  ? 'grey'
                                                  : COLORS.green,
                                            }}
                                            disabled={item?.status == 'new'}
                                            onPress={() => orderPrepared(item)}>
                                            <Text
                                              size={MOBILE.textSize.common}
                                              style={{
                                                textTransform: 'capitalize',
                                                lineHeight: 24 * 1.2,
                                                color: COLORS.white,
                                                paddingRight: 10,
                                                paddingLeft: 10,
                                              }}
                                              lines={1}>
                                              Alert
                                            </Text>
                                          </TouchableOpacity>
                                        ) : null}
                                      </>
                                    ) : item?.status == 'preparing' ? (
                                      <>
                                        <TouchableOpacity
                                          activeOpacity={0.7}
                                          style={{
                                            backgroundColor:
                                              item?.status == 'new' ||
                                              item?.status == 'closed'
                                                ? COLORS.green
                                                : COLORS.transparent,
                                            borderRadius: 50,
                                            // marginHorizontal: 5,
                                          }}
                                          onPress={async () => {
                                            item.viewed = true;
                                            setLoadingState(true);
                                            await handleDetailsClick(item);
                                            await setView(true);
                                            setLoadingState(false);
                                          }}>
                                          <Text
                                            size={MOBILE.textSize.common}
                                            style={{
                                              textTransform: 'capitalize',
                                              lineHeight: 24 * 1.2,
                                              color: COLORS.white,
                                              paddingRight: 10,
                                              paddingLeft: 10,
                                            }}
                                            lines={1}>
                                            View
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          activeOpacity={0.7}
                                          style={{
                                            backgroundColor: COLORS.green,
                                            borderRadius: 50,
                                            // marginHorizontal: 5,
                                          }}
                                          onPress={() => orderPrepared(item)}>
                                          <Text
                                            size={MOBILE.textSize.common}
                                            style={{
                                              textTransform: 'capitalize',
                                              lineHeight: 24 * 1.2,
                                              color: COLORS.white,
                                              paddingRight: 10,
                                              paddingLeft: 10,
                                            }}
                                            lines={1}>
                                            Alert
                                          </Text>
                                        </TouchableOpacity>
                                      </>
                                    ) : item?.status == 'cancelled' ? (
                                      <>
                                        <TouchableOpacity
                                          activeOpacity={0.7}
                                          style={{
                                            backgroundColor: 'green',
                                            borderRadius: 50,
                                            // marginHorizontal: 5,
                                          }}
                                          onPress={async () => {
                                            item.viewed = true;
                                            setLoadingState(true);
                                            await handleDetailsClick(item);
                                            await setView(true);
                                            setLoadingState(false);
                                            toggleOrderDetailModal();
                                          }}>
                                          <Text
                                            size={MOBILE.textSize.common}
                                            style={{
                                              textTransform: 'capitalize',
                                              lineHeight: 24 * 1.2,
                                              color: COLORS.white,
                                              paddingRight: 10,
                                              paddingLeft: 10,
                                            }}
                                            lines={1}>
                                            View
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          disabled={
                                            item?.messageAlert === 'declined'
                                              ? true
                                              : false
                                          }
                                          style={{
                                            backgroundColor:
                                              item?.messageAlert === 'declined'
                                                ? COLORS.gray
                                                : COLORS.carrot,
                                            borderRadius: 50,
                                            // marginHorizontal: 5,
                                          }}
                                          activeOpacity={0.7}
                                          onPress={() =>
                                            openRejectionModal(item)
                                          }>
                                          <Text
                                            size={MOBILE.textSize.common}
                                            style={{
                                              textTransform: 'capitalize',
                                              lineHeight: 24 * 1.2,
                                              color: COLORS.white,
                                              paddingRight: 10,
                                              paddingLeft: 10,
                                            }}
                                            lines={1}>
                                            {item?.status == 'cancelled'
                                              ? ' Alert'
                                              : ''}
                                          </Text>
                                        </TouchableOpacity>
                                      </>
                                    ) : null}
                                  </View>

                                  {item?.status != 'cancelled' &&
                                  item?.status !== 'prepared' ? (
                                    <View
                                      style={{
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        marginBottom: 12,
                                      }}>
                                      <TouchableOpacity
                                        disabled={
                                          item?.status == 'preparing' ||
                                          !item.viewed
                                        }
                                        style={{
                                          backgroundColor:
                                            item?.status == 'preparing' ||
                                            !item.viewed
                                              ? COLORS.gray
                                              : COLORS.carrot,
                                          borderRadius: 50,
                                          marginLeft: 5,
                                        }}
                                        activeOpacity={0.7}
                                        onPress={() => cancelOrder(item)}>
                                        <Text
                                          size={MOBILE.textSize.common}
                                          style={{
                                            textTransform: 'capitalize',
                                            lineHeight: 24 * 1.2,
                                            color: COLORS.white,
                                            paddingRight: 10,
                                            paddingLeft: 10,
                                          }}
                                          lines={1}>
                                          {item?.status != 'cancelled'
                                            ? ' Reject'
                                            : ''}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  ) : item?.status == 'prepared' ? (
                                    <View
                                      style={{
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        marginBottom: 12,
                                      }}>
                                      <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                          backgroundColor: COLORS.green,
                                          borderRadius: 50,
                                          // marginHorizontal: 5,
                                        }}
                                        onPress={() => {
                                          setPickUp(true);
                                          setPickedUpOrder(item);
                                        }}>
                                        <Text
                                          size={MOBILE.textSize.common}
                                          style={{
                                            textTransform: 'capitalize',
                                            lineHeight: 24 * 1.2,
                                            color: COLORS.white,
                                            paddingRight: 10,
                                            paddingLeft: 10,
                                          }}
                                          lines={1}>
                                          Pick Up
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  ) : null}
                                </View>
                              ) : (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                    marginTop: 10,
                                  }}>
                                  <View
                                    style={{
                                      justifyContent: 'flex-end',
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      marginBottom: 12,
                                    }}>
                                    <TouchableOpacity
                                      activeOpacity={0.7}
                                      style={{
                                        backgroundColor: COLORS.green,
                                        borderRadius: 50,
                                        // marginHorizontal: 5,
                                      }}
                                      onPress={() => {
                                        item.viewed = true;
                                        handleDetailsClick(item);
                                        setView(true);
                                      }}>
                                      <Text
                                        size={MOBILE.textSize.common}
                                        style={{
                                          textTransform: 'capitalize',
                                          lineHeight: 24 * 1.2,
                                          color: COLORS.white,
                                          paddingRight: 10,
                                          paddingLeft: 10,
                                        }}
                                        lines={1}>
                                        Receipt
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              )}
                            </View>
                          </View>
                        ))
                      )}
                    </ScrollView>
                  </View>
                </View>
              )}
              {visible &&
                (selectedOrder?.status !== 'closed' ? (
                  <OrderModel
                    visible={orderDetialModal}
                    toggleOrderDetailModal={toggleOrderDetailModal}
                    item={selectedOrder}
                    favorite={favorite}
                    transid={transid}
                  />
                ) : (
                  <MainReceiptModal
                    visible={visible}
                    handleOk={handleOk}
                    selectedOrder={selectedOrder}
                    setLoadingState={setLoadingState}
                  />
                ))}

              {rejectionVisible && (
                <Modal
                  visible={rejectionVisible}
                  animationType="fade"
                  onRequestClose={() => {
                    setRejectionVisible(false);
                    setSelectedReason(null);
                  }}
                  transparent={true}>
                  <View style={styles.modalContainer}>
                    <RejectionReasonSelect
                      reasons={reasons}
                      onValueChange={onSelectReason}
                      value={selectedReason}
                    />
                    <Button
                      title="Submit"
                      disabled={!selectedReason}
                      onPress={() =>
                        handleSubmit(selectedOrder, selectedReason)
                      }
                    />
                    <Button
                      containerStyle={{ marginTop: 10 }}
                      title="Back to KOB"
                      onPress={() => {
                        setRejectionVisible(false);
                        setSelectedReason(null);
                      }}
                    />
                  </View>
                </Modal>
              )}
            </View>
          </ScrollView>
        </View>
      );
    }
  }

  return (
    <View style={[Styles.w100, Styles.primaryBackground, Styles.flex]}>
      <TopNavigation currentScreen={'OrdersList'} />
      {renderHeader()}
      {renderContent()}
    </View>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingVertical: 10,
    backgroundColor: 'lightgrey',
    width: '100%',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  evenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  oddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerCellDouble: {
    flex: 2,
    fontWeight: 'bold',
  },
  headerCellTriple: {
    flex: 3,
    fontWeight: 'bold',
  },
  cellWrapperDouble: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  cellWrapperTriple: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    // flexDirection: 'column',
  },
  selectContainer: {
    width: '100%',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  col: {
    width: '25%', // Assuming 4 columns
  },
  strong: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  button: {
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(10),
    backgroundColor: COLORS.customButton,
  },
  buttonText: {
    color: 'white',
  },
  orderSummary: {
    paddingHorizontal: scaleSize(10),
    // marginVertical: 10,
    backgroundColor: 'lightgrey',
    paddingVertical: scaleSize(10),
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  orderSummaryContent: {
    paddingHorizontal: scaleSize(5),
    paddingVertical: scaleSize(5),
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  searchBar: {
    paddingHorizontal: 20,
    marginBottom: scaleSize(10),
  },
  mainView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  subView1: {
    flexDirection: 'row',
  },
  subView1_2: {
    flex: 1,
    gap: 2,
  },
  subView2: {
    marginTop: 20,
  },
  dotLine: {
    borderColor: 'black',
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginVertical: 25,
  },
  hrline: {
    borderColor: 'black',
    borderBottomWidth: 1,
    // height: 1,
    borderStyle: 'solid',
    marginVertical: 25,
  },
  header: {
    borderRadius: 5,
    backgroundColor: 'cadetblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  renderitem: {
    borderRadius: 5,
    // backgroundColor: 'cadetblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    // marginVertical: 15
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text_: {
    fontSize: 11,
  },
  renderPrices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billtitle: {
    gap: 10,
  },
  billamount: {
    gap: 10,
  },
  closeBtn: {
    marginVertical: 20,
    backgroundColor: COLORS.green,
    paddingVertical: 15,
    borderRadius: 50,
  },
  closeBtnBtn: {
    alignItems: 'center',
  },
});
