import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import { Toast, Spinner } from 'native-base';
import { debounce, round } from 'lodash';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../../components';
import { useAppSelector } from '../../../redux/Store';
import { axiosInstance } from '../../../config/axios';
import { AndroidSafeArea, COLORS, FONTS } from '../../../constants';
import Styles from '../../../utils/styles';
import { HEADERS } from '../../../utils/helpers';
import { pusherEventHandler } from '../../../utils';
import TopNavigation from '../../../components/TopNavigation';
export default function NotificationScreen() {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const userData: any = user;

  const [headerTitle] = useState('Notifications');
  const [NotificationsData, setNotifications] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markLoadingStates, setMarkLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const isFocused = useIsFocused();

  useEffect(() => {
    if (userData && userData?.userDetail?.id) {
      getNotifications();
    }
  }, [userData, isFocused]);

  useEffect(() => {
    pusherActivate();
  }, [isFocused]);

  const pusherActivate = useCallback(async () => {
    try {
      pusherEventHandler(userData?.userDetail.id, getNotifications);
    } catch (error) {
      console.log('Error activating Pusher:', error);
    }
  }, [userData?.userDetail.id, getNotifications]);

  async function getNotifications() {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get<any>(
        `notifications?merchant_id=${userData?.userDetail?.id}`,
      );
      if (res.data) {
        setNotifications(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      Toast.show({
        title: e?.response?.data?.message || 'Cannot get notifications',
      });
    }
  }

  const debouncedMarkAsRead = debounce((item: any) => {
    markAsRead(item);
  }, 300);

  function markAsRead(data: any) {
    const payload = { id: data.id, user_id: data.user_id };

    setMarkLoadingStates(prev => ({ ...prev, [data.id]: true }));

    axiosInstance
      .post<any>('notifications/mark-as-read', payload, HEADERS)
      .then(res => {
        if (res.data) {
          Toast.show({
            title: 'Marked as read successfully',
          });
          setMarkLoadingStates(prev => ({ ...prev, [data.id]: false }));
          setNotifications((prev: any) =>
            prev.map((item: any) => {
              if (item.id === data.id) {
                return { ...item, status: 'read' };
              }
              return item;
            }),
          );
          // getNotifications();
        }
      })
      .catch(error => {
        Toast.show({
          title: error?.response?.data?.message || 'Cannot mark as read',
        });
        setMarkLoadingStates(prev => ({ ...prev, [data.id]: false }));
      });
  }

  const MemoizedListItem = React.memo(
    ({ item }: any) => (
      <Shadow
        offset={[0, 0]}
        distance={15}
        startColor={'rgba(6, 38, 100, 0.04)'}
        // @ts-ignore
        finalColor={'rgba(6, 38, 100, 0.0)'}
        // @ts-ignore
        viewStyle={styles.shadowStyle}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.listItemContainer}
          onPress={() => {
            navigation.navigate('SubNotification' as never, {
              unread: item.unReadMessages,
              read: item.readMessages,
              user_id: item?.User?.id,
              merchant_id: item?.Merchant?.id,
              data: NotificationsData,
              activeTab: item?.notification_type,
            });
          }}>
          <View style={styles.listItemContent}>
            <View style={styles.listItemRow}>
              <View style={styles.iconnameContainer}>
                {item?.notification_type === 'Order' ? (
                  <MaterialCommunityIcons
                    name="chef-hat"
                    size={24}
                    color="#FF6633"
                  />
                ) : item?.notification_type === 'Chat' ? (
                  <Ionicons name="chatbubble" size={24} color="#660066" />
                ) : item?.notification_type === 'Buddy' ? (
                  <FontAwesome5 name="user-friends" size={20} color="#000066" />
                ) : item?.notification_type === 'Coupon' ? (
                  <MaterialCommunityIcons
                    name="clipboard-text"
                    size={24}
                    color="#6666FF"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="clipboard-text"
                    size={24}
                    color="#6666FF"
                  />
                )}
                <Text style={styles.dateTitle}>
                  {item?.notification_type === 'Order'
                    ? 'User'
                    : item?.notification_type}
                </Text>
              </View>
              {/* <Text style={[styles.dateText, { textTransform: 'none' }]}>
              {moment(item.createdAt).format('MMM Do YYYY')} at{' '}
              {moment(item.createdAt).format('hh:mm A')}
            </Text> */}
            </View>
            {/* <View style={styles.listItemRow}>
            <Text style={styles.statusTitle}>Status</Text>
            <Text style={styles.statusText}>{item.status}</Text>
          </View> */}
            {item?.messages.slice(0, 2).map((i: any, idx: number) => (
              <View key={idx} style={styles.messageRow}>
                <Octicons name="dot-fill" size={15} color="black" />
                <Text
                  style={{
                    ...styles.messageText,
                    fontWeight: i.status === 'unread' ? 'bold' : '',
                  }}>
                  {i?.message?.toString().length > 0
                    ? i?.message.toString().slice(0, 50) + '...'
                    : i?.message + '...'}
                </Text>
              </View>
            ))}
            {/* <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={item.status === 'read'}
              style={
                item.status === 'read'
                  ? styles.buttonDisabled
                  : styles.buttonEnabled
              }
              onPress={() => {
                debouncedMarkAsRead(item);
              }}>
              {markLoadingStates[item.id] ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {item.status === 'read' ? 'Read' : 'Unread'}
                </Text>
              )}
            </TouchableOpacity>
          </View> */}
            <View style={styles.btnRow}>
              <View>
                <Text style={styles.counterBtnText}></Text>
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  //@ts-ignore
                  navigation.navigate('SubNotification' as never, {
                    unread: item.unReadMessages,
                    read: item.readMessages,
                    user_id: item?.User?.id,
                    merchant_id: item?.Merchant?.id,
                    data: NotificationsData,
                    activeTab: item?.notification_type,
                  });
                }}>
                <Text style={styles.buttonText}>Show More...</Text>
              </TouchableOpacity>
              <View style={styles.counterBtn}>
                <Text style={styles.counterBtnText}>{item?.unread_count}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Shadow>
    ),
    [],
  );

  function renderContent() {
    if (isLoading) {
      return <Spinner size={50} style={styles.spinner} />;
    }
    if (!isLoading && NotificationsData.length === 0) {
      return (
        <View style={[Styles.Centered]}>
          <Text>Notifications not found</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={NotificationsData}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          windowSize={5}
          renderItem={({ item, index }) => <MemoizedListItem item={item} />}
        />
      );
    }
  }

  function renderHeader() {
    return (
      <Header
        title={headerTitle}
        onPress={() => navigation.navigate('MainLayout', { screen: 'Home' })}
        titleStyle={{ fontSize: 20 }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[Styles.flex, Styles.primaryBackground]}>
        <TopNavigation currentScreen={'Notifications'} />
        {renderHeader()}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: AndroidSafeArea.AndroidSafeArea,
  spinner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  shadowStyle: { width: '100%' },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
  },
  listItemContent: {
    flex: 1,
    marginTop: 12,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTitle: {
    ...FONTS.H5,
    textTransform: 'capitalize',
    lineHeight: 24 * 1.2,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  dateText: {
    textTransform: 'capitalize',
    lineHeight: 24 * 1.2,
    color: COLORS.black,
  },
  statusTitle: {
    ...FONTS.H4,
    textTransform: 'capitalize',
    lineHeight: 24 * 1.2,
    color: COLORS.black,
  },
  statusText: {
    textTransform: 'capitalize',
    lineHeight: 24 * 1.2,
    color: COLORS.black,
  },
  messageRow: {
    flexDirection: 'row',
    width: '100%',
    ...Styles.pL20,
    // justifyContent: 'center',
    // gap: 8,
    alignItems: 'center',
  },
  messageTitle: {
    ...FONTS.H4,
    textTransform: 'capitalize',
    lineHeight: 24 * 1.2,
    color: COLORS.black,
  },
  messageText: {
    flexDirection: 'row',
    color: COLORS.black,
    ...Styles.pL5,
  },
  buttonContainer: {
    backgroundColor: COLORS.green,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  buttonEnabled: {
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 24,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: COLORS.white,
  },
  iconnameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  counterBtn: {
    backgroundColor: '#FF6633',
    borderRadius: 50,
    width: 30,
    height: 30,
    color: 'white',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  btnRow: {
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
