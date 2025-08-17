import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native'; // Import ScrollView
import { SafeAreaView, View, TouchableOpacity, Platform } from 'react-native';
import { Spinner } from 'native-base';
import { Header } from '../../../components';
import { AndroidSafeArea, COLORS, Text } from '../../../constants';
import { useNavigation } from '@react-navigation/native';
import { axiosInstance } from '../../../config/axios';
import { useAppSelector } from '../../../redux/Store';
import DateTimePicker from '@react-native-community/datetimepicker';
import TopNavigation from '../../../components/TopNavigation';
import Styles from '../../../utils/styles';
import { generateRandomKey } from '../../../utils';
import { WEIGHT } from '../../../constants/theme';
import { MOBILE } from '../../../utils/orientation';
import { useStyles } from './styles';
import { fetchTransactionStatus, isRejected } from './helper';
import { CoinSvg } from '../../../svg';
import { OrderIcon } from '../../../utils/icons';

const RevenueScreen = () => {
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('daily');
  const [cardInfo, setCardInfo] = useState({ totalAmount: 0, totalOrders: 0 });

  const styles = useStyles();

  useEffect(() => {
    const newFromDate = new Date();
    const newToDate = new Date();
    if (filterPeriod && filterPeriod.length > 0) {
      switch (filterPeriod) {
        case 'daily':
          newFromDate.setDate(newToDate.getDate());
          break;
        case 'weekly':
          newFromDate.setDate(newToDate.getDate() - 7);
          break;
        case 'monthly':
          newFromDate.setMonth(newToDate.getMonth() - 1);
          if (newToDate.getDate() !== newFromDate.getDate()) {
            newFromDate.setDate(0);
          }
          break;
      }

      setFromDate(newFromDate);
      setToDate(newToDate);
      getAnalyticsData(newFromDate, newToDate);
    }
  }, [userData, filterPeriod]);

  const getAnalyticsData = useCallback(
    async (paramFromDate?: any, paramToDate?: any) => {
      try {
        const fromDateISO = paramFromDate.toISOString().split('T')[0];
        const toDateISO = paramToDate.toISOString().split('T')[0];
        setLoading(true);
        const res = await axiosInstance.get<any>(
          `merchant-revenues?merchant_id=${userData?.userDetail.id}&from_date=${fromDateISO}&to_date=${toDateISO}`,
        );
        if (res.data && res.data.data) {
          const transaction = res.data.data.map((res: any) => ({
            ...res,
            dateOfTransaction: res.createdAt.split('T')[0],
          }));
          const totalAmountCad = res.data.data.reduce(
            (total, transaction) =>
              transaction.status === 'active'
                ? total + transaction.amount_cad
                : total,
            0,
          );
          setCardInfo({
            totalAmount: parseFloat(totalAmountCad).toFixed(2),
            totalOrders: transaction.length,
          });

          setTransactions(transaction);
          setLoading(false);
        } else {
          setLoading(false);
          setTransactions([]);
        }
      } catch (e: any) {
        setLoading(false);
      }
    },
    [loading, transactions, fromDate, toDate, userData?.userDetail.id],
  );

  const onRefresh = useCallback(() => {
    getAnalyticsData(fromDate, toDate);
  }, [fromDate, toDate]);

  const RevenueHeader = () => (
    <Header title={'Sales'} goBack={true} onPress={() => navigation.goBack()} />
  );
  const RevenueFilters = () => (
    <View style={[Styles.w100]}>
      <View style={[styles.dateContainer]}>
        <View style={[styles.dateFieldContainer]}>
          <Text
            size={MOBILE.textSize.common}
            weight={WEIGHT.w700}
            style={Styles.pR5}>
            From:
          </Text>
          <TouchableOpacity
            style={[styles.dateField]}
            activeOpacity={0.7}
            onPress={() => setShowFromDate(true)}>
            <Text size={MOBILE.textSize.common}>{fromDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showFromDate && (
          <DateTimePicker
            value={fromDate}
            mode={'date'}
            onChange={(event, date) => {
              setShowFromDate(Platform.OS === 'ios');
              if (date) setFromDate(date);
            }}
          />
        )}
        <View style={[styles.dateFieldContainer]}>
          <Text
            size={MOBILE.textSize.common}
            weight={WEIGHT.w700}
            style={Styles.pR5}>
            To:
          </Text>
          <TouchableOpacity
            style={[styles.dateField]}
            activeOpacity={0.7}
            onPress={() => setShowToDate(true)}>
            <Text size={MOBILE.textSize.common}>{toDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showToDate && (
          <DateTimePicker
            value={toDate}
            mode={'date'}
            onChange={(event, date) => {
              setShowToDate(Platform.OS === 'ios');
              if (date) setToDate(date);
            }}
          />
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.filterButton]}
          onPress={() => {
            getAnalyticsData(fromDate, toDate);
            setFilterPeriod('');
          }}>
          <Text size={MOBILE.textSize.common} color={COLORS.white}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.earningContainer]}>
        <View style={[styles.earningsCard]}>
          <CoinSvg />
          <View style={[styles.earningInfo]}>
            <Text size={MOBILE.textSize.medium} color={COLORS.green}>
              ${cardInfo.totalAmount}
            </Text>
            <Text size={MOBILE.textSize.xxsSmall} color={COLORS.tabTextColor}>
              Total Earnings
            </Text>
          </View>
        </View>
        <View style={[styles.earningsCard]}>
          <OrderIcon />
          <View style={[styles.earningInfo]}>
            <Text size={MOBILE.textSize.medium} color={COLORS.green}>
              {String(cardInfo.totalOrders).padStart(2, '0')}
            </Text>
            <Text size={MOBILE.textSize.xxsSmall} color={COLORS.tabTextColor}>
              Total number of orders
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.dailyContainer]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.tabButton,
            filterPeriod === 'daily' && styles.tabButtonActive,
          ]}
          onPress={() => setFilterPeriod('daily')}>
          <Text
            weight={WEIGHT.w400}
            size={MOBILE.textSize.common}
            style={{
              color:
                filterPeriod === 'daily' ? COLORS.white : COLORS.tabTextColor,
            }}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.tabButton,
            filterPeriod === 'weekly' && styles.tabButtonActive,
          ]}
          onPress={() => setFilterPeriod('weekly')}>
          <Text
            size={MOBILE.textSize.common}
            weight={WEIGHT.w400}
            style={{
              color:
                filterPeriod === 'weekly' ? COLORS.white : COLORS.tabTextColor,
            }}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.tabButton,
            filterPeriod === 'monthly' && styles.tabButtonActive,
          ]}
          onPress={() => setFilterPeriod('monthly')}>
          <Text
            size={MOBILE.textSize.common}
            weight={WEIGHT.w400}
            style={{
              color:
                filterPeriod === 'monthly' ? COLORS.white : COLORS.tabTextColor,
            }}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const RevenueTable = () => (
    <View style={[Styles.w100, Styles.flex]}>
      <FlatList
        data={transactions}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerStyle={[Styles.pB20]}
        ListHeaderComponent={() => (
          <View style={[styles.listHeaderContainer]}>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader, styles.textAlignLeft]}>
                P_ID
              </Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={styles.textHeader}>Date</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={styles.textHeader}>Status</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader, styles.textAlignRight]}>
                Earnings
              </Text>
            </View>
          </View>
        )}
        stickyHeaderIndices={[0]}
        maxToRenderPerBatch={50}
        initialNumToRender={50}
        keyExtractor={(item, index) => generateRandomKey(item, index)}
        renderItem={({ item, index }: any) => {
          const rowBackgroundColors = [
            COLORS.lightBlue,
            COLORS.lightGray,
            COLORS.white,
          ];

          const rowBackgroundColor =
            rowBackgroundColors[index % rowBackgroundColors.length];
          return (
            <View
              style={[
                styles.listItemContainer,
                { backgroundColor: rowBackgroundColor },
              ]}>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    Styles.textTransformUpper,
                    styles.textAlignLeft,
                    isRejected(item.status) && styles.textRowRejected,
                  ]}>
                  P_{item.order_purchase_id}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    isRejected(item.status) && styles.textRowRejected,
                  ]}>
                  {item.dateOfTransaction}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    isRejected(item.status) && styles.textRowRejected,
                    Styles.textTransformCap,
                  ]}>
                  {fetchTransactionStatus(item.status)}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    styles.textAlignRight,
                    isRejected(item.status) && styles.textRowRejected,
                  ]}>
                  ${parseFloat(item.amount_cad).toFixed(2)}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );

  const RevenueContent = () => (
    <View style={[Styles.flex, Styles.w100]}>
      <RevenueFilters />
      {!loading && transactions.length > 0 ? (
        <RevenueTable />
      ) : loading ? (
        <View style={styles.emptyComponent}>
          <Spinner size={MOBILE.spinner.small} />
        </View>
      ) : (
        !loading &&
        transactions.length === 0 && (
          <View style={[styles.emptyComponent]}>
            <Text color={COLORS.gray} size={MOBILE.textSize.medium}>
              Sales not found yet
            </Text>
          </View>
        )
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      <TopNavigation currentScreen={'Transactions'} />
      <RevenueHeader />
      <RevenueContent />
    </SafeAreaView>
  );
};

export default RevenueScreen;
