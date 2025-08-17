import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  ArrowForwardIcon,
  Center,
  Flex,
  Spinner,
  Switch,
  Toast,
} from 'native-base';
import { AndroidSafeArea, COLORS, Text } from '../../constants';
import { Header } from '../../components';
import { useAppSelector } from '../../redux/Store';
import { axiosInstance } from '../../config/axios';
import { signOut } from '../../redux/authentication/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../redux/Store';
import ChangeTax from './ChangeTax';
import { HEADERS } from '../../utils/helpers';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Styles from '../../utils/styles';
import PopUpModal from '../../components/PopUpModal';
import { MOBILE } from '../../utils/orientation';
import { useSelector } from 'react-redux';
import { deleteUser, resetDeleteUser } from '../../redux/User/deleteUserSlice';
import { AppState, DeleteModalPropTypes, OpenClosePayloadTypes, SettingsObjectTypes } from '../../interfaces/dtos';
import { AxiosError } from 'axios';

export default function Settings() {
  const navigation = useNavigation();
  const [isSwitchOn, setIsSwitchOn] = useState<SettingsObjectTypes['isSwitchOn']>(true);
  const [settings, setSettings] = useState<SettingsObjectTypes['settings']>({});
  const [merchantSettings, setMerchantSettings] = useState<SettingsObjectTypes['merchantSettings']>({});
  const {user: userData} = useAppSelector((state: AppState) => state?.auth);
  const [favorite, setFavorite] = useState<SettingsObjectTypes['favorite']>('Settings');
  const [isSettingLoading, setIsSettingLoading] = useState<SettingsObjectTypes['isSettingLoading']>(false);
  const [isSavingLoading, setIsSavingLoading] = useState<SettingsObjectTypes['isSavingLoading']>(false);
  const [restaurantStatus, setRestaurantStatus] = useState<SettingsObjectTypes['restaurantStatus']>('Open');
  const [adminSetting, setAdminSetting] = useState<SettingsObjectTypes['adminSetting'] | null>(null);
  const [openModal, setOpenModal] = useState<SettingsObjectTypes['openModal']>(false);
  const currentTodayDate = new Date().getTime();
  const [date, setDate] = useState<SettingsObjectTypes['date']>(
    new Date(currentTodayDate + 12 * 60 * 60 * 1000),
  );
  const [startDate, setStartDate] = useState<SettingsObjectTypes['startDate']>(new Date(currentTodayDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState<SettingsObjectTypes['showStartDatePicker']>(false);
  const [showCloseDatePicker, setShowCloseDatePicker] = useState<SettingsObjectTypes['showCloseDatePicker']>(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<SettingsObjectTypes['isDatePickerVisible']>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<SettingsObjectTypes['openDeleteModal']>({
    open: false,
    confirmModal: false,
  });
  const today = moment().format('YYYY-MM-DD');
  const isFocused = useIsFocused();
  const { success } = useSelector((state: AppState) => state.deleteUser);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getSetting();
  }, [openModal]);

  useEffect(() => {
    getDataAdmin();
  }, [isFocused]);
  useEffect(() => {
    if (merchantSettings && merchantSettings.settings) {
      setSettings(merchantSettings.settings);
      setIsSwitchOn(merchantSettings?.settings?.status === 'Open');
      setRestaurantStatus(merchantSettings?.settings?.status || 'Open');

      if (merchantSettings?.settings?.end_time) {
        const endDateTime = new Date(
          Number(merchantSettings?.settings?.end_time),
        );
        setDate(endDateTime);
      }
      if (merchantSettings?.settings?.start_time) {
        const startDateTime = new Date(
          Number(merchantSettings?.settings?.start_time),
        );

        setStartDate(startDateTime);
      }
    }
  }, [merchantSettings]);

  useEffect(() => {
    if (success) {
      signOutHandler();
    }

    return () => {
      dispatch(resetDeleteUser());
    };
  }, [success]);

  const signOutHandler = async () => {
    await AsyncStorage.removeItem('merchant-token');
    await AsyncStorage.removeItem('merchantData');
    await AsyncStorage.setItem('merchantAppLoggedStatus', '0');

    dispatch(signOut());
  };
  const getDataAdmin = async () => {
    const response = await axiosInstance.get<any>('setting/admin/1');
    if (response?.data) {
      await AsyncStorage.setItem('adminData', JSON.stringify(response.data));
      setAdminSetting(response?.data);
    } else {
      setAdminSetting(null);
    }
  };

  //Change the Merchant Tax Rate
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  //Navigate To the Password Screen
  const navigatetoPassword = () => {
    navigation.navigate('ChangePassword');
  };
  async function getSetting() {
    setIsSettingLoading(true);
    try {
      const res = await axiosInstance.get<any>(
        `setting/${userData?.userDetail.id}`,
      );
      if (res.data && res.data.settings) {
        setMerchantSettings(res.data);
        setIsSettingLoading(false);
      } else {
        setIsSettingLoading(false);
      }
    } catch (e: any) {
      setIsSettingLoading(false);

      Toast.show({
        title: e?.response?.data?.message || 'Cannot get settings',
      });
    }
  }

  function NavigateToScreen(screenName: string) {
    navigation.dispatch(
      CommonActions.navigate({
        name: screenName,
      }),
    );
  }

  async function saveSettings(
    switcher: boolean | null = null,
    startTime = null,
    endTime = null,
  ) {
    setIsSavingLoading(true);
    const merchantId = settings?.merchant_id || userData?.userDetail.id;
    const payload: OpenClosePayloadTypes = {
      id: settings.id,
      merchant_id: merchantId,
    };
    if (switcher !== null) {
      payload.status = switcher == true ? 'Open' : 'Close';
    }
    if (startTime) {
      payload.start_time = startTime;
    }
    if (endTime) {
      payload.end_time = endTime;
    }
    try {
      const res = await axiosInstance.post<any>(
        'setting/update',
        payload,
        HEADERS,
      );
      if (res.data) {
        setIsSavingLoading(false);
        setRestaurantStatus(res.data?.status);

        if (res?.data?.end_time) {
          const endDateTime = moment(`${today} ${res?.data?.end_time}`);
          setDate(endDateTime.toDate());
        }

        if (res?.data?.start_time) {
          const startDateTime = moment(`${today} ${res?.data?.start_time}`);
          setStartDate(startDateTime.toDate());
        }

        Toast.show({
          title: 'Update settings successfully',
        });
        await getSetting();
      } else {
        setIsSavingLoading(false);
      }
    } catch (e: any) {
      setIsSavingLoading(false);
      Toast.show({
        title: e?.response?.data?.message || 'Cannot update settings',
      });
    }
  }
  const handleSwitchToggle = async () => {
    const switcher = !isSwitchOn;
    setIsSwitchOn(switcher);
    await saveSettings(switcher);
  };

  const hideDatePicker = useCallback(() => {
    setTimeout(() => {
      setDatePickerVisibility(false);
      setShowStartDatePicker(false);
      setShowCloseDatePicker(false);
    }, 500);
  }, [isDatePickerVisible, showStartDatePicker, showCloseDatePicker]);

  // const onChangeClose = useCallback(
  //   async (selectedTime: any) => {
  //     setShowCloseDatePicker(false);
  //     setDate(selectedTime);
  //     const todays = moment().startOf('day');
  //     const hours = moment(selectedTime).hour();
  //     const minutes = moment(selectedTime).minute();
  //     todays.hour(hours);
  //     todays.minute(minutes);
  //     const timeInMilliseconds = todays.utc().valueOf();
  //     await saveSettings(null, null, timeInMilliseconds);
  //   },
  //   [showCloseDatePicker, date],
  // );

  // const onChangeStart = useCallback(
  //   async (selectedDate: any) => {
  //     setShowStartDatePicker(false);
  //     const currentDate = selectedDate;
  //     setStartDate(currentDate);

  //     const pickedTime = moment(currentDate);
  //     const startTimeInUTC = pickedTime.utc();

  //     // const todays = moment().startOf('day');
  //     // const hours = moment(selectedDate).hour();
  //     // const minutes = moment(selectedDate).minute();
  //     // todays.hour(hours);
  //     // todays.minute(minutes);
  //     // const timeInMilliseconds = todays.utc().valueOf();
  //     console.log(
  //       'The',
  //       currentDate,
  //       pickedTime,
  //       startTimeInUTC,
  //       startTimeInUTC.valueOf(),
  //     );
  //     await saveSettings(null, startTimeInUTC.valueOf(), null);
  //   },
  //   [showStartDatePicker, startDate],
  // );

  const onChangeClose = useCallback(
    async (selectedTime: any) => {
      setShowCloseDatePicker(false);
      setDate(selectedTime);
      const timeInMilliseconds = moment.utc(selectedTime).valueOf();
      await saveSettings(null, null, timeInMilliseconds);
    },
    [showCloseDatePicker, date],
  );

  const onChangeStart = useCallback(
    async (selectedDate: any) => {
      setShowStartDatePicker(false);
      setStartDate(selectedDate);
      const timeInMilliseconds = moment.utc(selectedDate).valueOf();
      await saveSettings(null, timeInMilliseconds, null);
    },
    [showStartDatePicker, startDate],
  );

  const deleteAccount = useCallback(() => {
    setOpenDeleteModal({ open: false, confirmModal: false });
    dispatch(deleteUser({ id: userData?.userDetail.id }));
  }, [openDeleteModal, userData, dispatch]);

  const handleKOB = useCallback(async () => {
    try {
      const res = await axiosInstance.get<any>(
        `orders/merchant-order-exist?merchant_id=${userData?.userDetail.id}`,
      );
      const response = res?.data;
      if (response?.code === 200) {
        Toast.show({
          title: 'Please resolve all pending orders before account removal.',
        });
      } else {
        setOpenDeleteModal({ open: true, confirmModal: false });
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        Toast.show({
          title: err.response.data.message || 'Something went wrong',
        });
      } else {
        Toast.show({
          title: 'Something went wrong',
        });
      }
    }
  }, [openDeleteModal]);

  function renderHeader() {
    return <Header title="Settings" onPress={() => navigation.goBack()} />;
  }

  function renderContent() {
    if (isSettingLoading) {
      return <Spinner size={50} style={Styles.Centered} />;
    } else {
      return (
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 36,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: 12,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 12,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'Settings' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 155,
                }}
                onPress={() => setFavorite('Settings')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Settings' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'Banking Info' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 155,
                }}
                onPress={() => NavigateToScreen('BankingInfo')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Banking Info' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Banking Info
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 12,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'BusinessInfo' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 150,
                }}
                onPress={() => NavigateToScreen('BusinessInfo')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'BusinessInfo' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Business Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'Change Password' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 150,
                }}
                onPress={() => NavigateToScreen('ChangePassword')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Change Password'
                        ? COLORS.white
                        : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainView_}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                {restaurantStatus}
              </Text>
            </View>
            <View style={styles.mainView1}>
              <View>
                <Flex direction="row">
                  <Center
                    _text={{
                      color: 'coolGray.800',
                    }}>
                    <Switch
                      size="sm"
                      value={isSwitchOn}
                      onToggle={handleSwitchToggle}
                      colorScheme="emerald"
                    />
                  </Center>
                </Flex>
              </View>
            </View>
          </View>
          <View style={styles.mainView}>
            <View style={styles.mainView1}>
              <Text style={Styles.p5}>Opening Time</Text>
              <Text style={Styles.p5}>Closing Time</Text>
            </View>
            <View style={styles.mainView1}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  {
                    borderWidth: 1,
                    borderRadius: 5,
                    ...Styles.p5,
                    elevation: 1,
                    backgroundColor: COLORS.white,
                  },
                ]}
                onPress={() => {
                  setTimeout(() => {
                    setShowStartDatePicker(true);
                  }, 500);
                }}>
                <Text
                // style={styles.dateTimeText}
                >
                  {moment(startDate).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  {
                    borderWidth: 1,
                    borderRadius: 5,
                    ...Styles.p5,
                    elevation: 1,
                    backgroundColor: COLORS.white,
                  },
                ]}
                onPress={() => {
                  setTimeout(() => {
                    setShowCloseDatePicker(true);
                  }, 500);
                }}>
                <Text
                // style={styles.dateTimeText}
                >
                  {moment(date).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showStartDatePicker && (
            <DateTimePickerModal
              isVisible={showStartDatePicker}
              mode="time"
              date={startDate}
              onConfirm={onChangeStart}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
            />
          )}
          {showCloseDatePicker && (
            <DateTimePickerModal
              isVisible={showCloseDatePicker}
              mode="time"
              date={date}
              onConfirm={onChangeClose}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.mainView}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Tax Rate</Text>
              <Text>
                Global Tax Rate:{' '}
                {parseFloat(adminSetting?.settings?.tax || 0).toFixed(2)}%
              </Text>
              <Text>
                Tax Set By Merchant:{' '}
                {parseFloat(merchantSettings?.settings?.tax || 0).toFixed(2)}%
              </Text>
            </View>
            <TouchableOpacity onPress={toggleModal}>
              <ArrowForwardIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.mainView}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Language</Text>
              <Text>English</Text>
            </View>
            {/* <View style={styles.mainView1}>
              <ArrowForwardIcon />
            </View> */}
          </View>
          <View style={styles.mainView}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                Default Currency
              </Text>
              <Text>$CA</Text>
            </View>
            {/* <View style={styles.mainView1}>
              <ArrowForwardIcon />
            </View> */}
          </View>

          <View style={styles.mainView}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                Delete Account
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleKOB()}
              activeOpacity={0.7}
              style={styles.mainView1}>
              <ArrowForwardIcon />
            </TouchableOpacity>
          </View>

          {/* <View style={styles.mainView}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Upgrade</Text>
            </View>
            <TouchableOpacity
              onPress={() => alert('App will be upgraded from Play Store')}
              style={styles.mainView1}>
              <ArrowForwardIcon />
            </TouchableOpacity>
          </View> */}
          <View style={styles.mainView}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>About</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.sophali.ca/');
              }}
              style={styles.mainView1}>
              <ArrowForwardIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.mainView__}>
            <View style={styles.mainView1}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Logout</Text>
            </View>
            <TouchableOpacity onPress={signOutHandler}>
              <View style={styles.mainView1}>
                <ArrowForwardIcon />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      );
    }
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
      <ChangeTax
        openModal={openModal}
        setOpenModal={setOpenModal}
        toggleModal={toggleModal}
        merchantSettings={merchantSettings}
        saveSettings={saveSettings}
        setIsSavingLoading={setIsSavingLoading}
        getSetting={getSetting}
        settings={settings}
      />

      {openDeleteModal.open && (
        <DeleteModal
          open={openDeleteModal?.open}
          onClose={() =>
            setOpenDeleteModal({ open: false, confirmModal: false })
          }
          onConfirm={() =>
            setOpenDeleteModal({ open: false, confirmModal: true })
          }
          isConfirmModal={true}
        />
      )}

      {openDeleteModal.confirmModal && (
        <DeleteModal
          open={openDeleteModal?.confirmModal}
          onClose={() =>
            setOpenDeleteModal({ open: false, confirmModal: false })
          }
          onConfirm={() => deleteAccount()}
        />
      )}
    </SafeAreaView>
  );
}

const DeleteModal: React.FC<DeleteModalPropTypes> = ({ isConfirmModal, open, onClose, onConfirm }) => (
  <PopUpModal open={open} onClose={onClose}>
    <View style={styles.modalContainer}>
      <Text style={styles.titleTxt}>
        {isConfirmModal
          ? 'Are you sure you want to delete your account?'
          : 'You are about to delete your account from Sophali.'}
      </Text>
      {isConfirmModal && (
        <Text style={styles.yourAccDeleteTxt}>
          {isConfirmModal
            ? 'Your account will be deleted along with all your data. You will no longer be able to withdraw any amount from Sophali.'
            : ''}
        </Text>
      )}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.deleteButton]}
          onPress={() => onConfirm()}>
          <Text style={styles.deleteTxt}>
            {isConfirmModal ? 'Delete' : 'Confirm'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={() => onClose()}>
          <Text style={styles.cancelTxt}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </PopUpModal>
);

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  mainView_: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainView1: {
    justifyContent: 'center',
    gap: 5,
  },
  mainView1_: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 5,
  },
  mainView__: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    padding: 10,
    borderRadius: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
    width: 100,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  titleTxt: {
    fontSize: MOBILE.textSize.mLarge,
    fontWeight: 'bold',
    ...Styles.mB20,
  },
  yourAccDeleteTxt: {
    fontSize: MOBILE.textSize.medium,
    ...Styles.mB20,
  },
  deleteTxt: {
    color: COLORS.white,
    fontSize: MOBILE.textSize.medium,
    fontWeight: 'bold',
  },
  cancelTxt: {
    color: COLORS.black,
    fontSize: MOBILE.textSize.medium,
    fontWeight: 'bold',
  },
});
