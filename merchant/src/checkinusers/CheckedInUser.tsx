import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '../components';
import { useAppDispatch, useAppSelector } from '../redux/Store';
import { useNavigation } from '@react-navigation/native';
import { getUserList } from '../redux/User/userActions';
import { COLORS } from '../constants';
import { deviceWidth } from '../utils/orientation';
import { scaleSize } from '../utils/mixins';

const CheckedInUser = () => {
  const { user } = useAppSelector(state => state.auth);
  const navigation = useNavigation();
  const userData = user;

  const [subUserList, setUserList] = useState<any>();
  const dispatch = useAppDispatch();
  const getCheckedInUser = useCallback(async () => {
    const data = await dispatch(getUserList(userData?.userDetail));
    setUserList(data.payload.userList);
  }, [userData?.userDetail?.id]);

  useEffect(() => {
    getCheckedInUser();
  }, []);

  const renderContent = () => (
    <View style={{ marginBottom: 90 }}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={subUserList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold' }}>Username:</Text>
              <Text>{item?.username || item.first_name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold' }}>Email:</Text>
              <Text>{item?.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold' }}>Subscription Date:</Text>
              <Text>{new Date(item?.checkin_date).toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold' }}>Subscription Date:</Text>
              <Text>{item?.isSubscribed}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <View>
      <Header title="CheckedIn User List" onPress={() => navigation.goBack()} />
      {renderContent()}
    </View>
  );
};

export default CheckedInUser;
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: scaleSize(16),
    // backgroundColor: 'grey',
    // marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
});
