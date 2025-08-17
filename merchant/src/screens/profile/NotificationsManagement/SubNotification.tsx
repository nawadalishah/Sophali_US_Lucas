import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useStyles } from './styles';
import NotificationTopNavigation from './NotificationTopNavigation';
import UnreadNotification from './UnreadNotification';
import { useRoute } from '@react-navigation/native';
import { axiosInstance } from '../../../config/axios';
import { Toast } from 'native-base';
import { HEADERS } from '../../../utils/helpers';
import Styles from '../../../utils/styles';
import PopUpModal from '../../../components/PopUpModal';
import { CloseIcon } from '../../../utils/icons';
import { HIT_SLOP } from '../../../constants/theme';

const SubNotification = () => {
  const route = useRoute();
  const data = route.params.data;
  const user_id = route.params.user_id;
  const merchant_id = route.params.merchant_id;
  const activeTab = route.params.activeTab;
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState({ data: [], unRead: [], read: [] });
  const [current, setCurrent] = useState(activeTab);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState({
    activeModal: false,
    message: '',
  });
  const styles = useStyles();

  useEffect(() => {
    setNotifications(data);
    setCurrent(activeTab);
    setLoading(false);
  }, [data]);

  const currentTabsHandler = useCallback(name => {
    setCurrent(name);
  }, []);

  useEffect(() => {
    const tabData =
      notifications.find(
        notification => notification.notification_type === current,
      ) || null;
    if (tabData) {
      setMessages({
        data: tabData.messages || [],
        unRead: tabData.unreadMessages || [],
        read: tabData.readMessages || [],
      });
    } else {
      setMessages({ data: [], unRead: [], read: [] });
    }
  }, [current, notifications]);

  const markAsReadHandler = useCallback(
    async item => {
      const payload = { id: item?.id, user_id, merchant_id };
      try {
        const response = await axiosInstance.post(
          'notifications/mark-as-read',
          payload,
          HEADERS,
        );
        if (response.data) {
          Toast.show({ title: 'Marked as read successfully' });
          setNotifications(prevNotifications =>
            prevNotifications.map(notification => {
              // Check if the current notification contains the message we're updating
              const messageToUpdate = notification.messages.find(
                msg => msg.id === item.id,
              );
              if (messageToUpdate) {
                const updatedMessages = notification.messages.map(msg =>
                  msg.id === item.id ? { ...msg, status: 'read' } : msg,
                );

                const updatedUnreadMessages =
                  notification.unreadMessages.filter(msg => msg.id !== item.id);
                const updatedReadMessages = [
                  ...notification.readMessages,
                  { ...messageToUpdate, status: 'read' },
                ];

                return {
                  ...notification,
                  messages: updatedMessages,
                  unreadMessages: updatedUnreadMessages,
                  readMessages: updatedReadMessages,
                };
              }
              return notification;
            }),
          );
        }
      } catch (error) {
        Toast.show({
          title: error?.response?.data?.message || 'Cannot mark as read',
        });
      }
    },
    [user_id, merchant_id, current],
  );

  const notificationDelHandler = useCallback(
    async item => {
      try {
        Alert.alert('Confirm Deletion', 'Are you sure?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await axiosInstance
                .delete<any>('notifications/delete', { data: { id: item?.id } })
                .then(res => {
                  if (res.data) {
                    setNotifications(prevNotifications =>
                      prevNotifications.map(notification => {
                        const updatedMessages = notification.messages.filter(
                          msg => msg.id !== item.id,
                        );
                        const updatedReadMessages =
                          notification.readMessages.filter(
                            msg => msg.id !== item.id,
                          );

                        return {
                          ...notification,
                          messages: updatedMessages,
                          readMessages: updatedReadMessages,
                        };
                      }),
                    );
                    Toast.show({
                      title: 'Notification has been removed',
                    });
                  }
                })
                .catch(error => {
                  Toast.show({
                    title:
                      error?.response?.data?.message ||
                      'Cannot delete the notification',
                  });
                });
            },
          },
        ]);
      } catch (error) {}
    },
    [messages, notifications],
  );
  const onCloseModal = useCallback(() => {
    setOpenModal({
      activeModal: false,
      message: '',
    });
  }, [openModal]);

  const onClickNotification = useCallback(
    (value: string) => {
      setOpenModal({
        activeModal: true,
        message: value,
      });
    },
    [openModal],
  );

  return (
    <View style={styles.subNotificationContainer}>
      {!loading && (
        <>
          <NotificationTopNavigation
            current={current}
            setCurrent={currentTabsHandler}
          />
          <View style={[Styles.w100, Styles.pH20]}>
            <UnreadNotification
              data={messages?.unRead}
              markAsReadHandler={markAsReadHandler}
              onClickNotification={onClickNotification}
            />
            <View style={styles.hrline} />
            <UnreadNotification
              data={messages?.read}
              notificationDelHandler={notificationDelHandler}
              onClickNotification={onClickNotification}
            />
          </View>
        </>
      )}
      <PopUpModal open={openModal?.activeModal} onClose={onCloseModal}>
        <View style={[styles.modalContainer]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCloseModal}
            hitSlop={HIT_SLOP.FIFTEEN}
            style={[styles.closeBtn]}>
            <CloseIcon />
          </TouchableOpacity>
          <View style={[Styles.justifyContentCenter, Styles.w100, Styles.flex]}>
            <Text>{openModal?.message}</Text>
          </View>
        </View>
      </PopUpModal>
    </View>
  );
};

export default SubNotification;
