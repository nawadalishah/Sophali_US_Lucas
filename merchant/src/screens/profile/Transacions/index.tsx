import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native';
import { AndroidSafeArea } from '../../../constants';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { axiosInstance } from '../../../config/axios';
import { useAppSelector } from '../../../redux/Store';
import TopNavigation from '../../../components/TopNavigation';
import { useStyles } from './styles';
import { TransactionContent, TransactionHeader } from './TransactionContent';
import moment from 'moment';

export default function TransactionScreen() {
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState([]);
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('daily');
  const [earningInfo, setEarningInfo] = useState({
    earnings: 0,
    withdrawal: 0,
    current: 0,
    subscription: 0,
    lastWithdrawal: 0,
    lastWithdrawalDate: '',
    daysWithDrawal: 0,
    isLastWithdrawalThisWeek: false,
  });

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
  }, [userData, filterPeriod, isFocused]);

  const getAnalyticsData = useCallback(
    async (paramFromDate?: any, paramToDate?: any) => {
      try {
        const fromDateISO = paramFromDate.toISOString().split('T')[0];
        const toDateISO = paramToDate.toISOString().split('T')[0];
        setLoading(true);
        const res = await axiosInstance.get<any>(
          `merchant-analytics?merchant_id=${userData?.userDetail.id}&from_date=${fromDateISO}&to_date=${toDateISO}`,
        );
        if (res.data && res.data.result) {
          const transaction = res.data.result.map((response: any) => ({
            ...response,
            dateOfTransaction: response.createdAt.split('T')[0],
            debit: response.iscredit && response.amount_cad,
            credit: !response.iscredit && response.amount_cad,
          }));

          const totalAmountCad = res.data.result.reduce(
            (total, transaction) =>
              transaction.status === 'active' && !transaction.iscredit
                ? total + transaction.amount_cad
                : total,
            0,
          );
          const totalWithDrawal = res.data.result.reduce(
            (total, transaction) =>
              transaction.status === 'active' &&
              transaction.iscredit &&
              transaction.payment_status === 'withdrawal'
                ? total + transaction.amount_cad
                : total,
            0,
          );
          const totalWithSubs = res.data.result.reduce(
            (total, transaction) =>
              transaction.status === 'active' &&
              transaction.iscredit &&
              transaction.payment_status === 'subscription'
                ? total + transaction.amount_cad
                : total,
            0,
          );
          const lastDate =
            res?.data?.lastWithdrawalRecord &&
            moment(res?.data?.lastWithdrawalRecord?.createdAt).format(
              'DD-MM-YYYY',
            );
          const total =
            parseFloat(totalAmountCad) -
            (parseFloat(totalWithDrawal) + parseFloat(totalWithSubs));

          setEarningInfo({
            earnings: totalAmountCad,
            withdrawal: totalWithDrawal,
            current: total,
            subscription: totalWithSubs,
            lastWithdrawal: res?.data?.lastWithdrawalRecord?.amount_cad || 0,
            lastWithdrawalDate: lastDate,
            daysWithDrawal: res?.data?.daysWithdrawal || 0,
            isLastWithdrawalThisWeek: !!res?.data?.isLastWithdrawalThisWeek,
          });
          setTransactions(transaction);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e: any) {
        setLoading(false);
      }
    },
    [loading, transactions, userData?.userDetail.id],
  );

  const onRefresh = useCallback(() => {
    getAnalyticsData(fromDate, toDate);
  }, [fromDate, toDate]);

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      <TopNavigation currentScreen={'Transactions'} />
      <TransactionHeader
        daysWithdrawal={earningInfo?.daysWithDrawal}
        isLastWithdrawalThisWeek={earningInfo?.isLastWithdrawalThisWeek}
        balance={earningInfo?.current || 0}
      />
      <TransactionContent
        fromDate={fromDate}
        showFromDate={showFromDate}
        setShowFromDate={setShowFromDate}
        setFromDate={setFromDate}
        setShowToDate={setShowToDate}
        setToDate={setToDate}
        toDate={toDate}
        showToDate={showToDate}
        styles={styles}
        filterPeriod={filterPeriod}
        setFilterPeriod={setFilterPeriod}
        transactions={transactions}
        onApplyFilter={() => {
          getAnalyticsData(fromDate, toDate);
          setFilterPeriod('');
        }}
        onRefresh={onRefresh}
        earningInfo={earningInfo}
        loading={loading}
      />
    </SafeAreaView>
  );
}
