import { View, ScrollView } from 'react-native';
import React from 'react';
import { useStyles } from './style';
import { Header } from '../../../../components';
import moment from 'moment';
import Styles from '../../../../utils/styles';
import { Text } from '../../../../constants';

const CouponDetails = ({ selectedCoupon, headerName, onClose }: any) => {
  const styles = useStyles();

  const renderHeader = () => (
    <Header
      title={'Coupons Details'}
      onPress={() => {
        onClose();
      }}
    />
  );
  return (
    <View style={styles.centeredView}>
      {renderHeader()}
      <ScrollView contentContainerStyle={[Styles.flex]}>
        <View style={styles.contentRow}>
          <Text style={styles.conrentRowHeading}>Coupon Code:</Text>
          <Text>{selectedCoupon?.custom_code || ''}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.conrentRowHeading}>Coupon Title:</Text>
          <Text>{selectedCoupon?.title || ''}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.conrentRowHeading}>Price:</Text>
          <Text>
            {selectedCoupon?.discountType === '%age'
              ? selectedCoupon?.value + '%'
              : '$' + parseFloat(selectedCoupon?.value).toFixed(2)}
          </Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.conrentRowHeading}>Discount Type:</Text>
          <Text style={[Styles.textTransformCap]}>
            {selectedCoupon?.discountType || ''}
          </Text>
        </View>
        {selectedCoupon?.min_order_amount && (
          <View style={styles.contentRow}>
            <Text style={styles.conrentRowHeading}>Min Amount:</Text>
            <Text style={[Styles.textTransformCap]}>
              $
              {parseFloat(selectedCoupon?.min_order_amount || 0).toFixed(2) ||
                ''}
            </Text>
          </View>
        )}

        {selectedCoupon?.type && (
          <View style={styles.contentRow}>
            <Text style={styles.conrentRowHeading}>Coupon Type:</Text>
            <Text style={[Styles.textTransformCap]}>
              {selectedCoupon?.type || ''}
            </Text>
          </View>
        )}

        {selectedCoupon?.validityHours && selectedCoupon?.validityHours > 0 ? (
          <View style={styles.contentRow}>
            <Text style={styles.conrentRowHeading}>Time (Hours):</Text>
            <Text style={[Styles.textTransformCap]}>
              {selectedCoupon?.validityHours=='24'? 'Full Day' : selectedCoupon?.validityHours || ''}
            </Text>
          </View>
        ) : null}
        {selectedCoupon?.max_uses && selectedCoupon?.max_uses > 0 ? (
          <View style={styles.contentRow}>
            <Text style={styles.conrentRowHeading}>Max Usage:</Text>
            <Text style={[Styles.textTransformCap]}>
              {selectedCoupon?.max_uses || ''}
            </Text>
          </View>
        ) : null}

        {selectedCoupon?.start_time && (
          <View style={styles.contentRow}>
            <Text style={styles.conrentRowHeading}>Start Time:</Text>
            <Text>
              {moment(new Date(Number(selectedCoupon?.start_time))).format(
                'hh:mm A',
              ) || ''}
            </Text>
          </View>
        )}
        <View style={styles.contentRow}>
          <Text style={styles.conrentRowHeading}>Start Date:</Text>
          <Text>
            {moment(selectedCoupon?.start_date).format('Do ddd, MMM-YYYY') ||
              ''}
          </Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.conrentRowHeading}>Expiry Date:</Text>
          <Text>
            {moment(selectedCoupon?.expires_at).format('Do ddd, MMM-YYYY') ||
              ''}
          </Text>
        </View>
        {headerName === 'expired' ? (
          <View style={styles.contentRow}>
            <Text style={styles.conrentRowHeading}>Users Count</Text>
            <Text>
              {selectedCoupon?.CouponUseds?.length +
                '/' +
                selectedCoupon?.CouponUsers?.length || ''}
            </Text>
          </View>
        ) : null}
        <View style={styles.contentRow}>
          <Text style={styles.conrentRowHeading}>Product List:</Text>
          <View>
            {selectedCoupon?.productListing &&
            selectedCoupon?.productListing.length ? (
              selectedCoupon.productListing.map((item, index) => (
                <Text key={index}>
                  {` (${item?.quantity || 1}x) ${item.productName}${
                    item.scaleName ? ' (' + item.scaleName + ')' : ''
                  }`}
                </Text>
              ))
            ) : (
              <Text>Whole Cart</Text>
            )}
          </View>
        </View>
        {headerName === 'active' ? (
          <View style={styles.contentRow}>
            <Text style={styles.conrentRowHeading}>Users List</Text>
            <View
              style={[
                { width: '40%', justifyContent: 'flex-end' },
                Styles.flexDirectionRow,
              ]}>
              <Text>
                {selectedCoupon?.CouponUsers &&
                selectedCoupon?.CouponUsers?.length
                  ? selectedCoupon?.CouponUsers?.map(
                      (i: any) =>
                        i?.User?.username || i?.User?.first_name || '',
                    )
                      .filter((username: string) => username !== '')
                      .join(', ')
                  : null}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default CouponDetails;
