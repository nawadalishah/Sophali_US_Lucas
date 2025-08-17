import { SafeAreaView, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AndroidSafeArea, COLORS, FONTS, Text } from '../../../constants';
import { Button, Header, InputField } from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import * as yup from 'yup';
import { FormControl, Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import { applyMerchantWithdrawal } from '../../../redux/merchant/token/tokenActions';
import Styles from '../../../utils/styles';
import { MOBILE } from '../../../utils/orientation/index';
import PopUpModal from '../../../components/PopUpModal';
import { scaleSize } from '../../../utils/mixins';
import { useStyles } from './styles';
const schema = yup.object().shape({
  amount_cad: yup.string().required('Amount is required'),
  password: yup.string().required('Password is required'),
  email: yup
    .string()
    .required('Email is required')
    .email('Email should be valid'),
});

export default function WithdrawToken() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [form, setForm] = useState({
    email: '',
    password: '',
    amount_cad: '',
  });
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [show, setShow] = useState({
    open: false,
    amount: 0,
    sophaliFee: 0,
    afterWeek: false,
    withdrawal: 0,
  });
  const [buttonLoader, setButtonLoader] = useState(false);
  const [adminWithdrawFee, setAdminWithdrawFee] = useState(0);
  const [withdrawalFees, setWithDrawalFees] = useState({
    feeWithinLimit: 0,
    feeBeforeLimit: 0,
  });

  const styles = useStyles();

  useEffect(() => {
    fetchAdminWithdrawalData();
  }, [route?.params]);

  const onClick = useCallback(() => {
    setButtonLoader(true);
    schema
      .validate(form)
      .then(async () => {
        try {
          const sophali_fee = (form?.amount_cad * adminWithdrawFee) / 100;
          const data = {
            merchant_id: userData?.userDetail.id,
            withdrawal_amount: +form.amount_cad,
            amount_cad: +form.amount_cad + +sophali_fee,
            sophali_fee,
            // TODO: Fix the following when  subscription gets handled
            subscription_status: 'unpaid',
            email: form?.email,
            password: form?.password,
          };
          if (data?.amount_cad > route?.params?.balance) {
            setButtonLoader(false);

            Toast.show({
              title: 'Withdrawal amount should be less than the balance',
            });
            return;
          }
          dispatch(applyMerchantWithdrawal(data)).then(res => {
            if (res?.payload?.code == 200) {
              setButtonLoader(false);
              onClose();
              setForm({
                email: '',
                password: '',
                amount_cad: '',
              });
              navigation.navigate('WithDrawSuccess');
            } else {
              setButtonLoader(false);
              onClose();
              setForm({
                email: '',
                password: '',
                amount_cad: '',
              });
            }
          });
        } catch (e: any) {
          setButtonLoader(false);
          onClose();
          setForm({
            email: '',
            password: '',
            amount_cad: '',
          });
          Toast.show({
            title: e?.response?.data?.message || 'Something went wrong',
          });
        }
      })
      .catch((err: yup.ValidationError) => {
        if (!err.path) return;
        setButtonLoader(false);
        onClose();
        setForm({
          email: '',
          password: '',
          amount_cad: '',
        });
        setErrors({ [err.path]: err.message });
      });
  }, [form, adminWithdrawFee, dispatch, buttonLoader, route?.params]);

  const onClose = useCallback(() => {
    setShow({
      open: false,
      amount: 0,
      sophaliFee: 0,
      afterWeek: false,
      withdrawal: 0,
    });
  }, [show, form]);
  const fetchAdminWithdrawalData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<any>('setting/admin/1');
      console.log(
        '2222222',
        route?.params?.isLastWithdrawalThisWeek,
        response?.data?.settings?.withdrawal_fee,
      );
      setWithDrawalFees({
        feeBeforeLimit:
          response?.data?.settings?.withdrawal_fee_before_limit || 2,
        feeWithinLimit: response?.data?.settings?.withdrawal_fee || 1,
      });
      if (route?.params?.isLastWithdrawalThisWeek) {
        setAdminWithdrawFee(
          response?.data?.settings?.withdrawal_fee_before_limit || 2,
        );
      } else {
        setAdminWithdrawFee(response?.data?.settings?.withdrawal_fee || 1);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const showModel = useCallback(() => {
    schema
      .validate(form)
      .then(async () => {
        try {
          const sophali_fee = (form.amount_cad * adminWithdrawFee) / 100;
          setShow({
            open: true,
            sophaliFee: sophali_fee,
            withdrawal: form.amount_cad,
            amount: +form.amount_cad + +sophali_fee,
            afterWeek: !!route?.params?.isLastWithdrawalThisWeek,
          });
        } catch (e: any) {
          Toast.show({
            title: e?.response?.data?.message || 'Something went wrong',
          });
        }
      })
      .catch((err: yup.ValidationError) => {
        if (!err.path) return;
        setErrors({ [err.path]: err.message });
      });
  }, [form, adminWithdrawFee, show, route?.params]);

  useEffect(() => {
    setErrors({});
  }, [form]);

  function renderHeader() {
    return <Header title="Withdrawal" onPress={() => navigation.goBack()} />;
  }
  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={[Styles.flex, Styles.w100]}>
          <FormControl mb={30} isInvalid={!!errors.email}>
            <InputField
              title="Email"
              placeholder="Email"
              titleColor={COLORS.black}
              placeholderTextColor={COLORS.gray}
              onchange={(v: string) => {
                setForm({ ...form, email: v });
              }}
            />
            <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl mb={30} isInvalid={!!errors.password}>
            <InputField
              title="Password"
              placeholder="********"
              titleColor={COLORS.black}
              placeholderTextColor={COLORS.gray}
              secureTextEntry={true}
              onchange={(v: string) => {
                setForm({ ...form, password: v });
              }}
            />
            <FormControl.ErrorMessage>
              {errors.password}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl mb={30} isInvalid={!!errors.amount_cad}>
            <InputField
              title="Amount"
              placeholder="$"
              keyboardType="numeric"
              titleColor={COLORS.black}
              placeholderTextColor={COLORS.gray}
              onchange={(v: number) => {
                setForm({ ...form, amount_cad: v });
              }}
            />
            <FormControl.ErrorMessage>
              {errors.amount_cad}
            </FormControl.ErrorMessage>
          </FormControl>

          <View style={[Styles.w100, Styles.flexDirectionColumn]}>
            <Text color={COLORS.redShade} size={MOBILE.textSize.normal}>
              Note:
            </Text>
            <Text color={COLORS.redShade} size={MOBILE.textSize.normal}>
              Withdrawal fees on Sophali are as follows:
            </Text>
            <View style={[Styles.mT10]}>
              <Text color={COLORS.redShade} size={MOBILE.textSize.normal}>
                Withdrawal after a week:{' '}
                {parseFloat(withdrawalFees?.feeWithinLimit || 0).toFixed(2)}%
                Sophali fee.
              </Text>
              <Text color={COLORS.redShade} size={MOBILE.textSize.normal}>
                Withdrawal within a week:{' '}
                {parseFloat(withdrawalFees?.feeBeforeLimit || 0).toFixed(2)}%
                Sophali fee.
              </Text>
            </View>
          </View>
        </View>
        <Button
          title="Amount Withdrawal"
          containerStyle={{ ...Styles.mV15, backgroundColor: COLORS.skyBlue }}
          textStyle={[Styles.textTransformCap]}
          onPress={showModel}
        />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
      <PopUpModal open={show?.open} onClose={onClose}>
        <View style={[styles.modalContainer]}>
          <View style={[Styles.w100, Styles.justifyContentCenter, Styles.pV10]}>
            <Text
              style={[
                { ...FONTS.H4, fontSize: MOBILE.textSize.xLarge },
                Styles.textCenter,
              ]}>
              Withdrawal Summary
            </Text>
          </View>
          <View style={[styles.textContainer]}>
            <Text style={[styles.labelText]} lines={1}>
              Amount
            </Text>
            <Text style={[styles.valueText]}>
              ${parseFloat(show?.withdrawal || 0).toFixed(2)}
            </Text>
          </View>

          <View style={[styles.textContainer]}>
            <Text style={[styles.labelText]} lines={1}>
              Sophali Fee
            </Text>
            <Text style={[styles.valueText]}>
              ${parseFloat(show?.sophaliFee || 0).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.textContainer]}>
            <Text style={[styles.labelText]} lines={1}>
              Total
            </Text>
            <Text style={[styles.valueText]}>
              ${parseFloat(show?.amount || 0).toFixed(2)}
            </Text>
          </View>
          <View style={[Styles.w100, Styles.pV5]}>
            {!show?.afterWeek ? (
              <Text color={COLORS.redShade} size={MOBILE.textSize.normal}>
                Withdrawal after a week:{' '}
                {parseFloat(withdrawalFees?.feeWithinLimit || 0).toFixed(2)}%
                Sophali fee.
              </Text>
            ) : (
              <Text color={COLORS.redShade} size={MOBILE.textSize.normal}>
                Withdrawal within a week:{' '}
                {parseFloat(withdrawalFees?.feeBeforeLimit || 0).toFixed(2)}%
                Sophali fee.
              </Text>
            )}
          </View>

          <View style={[styles.buttonContainer]}>
            <Button
              title="Cancel"
              containerStyle={{
                backgroundColor: COLORS.carrot,
                ...Styles.w40,
                height: scaleSize(40),
              }}
              textStyle={[Styles.textTransformCap]}
              onPress={onClose}
              disabled={buttonLoader}
            />

            <Button
              title="Withdrawal"
              containerStyle={{
                backgroundColor: COLORS.skyBlue,
                ...Styles.w40,
                height: scaleSize(40),
              }}
              textStyle={[Styles.textTransformCap]}
              onPress={onClick}
              isLoading={buttonLoader}
            />
          </View>
        </View>
      </PopUpModal>
    </SafeAreaView>
  );
}
