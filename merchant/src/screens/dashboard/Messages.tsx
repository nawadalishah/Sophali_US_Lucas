import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AndroidSafeArea, FONTS } from '../../constants';
import { ArrowTwo } from '../../svg';
import { useAppSelector } from '../../redux/Store';
import { FormControl, Select, Toast } from 'native-base';
import { Button } from '../../components';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';
import { axiosInstance } from '../../config/axios';
import InputFieldArea from '../../components/TextAreaInput';
import { HEADERS } from '../../utils/helpers';

export default function Messages() {
  const { width } = Dimensions.get('window');
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState('0');
  const [userList, setUserList] = useState<any>([]);

  const schema = yup.object().shape({
    message: yup.string().required('Message is required'),
  });
  const [form, setForm] = useState({
    userId: null,
    message: '',
  });

  useEffect(() => {
    if (userData?.userDetail?.id) {
      getUserList(userData?.userDetail?.id);
    }
  }, [userData?.userDetail?.id]);

  async function getUserList(id: number) {
    try {
      const res = await axiosInstance.get<any>(
        `users/subscribe-user-list/${id}`,
      );
      if (res && res.data && res.data.userList) {
        setUserList(res.data.userList);
      }
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to get user list',
      });
    }
  }

  function setCategory(id: any) {
    setSelectedUser(id);
    form.userId = id;
  }

  async function sendMessage() {
    if (!form.userId || !form.message) {
      Toast.show({
        title: 'Please Enter the message details',
      });

      return;
    }

    if (form.userId && form.message) {
      setIsSendingMessage(true);
      const messagePayload = {
        merchant_name: userData?.userDetail.company_name,
        message: form.message,
        user_id: form.userId,
      };

      try {
        const res = await axiosInstance.post<any>(
          'send-message',
          messagePayload,
          HEADERS,
        );
        if (res && res.data && res.data.success) {
          setIsSendingMessage(false);
          setForm({
            userId: null,
            message: '',
          });
          setSelectedUser('0');
          Toast.show({
            title: 'Message sent successfully',
          });
        }
      } catch (e: any) {
        setIsSendingMessage(false);
        Toast.show({
          title: e?.response?.data?.message || 'Unable to send message',
        });
      }
    }
  }

  function renderScreen() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 30,
        }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...FONTS.H1 }}>Message</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 16, top: 34 }}>
            <ArrowTwo />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 20,
            width: 100,
          }}>
          <Select
            key="user"
            placeholder="User Selection"
            selectedValue={selectedUser}
            width={width - 30}
            onValueChange={(itemValue: any) => setCategory(itemValue)}>
            {userList.map((item: any, index: any) => (
              <Select.Item
                key={index}
                label={
                  item.screenName
                    ? item.screenName
                    : item.first_name + ' ' + item.last_name
                }
                value={item.id}
              />
            ))}
          </Select>
        </View>

        <FormControl mb={7} isInvalid={!!errors.email}>
          <InputFieldArea
            title="Message"
            placeholder=""
            onchange={(v: string) => {
              setForm({ ...form, message: v });
            }}
            value={form.message}
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>
        <Button
          title="Send"
          containerStyle={{ marginBottom: 20 }}
          onPress={sendMessage}
          textStyle
          disabled={isSendingMessage}
          isLoading={isSendingMessage}
        />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderScreen()}
    </SafeAreaView>
  );
}
