import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ArrowSvg } from '../svg';
import { COLORS, Text } from '../constants';
import moment from 'moment';
import { axiosInstance } from '../config/axios';
import { useAppSelector } from '../redux/Store';
import Styles from '../utils/styles';
import { HEADERS, isSubMerchant } from '../utils/helpers';
import { addOns } from '../redux/merchant/addOns/addOnsReducer';
import { MOBILE } from '../utils/orientation';
import Header from './Header';
import { scaleSize } from '../utils/mixins';

const OrderModel = ({
  visible,
  toggleOrderDetailModal,
  item,
  favorite,
  transid,
  user_name,
}: any) => {
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [orderDetails, setOrderDetails] = useState<any>();
  const [adminSetting, setAdminSetting] = useState<any>({});
  const [merchantSetting, setMerchantSetting] = useState<any>({});
  const [purchaseId, setPuschaseId] = useState<any>();
  const [orderId, setOrderId] = useState<any>();
  const [orderStatus, setOrderStatus] = useState<any>();
  const [instruction, setInstruction] = useState<any>();
  const [paymentStatus, setPaymentStatus] = useState<any>();
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [sophaliFee, setSophaliFee] = useState<any>(0);
  const isSubMerchantRole = isSubMerchant(user?.role?.name);

  const fullAddress = item
    ? [
        item?.User?.street_number || '',
        item?.User?.street_name || '',
        item?.User?.address || '',
        item?.User?.city || '',
        item?.User?.state || '',
        item?.User?.country?.toUpperCase() || '',
      ]
        .filter(value => value !== '')
        .join(', ')
    : '';
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

  const toggleModal = () => {
    toggleOrderDetailModal();
  };

  const getDataAdmin = async () => {
    try {
      const res = await axiosInstance.get<any>('setting/admin/1');
      setAdminSetting(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const viewOrder = useCallback(async () => {
    try {
      const res = await axiosInstance.post<any>(
        'merchants/view-order',
        {
          order_id: favorite === 'trans' ? item?.order_id : item?.id,
        },
        HEADERS,
      );
      setMerchantInfo(res?.data?.orderDetail?.Merchant);
      setSophaliFee(res?.data?.orderDetail?.subtotal_sophali_tokens || 0);
      setPuschaseId(res?.data?.orderDetail?.reference_number);
      setOrderId(res?.data?.orderDetail?.purchase_order_id);
      setOrderStatus(res?.data?.orderDetail?.status);
      setInstruction(res?.data?.orderDetail?.special_instructions);
      setPaymentStatus(res?.data?.orderDetail?.payment_status);
      const itemsData = [
        ...(res.data?.orderDetail?.OrderItems || []),
        ...(res.data?.orderDetail?.TransferRedeemItems || []),
      ];
      const sortedData = itemsData.sort((a, b) => {
        const orderTypeA = a.product_order_type.toUpperCase(); // Convert to uppercase for case-insensitive comparison
        const orderTypeB = b.product_order_type.toUpperCase();
        if (orderTypeA < orderTypeB) {
          return -1;
        }
        if (orderTypeA > orderTypeB) {
          return 1;
        }
        return 0; // if equals
      });
      setOrderDetails(sortedData);
    } catch (error) {}
  }, [item]);

  useEffect(() => {
    viewOrder();
    getDataMerChant();
    getDataAdmin();
  }, []);

  //Static data for items
  const orderDate = orderDetails?.orderDetail?.createdAt;
  const formattedDate = moment(orderDate).format('YYYY-MM-DD');
  let total = 0;
  orderDetails?.orderDetail?.OrderItems.map((item: any) => {
    if (favorite === 'trans') {
      if (
        item.product_order_type === 'Transfer' &&
        item.custom_id === transid
      ) {
        total += item.amount_cad;
      }
    } else {
      total += item.amount_cad;
    }
  });
  const q =
    orderDetails?.filter(
      (i: any) =>
        i.product_order_type === 'Transfer' && i.custom_id === transid,
    ) || [];

  const p = favorite === 'trans' ? q : orderDetails;
  let cacheSubTotal = 0;
  let cacheSubDiscount = 0;
  let tax = 0;
  p?.forEach((element: any) => {
    if (element.amount_cad) {
      const isTaxFound = element?.Product?.tax ? element?.Product?.tax : null;
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
      tax = tax + (taxValue / 100) * element.amount_cad;
    }
    const itemSubTotal =
      // element.quantity *
      element && element.amount_cad && element.amount_cad > 0
        ? element.amount_cad
        : 0;

    // Apply discount to the subtotal
    const itemDiscount =
      element && element.Product.discount && element.Product.discount > 0
        ? (element.Product.discount / 100) * itemSubTotal
        : 0;
    cacheSubTotal += itemSubTotal;
    cacheSubDiscount += itemDiscount;
  });
  const totalTaxes = parseFloat(tax).toFixed(2); // parseFloat(cacheSubTotal * (tax / 100)).toFixed(2);
  const merchantEarned = parseFloat(
    cacheSubTotal + parseFloat(totalTaxes) - parseFloat(cacheSubDiscount),
  ).toFixed(2);
  let amount = parseFloat(
    cacheSubTotal +
      (sophaliFee || 0) -
      parseFloat(cacheSubDiscount) +
      parseFloat(totalTaxes),
  ).toFixed(2);
  const discount = parseFloat(cacheSubDiscount).toFixed(2);
  if (item?.couponDiscount) {
    if (item?.Coupon?.discountType === 'deals') {
      amount = parseFloat(amount) + parseFloat(item?.couponDiscount || 0);
    } else {
      amount = parseFloat(amount) - parseFloat(item?.couponDiscount || 0);
    }
  }
  const getColor = type =>
    type === 'Transfer'
      ? COLORS.green
      : type === 'Gift'
        ? COLORS.blue
        : COLORS.black;

  return (
    <View>
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={toggleModal}>
        <View style={[Styles.flex, Styles.w100]}>
          <Header title={'Details'} onPress={toggleModal} />

          <View style={styles.mainView}>
            <View style={styles.subView1}>
              <View style={styles.subView1_2}>
                <Text size={MOBILE.textSize.mSmall} style={styles.heading}>
                  Customer:
                </Text>
                <Text size={MOBILE.textSize.mSmall}>
                  Sold to:{' '}
                  {favorite === 'trans'
                    ? item?.Order?.User?.username
                    : item?.User?.username || ''}
                </Text>
                {/* <Text size={MOBILE.textSize.mSmall}>Company:</Text> */}
                <Text size={MOBILE.textSize.mSmall} style={[Styles.pR5]}>
                  Customer Address: {fullAddress ? fullAddress : 'Not Provided'}
                </Text>
              </View>
              <View style={styles.subView1_2}>
                <Text size={MOBILE.textSize.mSmall} style={styles.heading}>
                  Orders:{' '}
                </Text>
                {orderStatus === 'prepared' && (
                  <Text size={MOBILE.textSize.mSmall}>Order No: {orderId}</Text>
                )}

                <View style={[Styles.flexDirectionRow]}>
                  <Text size={MOBILE.textSize.mSmall}>Purchase Order ID:</Text>
                  <Text
                    size={MOBILE.textSize.mSmall}
                    style={{ textTransform: 'uppercase' }}>
                    P_{purchaseId}
                  </Text>
                </View>
                <Text size={MOBILE.textSize.mSmall}>
                  Order Date: {formattedDate}
                </Text>
              </View>
            </View>
            {/* Special Instruction */}
            <View style={styles.subView2}>
              <Text size={MOBILE.textSize.mSmall} style={styles.heading}>
                Special Instruction
              </Text>
              <Text size={MOBILE.textSize.mSmall}>
                {instruction || 'Not Specified'}
              </Text>
            </View>
            {/* Merchant  Details */}
            <View style={styles.subView2}>
              <Text style={styles.heading}>Merchant:</Text>
              <Text size={MOBILE.textSize.mSmall}>
                Name: {merchantInfo?.company_name}
              </Text>
              <Text size={MOBILE.textSize.mSmall}>
                Address: {merchantInfo?.address || ''}
              </Text>
            </View>
            {/* Doted Line */}
            <View style={styles.dotLine}></View>
            {/* Order Detials */}
            <ScrollView>
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
              {/* Rendering The Items  */}
              {p &&
                p.map((item: any, index: any) => (
                  <View style={styles.renderitem} key={index}>
                    <View
                      style={{
                        width: '40%',
                      }}>
                      <Text style={{ color: 'green' }}>
                        {item.product_order_type === 'Transfer'
                          ? 'Pick Later'
                          : item.product_order_type === 'Now'
                            ? 'Pick Now'
                            : item.product_order_type}
                      </Text>

                      {item?.ProductScale !== null ? (
                        <Text
                          style={{
                            color: getColor(item?.product_order_type),
                          }}>
                          {item?.Product?.title} (
                          {item?.ProductScale?.scale_name})
                        </Text>
                      ) : (
                        <Text
                          style={{
                            ...Styles.textTransformCap,

                            color: getColor(item?.product_order_type),
                          }}>
                          {item?.Product?.title}
                        </Text>
                      )}
                      {item.ProductModifier !== null ? (
                        <Text
                          style={{
                            ...Styles.textTransformCap,
                            color: getColor(item?.product_order_type),
                          }}>
                          {item?.ProductModifier?.modifier_name} (Modifier)
                        </Text>
                      ) : null}
                      {item?.addons?.length
                        ? item?.addons.map((addon: any) => (
                            <Text
                              style={{
                                ...Styles.textTransformCap,
                                color: getColor(item?.product_order_type),
                              }}>
                              {addon.title} (AddOns)
                            </Text>
                          ))
                        : null}
                    </View>

                    <View style={{ width: '20%' }}>
                      {item?.ProductScale !== null ? (
                        <Text
                          style={{
                            color: getColor(item?.product_order_type),
                            textAlign: 'right',
                          }}>
                          $
                          {item?.coupon_type === 'bogof' ||
                          item?.coupon_type === 'deals'
                            ? parseFloat(item?.amount_cad).toFixed(2)
                            : parseFloat(
                                item?.ProductScale?.price || item?.amount_cad,
                              ).toFixed(2)}{' '}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: getColor(item?.product_order_type),

                            textAlign: 'right',
                          }}>
                          $
                          {item?.coupon_type === 'bogof' ||
                          item?.coupon_type === 'deals' ||
                          item?.isTransferOrder
                            ? parseFloat(item?.amount_cad || 0).toFixed(2)
                            : parseFloat(
                                item?.Product?.price ||
                                  item?.ProductScale?.price ||
                                  item?.amount_cad,
                              ).toFixed(2)}
                        </Text>
                      )}
                      {item.ProductModifier !== null ? (
                        <Text
                          style={{
                            color: getColor(item?.product_order_type),
                            ...Styles.textTransformCap,

                            textAlign: 'right',
                          }}>
                          $
                          {item?.coupon_type === 'bogof' ||
                          item?.coupon_type === 'deals'
                            ? parseFloat(0).toFixed(2)
                            : item?.ProductModifier?.price.toFixed(2)}
                        </Text>
                      ) : null}
                      {item?.addons?.length
                        ? item?.addons.map((addon: any) => (
                            <Text
                              key={addOns?.id}
                              style={{
                                color: getColor(item?.product_order_type),
                                textAlign: 'right',
                                ...Styles.textTransformCap,
                              }}>
                              $
                              {item?.coupon_type === 'bogof' ||
                              item?.coupon_type === 'deals'
                                ? parseFloat(0).toFixed(2)
                                : addon?.price.toFixed(2)}
                            </Text>
                          ))
                        : null}
                    </View>
                  </View>
                ))}

              {orderDetails?.orderDetail?.TransferRedeemItems?.length
                ? orderDetails?.TransferRedeemItems?.map((item: any) => (
                    <View style={styles.renderitem}>
                      <View
                        style={{
                          width: '40%',
                        }}>
                        <Text
                          style={{
                            color: getColor(item?.product_order_type),
                          }}>
                          {item?.product_order_type === 'Transfer'
                            ? 'Transfer'
                            : 'Gift'}
                        </Text>

                        {item?.ProductScale !== null ? (
                          <Text
                            style={{
                              color: getColor(item?.product_order_type),
                            }}>
                            {item?.Product?.title} (
                            {item?.ProductScale?.scale_name})
                          </Text>
                        ) : (
                          <Text
                            style={{
                              color: getColor(item?.product_order_type),
                            }}>
                            {item?.Product?.title}
                          </Text>
                        )}
                        {item?.addons?.length
                          ? item?.addons.map((addon: any) => (
                              <Text
                                style={{
                                  color: getColor(item?.product_order_type),
                                }}>
                                {addon?.title} (AddOns)
                              </Text>
                            ))
                          : null}
                        {item.ProductModifier !== null ? (
                          <Text
                            style={{
                              color: getColor(item?.product_order_type),
                            }}>
                            {item?.ProductModifier?.modifier_name} (Modifier)
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  ))
                : null}
              <View style={styles.hrline}></View>
              {/* rendering Bill */}
              <View style={styles.renderPrices}>
                <View style={styles.billtitle}>
                  <Text>Sub Total</Text>
                  {!(favorite === 'trans') && <Text>Tax</Text>}
                  <Text>Discount</Text>
                  {item?.Coupon?.title ? <Text>Coupon Title</Text> : null}
                  {item?.couponDiscount &&
                  item?.Coupon?.discountType !== 'bogof' ? (
                    <Text>Coupon Redeem</Text>
                  ) : null}
                  {item?.Coupon?.discountType ? <Text>Coupon Type</Text> : null}

                  {!(favorite === 'trans') && <Text>Sophali fee</Text>}
                  <Text style={{ fontWeight: 'bold' }}>Total</Text>
                  {/* <Text>Including Tax 16%</Text> */}
                  <Text>Payment Status</Text>
                </View>
                <View style={styles.billamount}>
                  <Text>${cacheSubTotal.toFixed(2)}</Text>
                  {!(favorite === 'trans') && (
                    <Text>${parseFloat(item?.tax).toFixed(2)}</Text>
                  )}
                  <Text>${parseFloat(discount).toFixed(2)}</Text>
                  {item?.Coupon?.title ? (
                    <Text style={[Styles.textTransformCap, { fontSize: 12 }]}>
                      {item?.Coupon?.title}
                    </Text>
                  ) : null}

                  {item?.couponDiscount &&
                  item?.Coupon?.discountType !== 'bogof' ? (
                    <Text>${parseFloat(item.couponDiscount).toFixed(2)}</Text>
                  ) : null}
                  {item?.Coupon?.discountType ? (
                    <Text style={[Styles.textTransformCap, { fontSize: 12 }]}>
                      {item?.Coupon?.discountType === 'bogof'
                        ? 'Buy One Get One Free'
                        : item?.Coupon?.discountType}
                    </Text>
                  ) : null}
                  {!(favorite === 'trans') && (
                    <Text>${parseFloat(sophaliFee).toFixed(2)}</Text>
                  )}
                  <Text
                    style={{
                      color:
                        item.product_order_type === 'Transfer'
                          ? 'green'
                          : 'red',
                      fontWeight: 'bold',
                    }}>
                    $
                    {item.product_order_type === 'Transfer'
                      ? parseFloat('0').toFixed(2)
                      : parseFloat(amount).toFixed(2)}
                  </Text>
                  <Text style={{ color: 'green', fontWeight: 'bold', textTransform: 'capitalize'}}>{paymentStatus || ''}</Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.closeBtn}
                onPress={toggleModal}>
                <View style={styles.closeBtnBtn}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Close
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: scaleSize(15),
    paddingVertical: scaleSize(10),
    ...Styles.w100,
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

export default OrderModel;
