import { Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';

export const fetchPickupOrders = async (id: number, setOrders) => {
  try {
    await axiosInstance
      .get<any>(`order/merchant-completed-order?merchant_id=${id}`)
      .then(response => {
        const res = response?.data;
        const data = res?.orders.map((order: any) => {
          const Items = [
            ...(order?.OrderItems || []),
            ...(order?.TransferRedeemItems || []),
          ];
          const orderTotalTime = Items.reduce((highest, item) => {
            const timeInMinutes =
              item.Product?.time_type === 'hours'
                ? item.Product.time * 60
                : (item.Product?.time ?? 0);
            return Math.max(highest, timeInMinutes);
          }, 0);

          return {
            ...order,
            total_time_in_minutes: orderTotalTime,
          };
        });
        setOrders({ data: data || [], loading: false });
      })
      .catch(err => {
        console.log('Merchant completed error   ', err);
        setOrders({ data: [], loading: false });
      });
  } catch (error: any) {
    console.log(error);
    setOrders({ data: [], loading: false });

    Toast.show({
      title: error?.response?.data?.message || 'Something went wrong',
    });
  }
};

export const fetchMerchantReceiptDetails = async (
  orderId: number,
  setSelectedOrder,
) => {
  try {
    await axiosInstance
      .get<any>(`receipt/merchant-purchase-order-m-receipt?order_id=${orderId}`)
      .then(response => {
        const res = response?.data;

        setSelectedOrder(res.merchantPurchaseOrderReceipt[0]);
      })
      .catch(err => {
        console.log('Merchant completed error   ', err);
        setSelectedOrder(null);
      });
  } catch (error: any) {
    console.log(error);
    setSelectedOrder(null);
    Toast.show({
      title: error?.response?.data?.message || 'Something went wrong',
    });
  }
};

export const getMerchantSettings = async (setSettings, id) => {
  try {
    const res = await axiosInstance.get<any>(`setting/${id}`);
    setSettings(prev => ({ ...prev, merchant: res.data }));
  } catch (error) {
    console.log(error);
  }
};
export const getAdminSettings = async (setSettings: any) => {
  try {
    const res = await axiosInstance.get<any>('setting/admin/1');
    setSettings(prev => ({ ...prev, admin: res.data }));
  } catch (error) {
    console.log(error);
  }
};
