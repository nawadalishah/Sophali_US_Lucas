import { FlatList, SafeAreaView, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AndroidSafeArea } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { Toast } from 'native-base';
import { getMerchantCouponAction } from '../../../redux/merchant/coupon/couponActions';
import { getUserList } from '../../../redux/User/userActions';
import { axiosInstance } from '../../../config/axios';
import Styles from '../../../utils/styles';
import { productAction } from '../../../redux/merchant/product/productAction';
import CouponTable from './couponsTabs/CouponTable';
import HeaderTabs from './couponsTabs/HeaderTabs';
import AddCoupon from './AddCoupon';
import { deviceHeight, isLandscape } from '../../../utils/orientation';
import { HEADERS, isSubMerchant } from '../../../utils/helpers';
import TopNavigation from '../../../components/TopNavigation';

export default function CouponList() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { merchantCoupons } = useAppSelector(state => state.merchantCoupon);
  const loading = useAppSelector(state => state.merchantCoupon.isCouponLoading);
  const [loadingState, setLoadingState] = useState<any>(false);
  const userData = user;
  const { UserList } = useAppSelector(state => state.userList);
  const [coupons, setCoupons] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const isFocused = useIsFocused();
  const [currentTab, setCurrentTab] = useState('active');
  const [activatedCoupons, setActivatedCoupons] = useState<any>([]);
  const [expiredCoupons, setExpiredCoupons] = useState<any>([]);
  const isSubMerchantRole = isSubMerchant(user?.role?.name);

  let userListData: any = [];

  useEffect(() => {
    setCoupons(merchantCoupons?.coupons);
  }, [merchantCoupons]);

  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  useEffect(() => {
    dispatch(getMerchantCouponAction(userData?.userDetail));
    dispatch(getUserList(userData?.userDetail));
    dispatch(productAction({ data: userData?.userDetail }));
    getActiveCoupons();
    getExpiredCoupons();
  }, [isFocused]);

  useEffect(() => {
    userListData =
      UserList && UserList?.userList && UserList?.userList.length
        ? UserList.userList
        : [];
    setSubscribers(userListData);
    // })
  }, [UserList]);

  const getActiveCoupons = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get<any>(`coupon/all?merchant_id=${id}`);
      if (res?.data) {
        setActivatedCoupons(res?.data?.coupons);
      } else {
        setActivatedCoupons([]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const getExpiredCoupons = async () => {
    try {
      const id = isSubMerchantRole
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
      const res = await axiosInstance.get<any>(
        `coupons/expiredCoupons?merchant_id=${id}`,
      );
      if (res?.data) {
        setExpiredCoupons(res?.data?.coupons);
      } else {
        setExpiredCoupons([]);
      }
    } catch (error) {}
  };

  const deleteItemFrom = async (item: any) => {
    try {
      const res = await axiosInstance.post<any>(
        'coupon/delete',
        {
          id: item?.id,
        },
        HEADERS,
      );
      if (res.data) {
        Toast.show({
          title: 'Removed coupon template',
        });
        setTimeout(() => {
          dispatch(getMerchantCouponAction(userData?.userDetail));
        }, 1500);
      }
    } catch (error: any) {}
  };

  const currentTabsHandler = useCallback(
    async (fav: any) => {
      setCurrentTab(fav);
      if (fav === 'active') {
        await dispatch(getMerchantCouponAction(userData?.userDetail));
        getActiveCoupons();
      } else if (fav === 'expired') {
        await getExpiredCoupons();
      }
    },
    [currentTab, dispatch, getExpiredCoupons],
  );

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      <TopNavigation currentScreen={'CouponList'} />

      <FlatList
        data={[0]}
        nestedScrollEnabled
        style={[Styles.flexGrow, Styles.w100]}
        contentContainerStyle={[
          Styles.flexDirectionColumn,
          Styles.w100,
          Styles.pB30,
        ]}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <HeaderTabs
            currentTab={currentTab}
            setCurrentTab={currentTabsHandler}
          />
        )}
        renderItem={({}) => (
          <>
            {currentTab === 'active' ? (
              <View
                style={[
                  { height: '100%', width: '100%', flex: 1 },
                  Styles.flexDirectionColumn,
                ]}>
                <View
                  style={[
                    { height: deviceHeight / 2, width: '100%' },
                    isLandscape() && Styles.pV20,
                  ]}>
                  <CouponTable
                    headerName={'active'}
                    currentTab={currentTab}
                    coupons={activatedCoupons}
                  />
                </View>

                <View
                  style={[
                    isLandscape() && Styles.pV20,
                    { height: deviceHeight / 2, width: '100%' },
                  ]}>
                  <CouponTable
                    headerName={'template'}
                    currentTab={currentTab}
                    coupons={coupons}
                    deleteItemFrom={deleteItemFrom}
                  />
                </View>
              </View>
            ) : null}

            {currentTab === 'template' ? (
              <AddCoupon setCurrentTab={currentTabsHandler} />
            ) : null}
            {currentTab === 'expired' ? (
              <CouponTable
                headerName={'expired'}
                currentTab={currentTab}
                coupons={expiredCoupons}
              />
            ) : null}
          </>
        )}
      />
    </SafeAreaView>
  );
}
