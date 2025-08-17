import moment from 'moment';
import { FormControl, Select, Spinner, Toast } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { Header } from '../../components';
import { axiosInstance } from '../../config/axios';
import { COLORS, AndroidSafeArea, Text } from '../../constants';
import { useAppSelector } from '../../redux/Store';
import { useNavigation } from '@react-navigation/native';
import { scaleSize } from '../../utils/mixins';
import { MOBILE } from '../../utils/orientation';
import Styles from '../../utils/styles';
import { WEIGHT } from '../../constants/theme';
import TopNavigation from '../../components/TopNavigation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function Analytics() {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [transactions, setTransactions] = useState<any>([]);
  const [transactionsPaginationData, setTransactionsPaginationData] =
    useState<any>([]);
  const [pieChartData, setPieChartData] = useState<any>([]);
  const [barChartData, setBarChartData] = useState<any>([]);
  const [graphChartData, setGraphChartData] = useState<any>([]);
  const [totalSum, setTotalSum] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>();

  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [fromShow, setFromShow] = useState(false);
  const [toShow, setToShow] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatepicker, setShowFromDatepicker] = useState(false);
  const [showToDatepicker, setShowToDatepicker] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    fromDate: '',
    toDate: '',
  });
  const generatedColors: Set<string> = new Set();

  const showFromDatepickerClick = () => {
    setShowFromDatepicker(true);
  };

  const showToDatepickerClick = () => {
    setShowToDatepicker(true);
  };

  const calculatePercentage = (value: any) => {
    const percentage = (value / totalSum) * 100;
    return `${percentage.toFixed(2)}%`;
  };
  const onChangeFromDate = (selectedDate: any) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatepicker(false);
    setFromDate(currentDate);
    setForm({ ...form, fromDate: currentDate.toString() });
    setFromShow(true);
  };

  const onChangeToDate = (selectedDate: any) => {
    const currentDate = selectedDate || toDate;
    setShowToDatepicker(false);
    setToDate(currentDate);
    setForm({ ...form, toDate: currentDate.toString() });
    setToShow(true);
  };

  useEffect(() => {
    getAnalyticsData(userData?.userDetail.id, null, null, null);
    getUserList(userData?.userDetail.id);
    setSelectedUser(null);
  }, [userData, userData?.userDetail.id]);

  useEffect(() => {
    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromShow && toShow) {
      const userId = selectedUser ? selectedUser : null;
      if (moment(toDate).isSameOrAfter(fromDate)) {
        formattedFromDate =
          fromShow && fromDate ? moment(fromDate).format('YYYY-MM-DD') : null;
        formattedToDate =
          toShow && toDate ? moment(toDate).format('YYYY-MM-DD') : null;
        getAnalyticsData(
          userData?.userDetail.id,
          formattedFromDate,
          formattedToDate,
          userId,
        );
      } else {
        Toast.show({ title: 'Error: toDate cannot be less than fromDate' });
        return;
      }
    }
    if (selectedUser) {
      formattedFromDate = formattedFromDate ? formattedFromDate : null;
      formattedToDate = formattedToDate ? formattedToDate : null;
      getAnalyticsData(
        userData?.userDetail.id,
        formattedFromDate,
        formattedToDate,
        selectedUser,
      );
    }
  }, [fromDate, toDate, selectedUser, fromShow, toShow]);
  useEffect(() => {
    const visibleData = transactions.slice(startIndex, endIndex);
    setTransactionsPaginationData(visibleData);
  }, [transactions, startIndex, endIndex]);

  async function getAnalyticsData(
    merchantId: any,
    paramFromDate?: any,
    paramToDate?: any,
    selectedUser?: any,
  ) {
    try {
      setLoading(true);
      const res = await axiosInstance.get<any>(
        `analytics/merchant-analytics?merchant_id=${merchantId}&from_date=${paramFromDate}&to_date=${paramToDate}&user_id=${selectedUser}`,
      );
      if (res.data && res.data.merchantAnalytics) {
        const transaction =
          res?.data?.merchantAnalytics?.length > 0
            ? res?.data?.merchantAnalytics.map((merchant: any) => ({
                dateOfTransaction: merchant.createdAt.split('T')[0],
                sophaliTokens: merchant.total_sophali_tokens,
                cadAmount: (merchant.total_sophali_tokens / 5).toFixed(2),
              }))
            : [];

        setTransactions(transaction || []);
        generateProductArray(res.data.merchantAnalytics);
        generateStatusCount(res.data.merchantAnalytics);
        generateGraphData(res.data.merchantAnalytics);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e: any) {
      setLoading(false);
    }
  }

  async function getUserList(merchantId: any) {
    try {
      const response = await axiosInstance.get<any>(
        `users/user-subscribed-merchants/${merchantId}`,
      );
      setUsers(response.data.userList);
    } catch (error) {}
  }

  function generateStatusCount(orders: any) {
    let lateCount = 0;
    let almostLateCount = 0;
    let onTimeCount = 0;

    orders.forEach((order: any) => {
      const collectedColor = order.collected_color;
      const status = determineStatus(collectedColor);

      switch (status) {
        case 'Late':
          lateCount++;
          break;
        case 'Before Time':
          almostLateCount++;

          break;
        case 'On Time':
          onTimeCount++;

          break;
        default:
          break;
      }
    });
    const statusCount = {
      labels: ['Late', 'Before Time', 'On Time'],
      datasets: [
        {
          data: [lateCount, almostLateCount, onTimeCount],
          colors: [
            (opacity = 1) => COLORS.tickerWarningTimeColor, // Color for 'Late' bar
            (opacity = 1) => COLORS.tickerPreparingTimeColor, // Color for 'Before Time' bar
            (opacity = 1) => COLORS.preparingOrder, // Color for 'On Time' bar
          ],
        },
      ],
    };

    setBarChartData(statusCount);
  }

  function determineStatus(collectedColor: any) {
    let status = 'On Time';
    if (collectedColor === COLORS.tickerWarningTimeColor) {
      status = 'Late';
    } else if (collectedColor === COLORS.tickerPreparingTimeColor) {
      status = 'Before Time';
    } else if (collectedColor === COLORS.preparingOrder) {
      status = 'On Time';
    }
    return status;
  }

  function generateGraphData(response: any) {
    const sortedData = response.sort((a: any, b: any) =>
      moment(a.createdAt).diff(moment(b.createdAt)),
    );
    const labels = [];
    const data = [];
    sortedData.forEach((item: any) => {
      const date = moment(item.createdAt).format('MMM, DD YY');
      const existingIndex = labels.indexOf(date);
      if (existingIndex !== -1) {
        data[existingIndex]++;
      } else {
        labels.push(date);
        data.push(1);
      }
    });

    setGraphChartData({
      labels: labels.length > 0 ? labels : [],
      datasets: [
        {
          data: data.length > 0 ? data : [],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 5,
        },
      ],
      legend: ['Sales'],
    });
  }

  // function generateGraphData(response: any) {
  //   const sortedData = response.sort((a: any, b: any) =>
  //     moment(b.createdAt).diff(moment(a.createdAt)),
  //   );
  //   const labels = [];
  //   const data = [];

  //   for (
  //     let i = 0;
  //     i <
  //     Math.min(
  //       sortedData.length,
  //       sortedData.length > 4 ? 4 : sortedData.length,
  //     );
  //     i++
  //   ) {
  //     const item = sortedData[i];
  //     labels.push(moment(item.createdAt).format('YY-MM-DD'));
  //     data.push(item.amount_cad);
  //   }

  //   setGraphChartData({
  //     labels: labels.length > 0 ? labels : CHART_LABEL,
  //     datasets: [
  //       {
  //         data: data.length > 0 ? data : CHART_DATA,
  //         color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
  //         strokeWidth: 5,
  //       },
  //     ],
  //     legend: ['Sales'],
  //   });
  // }

  function generateProductArray(response: any) {
    const orderItems = response.flatMap((order: any) => order.OrderItems);

    const productMap = new Map();
    for (const [index, orderItem] of orderItems.entries()) {
      const productId = orderItem.product_id;
      const productName = orderItem?.Product?.title;
      const color = generateColor();
      if (productMap.has(productId)) {
        const product = productMap.get(productId);
        product.value += 1;
      } else {
        const product = {
          name: productName,
          value: 1,
          color: color,
        };
        productMap.set(productId, product);
      }
    }

    const result: any = [];
    let sum = 0;

    response.forEach((merchant: any) => {
      const orderItems = merchant.OrderItems;
      orderItems.forEach((orderItem: any, index: any) => {
        const productTitle = orderItem?.Product?.title;
        const orderItemsLength = orderItems.length;
        const existingProduct = result.find(
          (product: any) => product.name === productTitle,
        );

        if (existingProduct) {
          existingProduct.value += orderItemsLength;
        } else {
          const product = {
            name: productTitle,
            value: orderItemsLength,
            color: generateColor(),
          };

          result.push(product);
        }
        sum += orderItemsLength;
      });
    });
    setPieChartData(result);
    setTotalSum(sum);
  }

  function generateColor() {
    let color;

    do {
      color =
        '#' +
        ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(
          -6,
        );
    } while (generatedColors.has(color));

    generatedColors.add(color);

    return color;
  }

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  function getRandomNumber() {
    return Math.floor(Math.random() * 300) + 1;
  }

  function selectUser(user: any) {
    setSelectedUser(user);
  }

  function dateRangeSelector() {
    return (
      <View key={getRandomNumber()} style={[styles.dateFilterContainer]}>
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
            onPress={showFromDatepickerClick}>
            <Text
              size={MOBILE.textSize.common}
              color={fromShow ? COLORS.black : COLORS.gray}>
              {fromShow
                ? moment(fromDate).format('DD-MMM-YYYY')
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>

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
            onPress={showToDatepickerClick}>
            <Text
              size={MOBILE.textSize.common}
              color={toShow ? COLORS.black : COLORS.gray}>
              {toShow ? moment(toDate).format('DD-MMM-YYYY') : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
        {showFromDatepicker && (
          <DateTimePickerModal
            isVisible={showFromDatepicker}
            mode="date"
            date={fromDate}
            onConfirm={onChangeFromDate}
            onCancel={() => setShowFromDatepicker(false)}
            maximumDate={new Date()}
          />
        )}
        {showToDatepicker && (
          <DateTimePickerModal
            isVisible={showToDatepicker}
            mode="date"
            date={toDate}
            onConfirm={onChangeToDate}
            onCancel={() => setShowToDatepicker(false)}
            maximumDate={new Date()}
          />
        )}
        <View
          style={{
            width: scaleSize(125),
          }}>
          <FormControl isReadOnly style={{}}>
            <Select
              key="size"
              placeholder="Select User"
              selectedValue={selectedUser}
              style={{ height: scaleSize(30) }}
              placeholderTextColor={COLORS.gray}
              borderColor={COLORS.lightGray}
              borderRadius={scaleSize(5)}
              borderWidth={scaleSize(1)}
              onValueChange={(itemValue: string) => selectUser(itemValue)}>
              {users.map((item: any, index: any) => (
                <Select.Item
                  key={index}
                  label={item?.User?.username || item?.User?.first_name}
                  value={item.User.id}
                />
              ))}
            </Select>
          </FormControl>
        </View>
        {(selectedUser || toShow || fromShow) && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setToDate(new Date());
              setToShow(false);
              setFromShow(false);
              setSelectedUser(null);
              setFromDate(new Date());
              getAnalyticsData(userData?.userDetail.id, null, null, null);
            }}
            style={[styles.clearButton]}>
            <Text size={MOBILE.textSize.common} color={COLORS.carrot}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  function productPieChart() {
    return (
      <View
        key={getRandomNumber()}
        style={[
          Styles.w100,
          Styles.pH10,
          Styles.pV10,
          Styles.primaryBackground,
        ]}>
        <View
          key={getRandomNumber()}
          style={[styles.cardContainer, Styles.w100, Styles.alignItemsCenter]}>
          <PieChart
            data={pieChartData}
            width={300}
            height={scaleSize(200)}
            chartConfig={{
              backgroundColor: '#fff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForLabels: { strokeWidth: 1, stroke: '#fff' },
            }}
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="65"
            absolute
            hasLegend={false}
          />

          <ScrollView style={styles.dotsContainer}>
            {pieChartData.map((segment: any, index: any) => (
              <View key={index} style={[styles.dotRow]}>
                <View
                  style={[styles.dot, { backgroundColor: segment.color }]}
                />
                <Text style={styles.dotText}>{segment.name}</Text>
                <Text style={styles.dotText}>
                  {calculatePercentage(segment.value)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  function productGraphChart() {
    return (
      graphChartData?.labels.length > 0 && (
        <View
          key={getRandomNumber()}
          style={[
            Styles.w100,
            Styles.pH10,
            Styles.pV15,
            Styles.primaryBackground,
          ]}>
          <View style={styles.chartContainer}>
            <LineChart
              data={graphChartData}
              width={scaleSize(350)}
              height={scaleSize(200)}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: Styles.w100,
              }}
            />
          </View>
        </View>
      )
    );
  }

  function productStackChart() {
    return (
      <View
        key={getRandomNumber()}
        style={[
          Styles.w100,
          Styles.pH10,
          Styles.pV10,
          Styles.primaryBackground,
        ]}>
        <View style={styles.chartContainer}>
          <BarChart
            style={{
              borderRadius: scaleSize(10),
            }}
            data={barChartData}
            width={scaleSize(350)}
            height={scaleSize(300)}
            fromZero={true}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: Styles.w100,
            }}
            withCustomBarColorFromData={true}
            flatColor={true}
            verticalLabelRotation={30}
          />
        </View>
      </View>
    );
  }

  function renderHeader() {
    return (
      <Header
        title="Analytics"
        goBack={true}
        onPress={() => navigation.goBack()}
      />
    );
  }

  if (loading) {
    return (
      <View style={[Styles.flexCenter, Styles.primaryBackground]}>
        <Spinner size={50} />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
        <TopNavigation currentScreen={'Analytics'} />
        <View style={[Styles.flex, Styles.w100]}>
          {renderHeader()}
          {dateRangeSelector()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[Styles.flexGrow, Styles.pB30]}>
            {productGraphChart()}
            {productPieChart()}
            {productStackChart()}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  chartContainer: {
    ...Styles.w100,
    ...Styles.justifyContentCenter,
    ...Styles.alignItemsCenter,
    elevation: 5,
    ...Styles.primaryBackground,
    borderRadius: scaleSize(5),
    ...Styles.pV15,
  },
  dotsContainer: {
    marginVertical: scaleSize(20),
    marginRight: scaleSize(10),
    marginLeft: scaleSize(10),
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleSize(10),
  },
  dot: {
    width: scaleSize(10),
    height: scaleSize(10),
    borderRadius: scaleSize(5),
  },
  dotText: {
    marginLeft: scaleSize(2.5),
    fontSize: MOBILE.textSize.xxSmall,
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scaleSize(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: scaleSize(10),
  },
  cardTitle: {
    fontSize: MOBILE.textSize.large,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginBottom: scaleSize(10),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleSize(5),
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerButton: {
    padding: 7,
    marginLeft: scaleSize(10),
    backgroundColor: '#013266',
    borderRadius: scaleSize(5),
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  counterText: {
    marginTop: scaleSize(10),
    marginLeft: scaleSize(5),
    marginRight: scaleSize(5),
    fontSize: MOBILE.textSize.xxSmall,
    fontWeight: 'bold',
    color: '#555',
  },
  dateFilterContainer: {
    ...Styles.w100,
    ...Styles.flexDirectionRow,
    ...Styles.pH10,
    ...Styles.justifyContentSpaceBetween,
    ...Styles.alignItemsCenter,
    ...Styles.pV10,
  },
  dateFieldContainer: {
    height: scaleSize(30),
    ...Styles.flexDirectionRow,
    ...Styles.alignItemsCenter,
  },
  dateField: {
    ...Styles.primaryBackground,
    ...Styles.h100,
    ...Styles.justifyContentCenter,
    ...Styles.alignItemsCenter,
    ...Styles.pH5,
    borderWidth: scaleSize(1),
    borderColor: COLORS.lightGray,
    borderRadius: scaleSize(5),
  },
  clearButton: {
    position: 'absolute',
    right: scaleSize(15),
    top: scaleSize(-20),
    zIndex: 1,
    backgroundColor: COLORS.lightBlue,
    ...Styles.p5,
    borderRadius: scaleSize(5),
  },
});
