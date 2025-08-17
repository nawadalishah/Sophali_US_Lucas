import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useStyles } from './style';
import { FlatList } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../../../../redux/Store';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { getMerchantCouponAction } from '../../../../redux/merchant/coupon/couponActions';
import { COLORS } from '../../../../constants';
import moment from 'moment';
import CouponListHeader from './CouponListHeader';
import CouponDetails from './CouponDetails';
import PopUpModal from '../../../../components/PopUpModal';
import { deviceHeight } from '../../../../utils/orientation';

const CouponTable = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { merchantCoupons } = useAppSelector(state => state.merchantCoupon);
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const styles = useStyles();
  const [coupons, setCoupons] = useState([]);
  const [toggledetailModal, settoggleDetailsModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState();

  useEffect(() => {
    setCoupons(merchantCoupons?.coupons);
  }, [merchantCoupons]);

  useEffect(() => {
    dispatch(getMerchantCouponAction(userData?.userDetail));
    // dispatch(getUserList(userData?.userDetail));
    // dispatch(productAction(userData?.userDetail));
  }, []);
  const openDetailsModal = (item: any) => {
    setSelectedCoupon(item);
    settoggleDetailsModal(!toggledetailModal);
  };

  const editItem = (data: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditCoupon',
        params: { editForm: data },
      }),
    );
  };

  return (
    <View style={{ height: '45%' }}>
      <View>
        <Text style={styles.coupontableHeading}>Active Coupons</Text>
      </View>
      <FlatList
        data={coupons}
        keyExtractor={(item: any) => item?.id.toString()}
        ListHeaderComponent={() => <CouponListHeader />}
        stickyHeaderIndices={[0]}
        renderItem={({ item, index }: any) => (
          <View
            style={{
              ...styles.row,
              backgroundColor: index % 2 === 0 ? 'white' : COLORS.lightGray,
            }}>
            <Text style={styles.col}>{item?.code || ''}</Text>
            <Text style={styles.col}>{item?.title || 'ABCDEF'}</Text>
            <Text style={styles.col}>
              {moment(item?.expires_at).format('DD-MMM-YY') || ''}
            </Text>
            <Text style={styles.col}>${item?.value || ''}</Text>
            <Text style={styles.col}>{item?.code || ''}</Text>
            <Text style={styles.col}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  openDetailsModal(item);
                }}>
                <Text style={styles.btnText}>View</Text>
              </TouchableOpacity>
            </Text>
            <Text style={styles.col}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  editItem(item);
                }}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
            </Text>
          </View>
        )}
      />
      <PopUpModal
        children={<CouponDetails selectedCoupon={selectedCoupon} />}
        onClose={openDetailsModal}
        open={toggledetailModal}
      />
    </View>
  );
};

export default CouponTable;
