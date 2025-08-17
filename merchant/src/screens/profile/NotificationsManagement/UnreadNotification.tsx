import { View } from 'react-native';
import React from 'react';
import { useStyles } from './styles';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Scroller from '../../../components/Scroller';
import { COLORS, Text } from '../../../constants';
import { MaterialIcons } from '@expo/vector-icons';

const UnreadNotification = ({
  data,
  markAsReadHandler = () => {},
  notificationDelHandler = () => {},
  onClickNotification = () => {},
}: any) => {
  const styles = useStyles();

  return (
    <View style={styles.unreadContainer}>
      <Scroller
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.unreadlist}
            // disabled={item?.status === 'read'}
            onPress={() => {
              onClickNotification(item?.message || '');
              markAsReadHandler(item);
            }}>
            {item?.status === 'read' && (
              <View style={[styles.row]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    notificationDelHandler(item);
                  }}>
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    style={{ textAlign: 'right' }}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            )}
            <Text
              style={[
                {
                  fontWeight: item?.status === 'unread' ? 'bold' : '400',
                },
              ]}>
              {item?.message}
            </Text>
            <Text
              style={{
                ...styles.unreadListDate,
                fontWeight: item?.status === 'unread' ? 'bold' : '400',
              }}>
              {moment(item?.createdAt).format('MMM DD,YYYY hh:mm A')}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default UnreadNotification;
