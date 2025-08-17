import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Styles from '../../../utils/styles';
import {
  fetchPickupOrders,
  getAdminSettings,
  getMerchantSettings,
} from './helper';
import OrderTable from './OrderTable';
import { useAppSelector } from '../../../redux/Store';
import { Header } from '../../../components';
import { useNavigation } from '@react-navigation/native';
import OrderReceipt from './OrderReceipt';
import OrderModel from '../../../components/OrderModel';
import PickUpOrder from './PickUpOrder';
import { isSubMerchant } from '../../../utils/helpers';

const OrderCompleted = () => {
  const [orders, setOrders] = useState({ data: [], loading: true });
  const [settings, setSettings] = useState({
    merchant: null,
    admin: null,
  });
  const [selectedOrderInfo, setSelectedOrderInfo] = useState({
    pickup: false,
    details: false,
    receipt: false,
    orderInfo: null,
  });
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const navigation = useNavigation();
  const isSubMerchantRole = isSubMerchant(user?.role?.name);
  const merchantId = isSubMerchantRole
    ? userData?.userDetail?.parent_id
    : userData?.userDetail?.id;

  useEffect(() => {
    fetchPickupOrders(merchantId, setOrders);
    getMerchantSettings(setSettings, merchantId);
    getAdminSettings(setSettings);
  }, [merchantId]);

  const onRefresh = useCallback(() => {
    fetchPickupOrders(merchantId, setOrders);
  }, [orders, merchantId]);

  const onCloseModel = useCallback(() => {
    setSelectedOrderInfo({
      pickup: false,
      details: false,
      receipt: false,
      orderInfo: null,
    });
  }, [selectedOrderInfo]);

  const handleSelectOrder = useCallback(
    (item: any, modalType: string) => {
      setSelectedOrderInfo(prevState => ({
        ...prevState,
        pickup: modalType === 'pickup',
        details: modalType === 'details',
        receipt: modalType === 'receipt',
        orderInfo: item,
      }));
    },
    [selectedOrderInfo],
  );

  return (
    <View style={[Styles.flex, Styles.primaryBackground, Styles.w100]}>
      <Header title={'Pickup Order'} onPress={() => navigation.goBack()} />
      <OrderTable
        data={orders?.data}
        loading={orders?.loading}
        onRefresh={onRefresh}
        handleSelectOrder={handleSelectOrder}
      />
      {selectedOrderInfo?.receipt && (
        <OrderReceipt
          visible={selectedOrderInfo?.receipt}
          handleOk={onCloseModel}
          selectedOrder={selectedOrderInfo?.orderInfo}
          setLoadingState={() => {}}
          merchantSetting={settings?.merchant}
          adminSetting={settings?.admin}
          onClose={onCloseModel}
        />
      )}
      {selectedOrderInfo?.details && (
        <OrderModel
          visible={selectedOrderInfo?.details}
          toggleOrderDetailModal={onCloseModel}
          item={selectedOrderInfo?.orderInfo}
          favorite={'Completed'}
        />
      )}
      {selectedOrderInfo?.pickup && (
        <PickUpOrder
          pickedUpOrder={selectedOrderInfo?.orderInfo}
          setPickUp={() => {
            onCloseModel();
            onRefresh();
          }}
          pickUp={selectedOrderInfo?.pickup}
        />
      )}
    </View>
  );
};

export default OrderCompleted;
