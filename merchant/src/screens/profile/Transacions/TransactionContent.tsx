import React from 'react';
import { FlatList } from 'react-native';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Spinner } from 'native-base';
import { COLORS, Text } from '../../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import Styles from '../../../utils/styles';
import { generateRandomKey } from '../../../utils';
import { HIT_SLOP, WEIGHT } from '../../../constants/theme';
import { MOBILE } from '../../../utils/orientation';
import { useStyles } from './styles';
import { fetchTransactionType, fetchTransactionTypeColor } from './helper';
import { ArrowSvg } from '../../../svg';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';

const TransactionFilters = ({
  fromDate,
  showFromDate,
  setShowFromDate,
  setFromDate,
  setShowToDate,
  setToDate,
  toDate,
  showToDate,
  filterPeriod,
  setFilterPeriod,
  onApplyFilter,
  earningInfo,
}: any) => {
  const earningsCard = [
    {
      id: 1,
      label: 'Total Earnings',
      value: '$' + parseFloat(earningInfo?.earnings || 0).toFixed(2),
      color: COLORS.black,
    },
    {
      id: 2,
      label: 'Withdrawal',
      value: '$' + parseFloat(earningInfo?.withdrawal || 0).toFixed(2),
      color: COLORS.redShade,
    },
    {
      id: 3,
      label: 'Subscription Fee',
      value: '$' + parseFloat(earningInfo?.subscription || 0).toFixed(2),
      color: COLORS.reddish,
    },
    {
      id: 4,
      label: 'Current Balance',
      value:
        earningInfo?.current < 0
          ? '--'
          : '$' + parseFloat(earningInfo?.current || 0).toFixed(2),
      color: COLORS.activeTab,
    },
    {
      id: 4,
      label: 'Last Withdrawal',
      value: '$' + parseFloat(earningInfo?.lastWithdrawal || 0).toFixed(2),
      date: earningInfo?.lastWithdrawalDate || '--',
      color: COLORS.orangeShade,
    },
  ];

  const styles = useStyles();
  return (
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
          onPress={onApplyFilter}>
          <Text size={MOBILE.textSize.common} color={COLORS.white}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[Styles.w100, Styles.pH15, Styles.pV10]}>
        <View style={[styles.earningsContainer]}>
          {earningsCard.map((card, index) => (
            <View
              style={[
                styles.earningCardItem,
                index == 4 && { borderBottomWidth: 0 },
              ]}
              key={generateRandomKey(card, index)}>
              <Text
                size={MOBILE.textSize.common}
                weight={WEIGHT.w400}
                color={card.color}>
                {card?.label}
              </Text>
              {card?.date && (
                <Text
                  size={MOBILE.textSize.common}
                  weight={WEIGHT.w400}
                  color={card.color}>
                  Date: {' ' + card?.date}
                </Text>
              )}
              <Text
                size={MOBILE.textSize.common}
                weight={WEIGHT.w400}
                color={card.color}>
                {card?.value}
              </Text>
            </View>
          ))}
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
            size={MOBILE.textSize.common}
            weight={WEIGHT.w400}
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
};

const TransactionsTable = ({ transactions, onRefresh, loading }: any) => {
  let runningBalance = 0;
  const styles = useStyles();
  const navigation = useNavigation();
  const transactionsWithBalance = transactions.map(transaction => {
    const debit = parseFloat(transaction.debit || 0);
    const credit = parseFloat(transaction.credit || 0);
    runningBalance += credit - debit;
    return { ...transaction, runningBalance, debit, credit };
  });

  const displayedTransactions = transactionsWithBalance.reverse();
  return (
    <View style={[Styles.w100, Styles.flex]}>
      <FlatList
        data={displayedTransactions}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View style={[styles.listHeaderContainer]}>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader, styles.textAlignLeft]}>
                Date
              </Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={styles.textHeader}>Type</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={styles.textHeader}>Debit</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={styles.textHeader}>Credit</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader, styles.textAlignRight]}>
                Balance
              </Text>
            </View>
          </View>
        )}
        stickyHeaderIndices={[0]}
        maxToRenderPerBatch={50}
        initialNumToRender={50}
        contentContainerStyle={[Styles.flexGrow, Styles.pB20]}
        keyExtractor={(item, index) => generateRandomKey(item, index)}
        renderItem={({ item, index }: any) => {
          const rowBackgroundColors = [
            COLORS.lightBlue,
            COLORS.lightGray,
            COLORS.white,
          ];
          const rowBackgroundColor =
            rowBackgroundColors[index % rowBackgroundColors.length];
          const { debit, credit } = item;

          // const debit = parseFloat(item?.debit || 0);
          // const credit = parseFloat(item?.credit || 0);

          // const transactionBalance = credit - debit;
          // runningBalance += transactionBalance;

          const textColor = fetchTransactionTypeColor(item?.payment_status);
          return (
            <TouchableOpacity
              activeOpacity={item.payment_status === 'withdrawal' ? 0.7 : 1}
              disabled={item.payment_status !== 'withdrawal'}
              style={[
                styles.listItemContainer,
                { backgroundColor: rowBackgroundColor },
              ]}
              onPress={() => {
                if (item.payment_status === 'withdrawal') {
                  navigation.navigate('WithdrawalReceipt', { item: item });
                }
              }}>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    styles.textAlignLeft,
                    { color: textColor },
                  ]}>
                  {item?.dateOfTransaction}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    Styles.textTransformCap,
                    { color: textColor },
                  ]}>
                  {fetchTransactionType(item?.payment_status || '')}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    { color: textColor },
                    Styles.textTransformCap,
                  ]}>
                  ${debit.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    { color: textColor },
                    Styles.textTransformCap,
                  ]}>
                  ${credit.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    styles.textAlignRight,
                    { color: textColor },
                  ]}>
                  ${Math.abs(item?.runningBalance || 0).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const TransactionHeader = ({
  daysWithdrawal,
  balance,
  isLastWithdrawalThisWeek,
}) => {
  const navigation = useNavigation();
  const styles = useStyles();
  return (
    <View style={[styles.headerContainerStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={HIT_SLOP.FIFTEEN}
        style={[styles.goBack]}
        onPress={() => navigation.navigate('MainLayout')}>
        <ArrowSvg />
      </TouchableOpacity>
      <View
        style={[
          Styles.w30,
          Styles.justifyContentCenter,
          Styles.flexDirectionRow,
        ]}>
        <Text style={[styles.textStyle]}>Accounts</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={HIT_SLOP.FIFTEEN}
        style={[styles.withDrawButton]}
        onPress={() =>
          navigation.navigate('WithdrawToken', {
            daysWithdrawal: daysWithdrawal,
            balance: balance,
            initial: false,
            isLastWithdrawalThisWeek: isLastWithdrawalThisWeek,
          })
        }>
        <Text size={MOBILE.textSize.common} color={COLORS.white}>
          Withdrawal
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const TransactionContent = ({
  loading,
  transactions,
  fromDate,
  showFromDate,
  setShowFromDate,
  setFromDate,
  setShowToDate,
  setToDate,
  toDate,
  showToDate,
  filterPeriod,
  setFilterPeriod,
  onApplyFilter,
  earningInfo,
  onRefresh,
}: any) => {
  const styles = useStyles();
  return (
    <View style={[Styles.flex, Styles.w100]}>
      <TransactionFilters
        fromDate={fromDate}
        showFromDate={showFromDate}
        setShowFromDate={setShowFromDate}
        setFromDate={setFromDate}
        setShowToDate={setShowToDate}
        setToDate={setToDate}
        toDate={toDate}
        showToDate={showToDate}
        filterPeriod={filterPeriod}
        setFilterPeriod={setFilterPeriod}
        onApplyFilter={onApplyFilter}
        earningInfo={earningInfo}
      />
      {!loading && transactions.length > 0 ? (
        <TransactionsTable
          transactions={transactions}
          onRefresh={onRefresh}
          loading={loading}
        />
      ) : loading ? (
        <View style={styles.emptyComponent}>
          <Spinner size={MOBILE.spinner.small} />
        </View>
      ) : (
        !loading &&
        transactions.length === 0 && (
          <View style={[styles.emptyComponent]}>
            <Text color={COLORS.gray} size={MOBILE.textSize.medium}>
              Accounts not found yet
            </Text>
          </View>
        )
      )}
    </View>
  );
};

export { TransactionContent, TransactionHeader };
