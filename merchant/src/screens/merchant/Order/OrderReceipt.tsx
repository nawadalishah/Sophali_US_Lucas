import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Styles from '../../../utils/styles/index';
import { useStyles } from './styles';
import { convertDate, convertTime, formatDate } from '../../../utils/helpers';
import { COLORS, Text } from '../../../constants';

const OrderRow = ({
  label,
  value,
  secondaryLabel = '',
  secondaryValue = '',
  showSecondary = true,
}: any) => {
  const styles = useStyles();
  return (
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
};

const ProductItemReceipt = ({ item }: any) => (
  <>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ width: '60%', flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>{item.Product.title}</Text>
        <Text>({item.product_order_type})</Text>
      </View>

      {!(item.product_order_type === 'Gift' || item?.new_order_id) && (
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
        value={item.Product.title}
        secondaryLabel="Description:"
        secondaryValue={item.Product.description}
      /> */}
    {!!item.ProductModifier && (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: '60%', flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>
            {item.ProductModifier.modifier_name}:
          </Text>
          <Text> (Modifier)</Text>
        </View>

        {!(item.product_order_type === 'Gift') && (
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
        value={item?.ProductScale ? item?.ProductScale?.scale_name : 'One Size'}
      />
    )}
    {item?.addons && Array.isArray(item?.addons) && item.addons.length > 0
      ? item.addons.map((i, index) => (
          <View
            key={index}
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '60%', flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}>
                {i?.Addon?.title || ''}:
              </Text>
              <Text> (AddOn)</Text>
            </View>

            {!(item.product_order_type === 'Gift') ? (
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
      {...(item.product_order_type != 'Now'
        ? {
            label: 'T-ID/G-ID:',
            value: item?.custom_id && item?.custom_id.toString().toUpperCase(),
          }
        : {})}
    />
  </>
);

const OrderReceipt = ({
  visible,
  handleOk,
  selectedOrder,
  setLoadingState,
  merchantSetting,
  adminSetting,
  onClose,
}: any) => {
  const styles = useStyles();
  let cacheSubTotal = 0;
  let cacheSubDiscount = 0;
  let tax = 0;
  selectedOrder?.OrderItems?.forEach((element: any) => {
    if (element.amount_cad) {
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
      element && element?.amount_cad && element.amount_cad > 0
        ? element.amount_cad
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
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView>
        <View style={[styles.container, Styles.primaryBackground]}>
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
            value={convertTime(selectedOrder?.createdAt)}
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
              style={{ width: '20%', textAlign: 'right', color: COLORS.white }}>
              Price
            </Text>
          </View>
          {selectedOrder?.OrderItems?.map((item: any, index: any) => (
            <ProductItemReceipt key={index} item={item} />
          ))}
          {selectedOrder?.TransferRedeemItems?.map((item: any, index: any) => (
            <ProductItemReceipt key={index} item={item} />
          ))}
          <View style={styles.hrline}></View>
          {/* rendering Bill */}
          <View style={styles.renderPrices}>
            <View style={styles.billtitle}>
              <Text>Sub Total: </Text>
              <Text>Tax: </Text>
              <Text>Discount: </Text>
              {selectedOrder?.Coupon?.title ? <Text>Coupon Title</Text> : null}

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
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default OrderReceipt;
