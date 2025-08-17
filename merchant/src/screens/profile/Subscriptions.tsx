import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import { axiosInstance } from '../../config/axios';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'native-base';
import { AndroidSafeArea, COLORS, Text } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { Button, Header } from '../../components';
import { MaterialIcons } from '@expo/vector-icons';
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { HEADERS } from '../../utils/helpers';
import { fetchUserData } from '../../redux/authentication/authAction';
import Styles from '../../utils/styles';
import moment from 'moment';
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
  },
});

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
  isTrial: string;
  Features: Feature[];
}

interface Feature {
  name: string;
}

export default function Subscription() {
  const navigation = useNavigation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState<number>(0);
  const [subscriptionId, setSubscriptionId] = useState<number>(0);
  const [hasSubscription, setHasSubscription] = useState<number>(0);
  const { user } = useAppSelector(state => state.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [planDisabled, setPlanDisabled] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [time, setTime] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const userData = user;

  useEffect(() => {
    fetchPlans();
    getHistory();
    getSubscription();
  }, []);
  const fetchPlans = async () => {
    try {
      setRefreshing(true);
      const response = await axiosInstance.get<any>(
        `subscription/plan-by-id?merchant_id=${userData?.userDetail?.id}`,
      );
      setPlans(response?.data?.plans || []);
      // setPlanDisabled(response?.data?.disabled || false);
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setRefreshing(false);
      Toast.show({
        title: error?.response?.data?.message || "Couldn't fetch plans",
      });
    }
  };
  const getHistory = async () => {
    try {
      const merchantId = userData?.userDetail?.id;
      const response = await axiosInstance.get<any>(
        `merchant-subscriptions?merchant_id=${merchantId}`,
      );
      setHistory(response.data.merchantSubscriptions);
    } catch (error: any) {
      console.error(error);
      Toast.show({
        title: error?.response?.data?.message || "Couldn't fetch history",
      });
    }
  };

  const checkIfWithin24Hours = (subscriptionStartDate = '') => {
    if (subscriptionStartDate.length === 0) return false;
    const targetDate = moment();
    const subscriptionDate = moment(subscriptionStartDate);
    const diffInHours = Math.abs(targetDate.diff(subscriptionDate, 'hours'));
    return diffInHours <= 24;
  };

  const getSubscription = async () => {
    try {
      const merchantId = userData?.userDetail?.id;
      const response = await axiosInstance.get(
        `subscriptions/getSubscription?merchant_id=${merchantId}`,
      );
      setPlanId(response?.data?.subscriptions[0]?.SubscriptionPlan?.id);
      setHasSubscription(
        response?.data?.subscriptions[0]?.SubscriptionPlan?.month_count,
      );
      setSubscriptionId(response?.data?.subscriptions[0]?.id);
      const times = checkIfWithin24Hours(
        response?.data?.subscriptions[0]?.start_date,
      );
      setTime(times);
    } catch (error: any) {
      Toast.show({
        title: error?.response?.data?.message || "Couldn't fetch subscription",
      });
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      if (subscriptionId) {
        await axiosInstance.post<any>(
          'subscriptions/changeSubscription',
          {
            subscription_id: subscriptionId,
            plan_id: planId,
            merchant_id: userData?.userDetail?.id,
          },
          HEADERS,
        );
        Toast.show({
          title: 'Subscription changed successfully',
        });
      } else {
        await axiosInstance.post<any>('subscribe', {
          plan_id: planId,
          merchant_id: userData?.userDetail.id,
        });
        Toast.show({
          title: 'Subscription successful',
        });
      }
      await getSubscription();
    } catch (error: any) {
      Toast.show({
        title: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      dispatch(fetchUserData(userData?.userDetail?.id));
    }
  };
  function renderHeader() {
    return <Header title="Subscriptions" onPress={() => navigation.goBack()} />;
  }
  const renderHistoryModal = () => {
    const screenWidth = Dimensions.get('window').width;

    const historyData = [
      { date: '2023-01-01', plan: 'Bronze', amount: 10 },
      { date: '2023-02-01', plan: 'Bronze', amount: 10 },
    ];
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              width: screenWidth,
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>History:</Text>
            <View style={{ width: '100%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                }}>
                <Text style={{ flex: 2 }}>Date</Text>
                {/* <Text style={{ flex: 2 }}>Plan</Text> */}
                <Text style={{ flex: 2 }}>Amount</Text>
                <Text numberOfLines={1} style={{ flex: 2 }}>
                  Actions
                </Text>
              </View>
              {history && history.length ? (
                history.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ flex: 2 }}>{item.createdAt}</Text>
                    <Text style={{ flex: 2 }}>${item.amount_cad}</Text>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        style={{ marginTop: 10 }}
                        onPress={() => console.log('View action performed')}>
                        <MaterialIcons
                          name="visibility"
                          size={25}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No history found</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  function renderContent() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchPlans} />
        }>
        {plans?.length
          ? plans.map(plan => (
              <Card style={styles.card} key={plan.id}>
                <Card.Title title={plan.name} />
                <Card.Content>
                  <Text>Price: ${plan.price}</Text>
                  <Text>{plan.duration}</Text>
                  <Text>{plan.description}</Text>
                  {!hasSubscription && plan?.isTrial && (
                    <Text>30 Days Free Trial</Text>
                  )}
                  <View>
                    {plan.Features.map((feature, index) => (
                      <Text key={index}>{feature.name}</Text>
                    ))}
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button
                    disabled={plan.id == planId}
                    title={
                      plan.id == planId ? 'Subscribed' : 'Subscribe'
                      // : !hasSubscription && plan?.isTrial
                      //   ? 'Start Free Trial'
                    }
                    onPress={() => handleSubscribe(plan.id)}
                    containerStyle={{
                      marginTop: 10,
                      width: 150,
                    }}
                  />
                </Card.Actions>
              </Card>
            ))
          : null}
        {/* <Button
          title="Show History"
          onPress={() => setModalVisible(true)} // Set modal to visible
        /> */}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {planDisabled && (
        <View style={[Styles.w100, Styles.pH10]}>
          <Text color={COLORS.redShade}>
            You will be able to select the subscription plan after a month
            trial.
          </Text>
        </View>
      )}
      {renderContent()}
      {renderHistoryModal()}
    </SafeAreaView>
  );
}
