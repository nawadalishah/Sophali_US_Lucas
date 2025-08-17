import React, { useState, useEffect, useRef, useCallback } from 'react';
import base64 from 'react-native-base64';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
// import { PermissionStatus, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import {
  acceptOrderAction,
  activeOrders,
} from '../../../redux/orders/activeOrders/activeOrderAction';
import { axiosInstance } from '../../../config/axios';
import { Toast } from 'native-base';
import { COLORS, Text } from '../../../constants';
import { Button, Header } from '../../../components';
import { scaleSize } from '../../../utils/mixins';
import { isSubMerchant } from '../../../utils/helpers';
import Styles from '../../../utils/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PERSIST_TAPS } from '../../../constants/theme';
import { MOBILE } from '../../../utils/orientation';

const Corner = ({ animatedStyle }: any) => (
  <Animated.View style={animatedStyle} />
);

export default function BarCodeScannerScreen({
  pickedUpOrder,
  setPickUp,
  pickUp,
}: any) {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [hasPermission, setHasPermission] = useState(null);
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [scanned, setScanned] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const animate = useRef(new Animated.Value(0)).current;
  const isSubMerchantRole = isSubMerchant(user?.role?.name);

  const animationColor = animate.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFF', '#FFF'],
  });
  const animationSize = animate.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 55],
  });
  let isPicked = false;
  const orderReceived = useCallback(
    async (item: any, pinParam: any) => {
      const receiver_id = pinParam ? pinParam : pin;
      if (!scanned || !isPicked) {
        try {
          const id = isSubMerchantRole
            ? userData?.userDetail?.parent_id
            : userData?.userDetail?.id;
          const response = await axiosInstance.get<any>(
            `is-user-checkedin?user_id=${receiver_id}&merchant_id=${id}`,
          );
          if (!response.data.isAllow) {
            setPickUp(false);
            Toast.show({
              title: 'User is not checked in you cannot receive order',
            });
            setLoading(false);
          } else {
            isPicked = true;
            const order = {
              updatedAt: item?.updatedAt,
              total_time_in_minutes: item?.total_time_in_minutes,
            };
            const data = {
              user_id: item?.user_id,
              merchant_id: item?.Merchant.id,
              merchant_name: item?.Merchant.company_name,
              receiver_id: receiver_id,
              order_id: item?.order_number
                ? item?.id
                : item?.TransferRedeemItems[0]?.order_id ||
                  item?.OrderItems[0]?.order_id ||
                  0,
              collected_color: item?.collected_color,
              totalOrderTime: getTimeRemaining(order),
              status: 'closed',
            };
            await dispatch(acceptOrderAction(data));
            setPickUp(false);
            dispatch(activeOrders(userData?.userDetail));
            setTimeout(() => {
              setScanned(false);
              setLoading(false);
            }, 3000);
          }
        } catch (error) {
          setPickUp(false);
          setScanned(false);
          setLoading(false);

          return;
        }
      }
    },
    [scanned, dispatch],
  );

  const handlePinEntered = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('users/get-user-detail', {
        username: pin,
        user_type_id: 5,
      });
      const response = res.data;
      if (response?.users) {
        await orderReceived(pickedUpOrder, response?.users?.id);
        setLoading(false);
      } else {
        Toast.show({
          title: 'User not found with this username',
        });
        setLoading(false);
        setPickUp(false);
      }
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      setPickUp(false);
      Toast.show({
        title: 'Something went wrong',
      });
    }
  }, [pin]);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animate, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const getTimeRemaining = (order: any) => {
    const now: any = new Date();
    const startTime = new Date(order.updatedAt);
    const totalTime = order.total_time_in_minutes * 60 * 1000; // convert to milliseconds
    const endTime: any = new Date(startTime.getTime() + totalTime);
    const timeRemaining = endTime - now;

    return timeRemaining;
  };
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      // @ts-ignore
      // setHasPermission(status === PermissionStatus.GRANTED);
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = useCallback(
    async ({ type, data }) => {
      // if (scanned) return;
      const decodedString = base64.decode(data);
      const decodedObject = JSON.parse(decodedString);

      setPin(decodedString.userId);
      if (!scanned) {
        setScanned(true);
        await orderReceived(pickedUpOrder, decodedObject.userId);
      }
    },
    [scanned, orderReceived],
  );

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  console.log(scanned, 'scanned');
  

  return (
    <Modal
      visible={pickUp}
      onRequestClose={() => setPickUp(false)}
      style={{ margin: 0 }}
      animationType="slide">
      <View style={styles.container}>
        <Header
          title={'Scan User QR or Enter Username'}
          onPress={() => {
            setPickUp(false);
          }}
          titleStyle={{ textTransform: 'none' }}
        />
        <View style={[Styles.flex]}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={PERSIST_TAPS.HANDLED}
            contentContainerStyle={[Styles.w100, Styles.flexGrow]}>
            <View style={[styles.innerContainer]}>
              <View style={[Styles.flex]}>
                <View style={[styles.scannerContainer]}>
                  <View style={styles.scanner}>
                    {/* <BarCodeScanner
                      onBarCodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                      }
                      style={StyleSheet.absoluteFillObject}
                    /> */}
                    <CameraView
                      style={StyleSheet.absoluteFillObject}
                      onBarcodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                      }
                      barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                      }}
                    />

                    <Corner
                      animatedStyle={[
                        styles.topLeftCorner,
                        {
                          width: animationSize,
                          height: animationSize,
                          borderColor: animationColor,
                        },
                      ]}
                    />
                    <Corner
                      animatedStyle={[
                        styles.topRightCorner,
                        {
                          width: animationSize,
                          height: animationSize,
                          borderColor: animationColor,
                        },
                      ]}
                    />
                    <Corner
                      animatedStyle={[
                        styles.bottomLeftCorner,
                        {
                          width: animationSize,
                          height: animationSize,
                          borderColor: animationColor,
                        },
                      ]}
                    />
                    <Corner
                      animatedStyle={[
                        styles.bottomRightCorner,
                        {
                          width: animationSize,
                          height: animationSize,
                          borderColor: animationColor,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.pinContainer}>
                  <TextInput
                    style={styles.pinInput}
                    onChangeText={setPin}
                    value={pin}
                    placeholder="Enter username"
                    placeholderTextColor={COLORS.gray}
                    cursorColor={COLORS.blue}
                    onSubmitEditing={handlePinEntered}
                    blurOnSubmit={false}
                    maxLength={200}
                  />
                  {pin && pin.length > 0 && (
                    <Button
                      title="Submit"
                      containerStyle={[Styles.w100]}
                      textStyle={[
                        Styles.textTransformCap,
                        { color: COLORS.white },
                      ]}
                      onPress={handlePinEntered}
                      isLoading={loading}
                      disabled={loading}
                    />
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={() => setScanned(!scanned)}>
                <Text style={styles.buttonText}>Tap to scan again</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
  },

  scannerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: COLORS.white,
  },
  scanner: {
    height: scaleSize(300),
    width: scaleSize(300),
    borderColor: COLORS.white,
    marginTop: scaleSize(10),
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopWidth: scaleSize(5),
    borderLeftWidth: scaleSize(5),
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopWidth: scaleSize(5),
    borderRightWidth: scaleSize(5),
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderBottomWidth: scaleSize(5),
    borderLeftWidth: scaleSize(5),
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderBottomWidth: scaleSize(5),
    borderRightWidth: scaleSize(5),
  },
  button: {
    justifyContent: 'center',
    height: scaleSize(70),
    backgroundColor: COLORS.green,

    width: '100%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: MOBILE.textSize.mLarge,
    color: COLORS.white,
    lineHeight: MOBILE.textSize.mLarge,
  },

  pinContainer: {
    width: '80%',
    marginVertical: scaleSize(20),
    alignSelf: 'center',
    flex: 1,
  },
  pinInput: {
    height: scaleSize(40),
    borderRadius: scaleSize(5),
    borderColor: COLORS.lightGray,
    borderWidth: scaleSize(1),
    marginBottom: scaleSize(10),
    paddingHorizontal: scaleSize(10),
    color: COLORS.black,
    fontSize: MOBILE.textSize.common,
  },
});
