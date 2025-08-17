import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useStyles } from './style';
import { FlatList } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../../../../redux/Store';
import { CommonActions, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import CouponListHeader from './CouponListHeader';
import CouponDetails from './CouponDetails';
import PopUpModal from '../../../../components/PopUpModal';
import CouponListFooter from './CouponListFooter';
import Styles from '../../../../utils/styles';
import { generateRandomId, generateRandomKey } from '../../../../utils';

const CouponTable = ({
  currentTab,
  headerName,
  coupons,
  deleteItemFrom = () => {},
}: any) => {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const styles = useStyles();
  const [toggledetailModal, settoggleDetailsModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState();

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
    <View
      style={{
        // height: headerName === 'expired' ? '95%' : '100%',
        paddingVertical: 10,
        width: '100%',
        flex: 1,
      }}>
      <View>
        <Text style={styles.coupontableHeading}>
          {headerName === 'active'
            ? 'Active'
            : headerName === 'template'
              ? 'Template'
              : 'Expired'}{' '}
          Coupons
        </Text>
      </View>
      <FlatList
        data={coupons}
        keyExtractor={(item: any, index) => generateRandomKey(item, index)}
        ListHeaderComponent={() => <CouponListHeader headerName={headerName} />}
        stickyHeaderIndices={[0]}
        style={[Styles.flexGrow]}
        contentContainerStyle={[Styles.pB30]}
        renderItem={({ item, index }: any) => (
          <View style={{ ...styles.row }}>
            <Text style={styles.col}>{item?.custom_code || ''}</Text>
            <Text style={styles.col}>{item?.title || ''}</Text>
            {/* <View style={styles.col}>
                            {item?.Products?.length && item?.Products?.slice(0, 2)?.map((i: any, index: any) => (
                                i?.ProductSize && i.ProductSize.length ?
                                    i?.ProductSize?.map((j: any) => (
                                        <Text>{i?.title + '(' + j?.scale_name + ')' || ''}</Text>
                                    ))
                                    :
                                    <Text>{i?.title || ''}</Text>
                            ))}
                        </View> */}
            {/* <View style={styles.col}>
              {item?.Products?.length
                ? item?.Products?.slice(0, 2)?.map((i: any, index: any) =>
                    i?.ProductSize && i.ProductSize.length ? (
                      i?.ProductSize?.map((j: any, sizeIndex: any) => (
                        <Text key={sizeIndex}>
                          {i?.title + '(' + j?.scale_name + ')' || ''}
                        </Text>
                      ))
                    ) : (
                      <Text key={index}>{i?.title || ''}</Text>
                    ),
                  )
                : null}
            </View> */}

            <View
              style={[
                Styles.flexDirectionColumn,
                {
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                },
              ]}>
              {item?.productListing && item?.productListing.length ? (
                item.productListing.map((i, index) => (
                  <Text key={generateRandomId()}>
                    {` (${i?.quantity || 1}x) ${i.productName}${
                      i.scaleName ? ' (' + i.scaleName + ')' : ''
                    }`}
                  </Text>
                ))
              ) : (
                <Text>Whole Cart</Text>
              )}
            </View>

            <Text style={styles.col}>
              {item?.discountType === '%age'
                ? item?.value + '%' || 0
                : '$' + (item?.value || 0).toFixed(2)}
            </Text>
            {headerName === 'active' ? (
              <Text style={styles.col}>
                {moment(item?.expires_at).format('DD-MMM-YY') || ''}
              </Text>
            ) : null}
            {headerName === 'template' ? (
              <Text style={styles.col}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => {
                    editItem(item);
                  }}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
              </Text>
            ) : null}
            {headerName === 'expired' ? (
              <Text style={styles.col}>
                {item?.CouponUseds?.length + '/' + item?.CouponUsers?.length}
              </Text>
            ) : null}
            {headerName !== 'template' ? (
              <Text style={styles.col}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => {
                    openDetailsModal(item);
                  }}>
                  <Text style={styles.btnText}>View</Text>
                </TouchableOpacity>
              </Text>
            ) : null}
            {headerName == 'template' ? (
              <Text style={styles.col}>
                <TouchableOpacity
                  style={styles.delBtn}
                  onPress={() => {
                    deleteItemFrom(item);
                  }}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </Text>
            ) : null}
          </View>
        )}
      />
      <PopUpModal onClose={openDetailsModal} open={toggledetailModal}>
        <CouponDetails
          onClose={openDetailsModal}
          selectedCoupon={selectedCoupon}
          headerName={headerName}
        />
      </PopUpModal>
      <CouponListFooter />
    </View>
  );
};

export default CouponTable;
