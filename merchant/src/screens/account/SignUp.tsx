import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { AndroidSafeArea, COLORS, Text } from '../../constants';
import { Button } from '../../components';
import { axiosInstance } from '../../config/axios';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import { useStyles } from './styles';
import { FONT_FAMILY, PERSIST_TAPS, WEIGHT } from '../../constants/theme';
import Styles from '../../utils/styles';
import { SIGN_UP_VALUES, handleSubmit, signUpValidationSchema } from './helper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  BankingInfo,
  PersonalInfo,
  RestaurantInfo,
  SignUpHeader,
} from './SignUpForm';
import { useStripe } from '@stripe/stripe-react-native';
import { isEmpty } from 'lodash';
import { Checkbox } from 'native-base';
import { MOBILE } from '../../utils/orientation';
import TermsAndConditions from './TermsAndConditions';

export default function SignUp() {
  const navigation = useNavigation();
  const [statesRecord, setStateRecords] = useState<any>([]);
  const [loadingState, setLoadingState] = useState<any>(false);
  const schema = signUpValidationSchema();
  const { createToken } = useStripe();
  const [form, setForm] = useState(SIGN_UP_VALUES);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [show, setShow] = useState(false);
  const [dobModalEnabled, setDobModalEnabled] = useState(false);
  const [openTermsAndConditions, setOpenTermsAndConditions] = useState(false);
  const [isTermsAndConditions, setIsTermsAndConditions] = useState(false);

  const styles = useStyles();

  useEffect(() => {
    setErrors({});
  }, [form]);

  useEffect(() => {
    setForm(SIGN_UP_VALUES);
    setIsTermsAndConditions(false);
  }, []);

  const showDatePicker = useCallback(() => {
    setShow(true);
    setDobModalEnabled(true);
  }, [show]);

  const handleTermsAndConditions = useCallback(
    (open = false) => {
      if (open) {
        setOpenTermsAndConditions(true);
      } else {
        setOpenTermsAndConditions(false);
      }
    },
    [openTermsAndConditions],
  );

  const onChange = useCallback(
    (selectedDate: any) => {
      setShow(false);
      setForm({ ...form, dob: moment(selectedDate).format('YYYY-MM-DD') });
    },
    [show, form],
  );
  const hideDatePicker = useCallback(() => {
    setShow(false);
  }, [show]);

  const setCountryAndGetStates = useCallback(
    async (id: string) => {
      if (id) {
        try {
          const res = await axiosInstance.get<any>(`get-states/${id}`);
          if (res.data) {
            setStateRecords(res.data);
          }
        } catch (error: any) {
          console.log(error);
        }
      }
    },
    [statesRecord],
  );

  const onClickSubmit = useCallback(async () => {
    await handleSubmit(
      schema,
      form,
      setLoadingState,
      setErrors,
      createToken,
      navigation,
      isTermsAndConditions,
      setForm,
      setIsTermsAndConditions,
    );
  }, [schema, form, loadingState, errors, navigation, isTermsAndConditions]);

  const pickImage = useCallback(async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result?.assets[0]?.uri) return;
    setForm({
      ...form,
      image: result.assets[0].uri,
      companyLogo: result.assets[0].uri,
    });
  }, [form]);

  const handleClearImage = useCallback(() => {
    setForm({ ...form, image: '', companyLogo: '' });
  }, [form]);

  const handleAccept = useCallback(() => {
    setIsTermsAndConditions(true);
    setOpenTermsAndConditions(false);
  }, [isTermsAndConditions, openTermsAndConditions]);

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      <SignUpHeader />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={PERSIST_TAPS.HANDLED}
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={[Styles.flex, Styles.w100, Styles.primaryBackground]}>
          <PersonalInfo
            form={form}
            setForm={setForm}
            errors={errors}
            showDatePicker={showDatePicker}
            dobModalEnabled={dobModalEnabled}
          />
          <RestaurantInfo
            form={form}
            setForm={setForm}
            errors={errors}
            pickImage={pickImage}
            setCountryAndGetStates={setCountryAndGetStates}
            clearImage={handleClearImage}
            statesRecord={statesRecord}
          />
          <BankingInfo form={form} setForm={setForm} errors={errors} />
          <View style={[Styles.w100, Styles.flexDirectionRow, Styles.mB30]}>
            <Checkbox
              onChange={() => {
                if (isTermsAndConditions) {
                  setIsTermsAndConditions(false);
                } else {
                  handleTermsAndConditions(true);
                }
              }}
              isChecked={isTermsAndConditions}
              colorScheme="green"
              value={isTermsAndConditions}
              aria-label="Terms & Conditions"
            />
            <View
              style={[
                Styles.w100,
                Styles.alignItemsCenter,
                Styles.flexDirectionRow,
              ]}>
              <Text
                size={MOBILE.textSize.normal}
                style={[Styles.mL5, { lineHeight: MOBILE.textSize.normal }]}
                weight={WEIGHT.w400}
                fontFamily={FONT_FAMILY.REGULAR}>
                I have accept and agreed
              </Text>
              <Text
                color={COLORS.blue}
                weight={WEIGHT.w700}
                fontFamily={FONT_FAMILY.SEMI_BOLD}
                size={MOBILE.textSize.normal}
                style={[Styles.mL5, { lineHeight: MOBILE.textSize.normal }]}
                onPress={() => {
                  handleTermsAndConditions(true);
                }}>
                Terms & Conditions
              </Text>
            </View>
          </View>
          {show && (
            <DateTimePickerModal
              isVisible={show}
              mode="date"
              date={new Date(form?.dob)}
              onConfirm={onChange}
              onCancel={hideDatePicker}
              maximumDate={new Date()}
            />
          )}
          {openTermsAndConditions && (
            <TermsAndConditions
              open={openTermsAndConditions}
              onClose={handleTermsAndConditions}
              handleAccept={handleAccept}
            />
          )}
        </View>
      </KeyboardAwareScrollView>

      <View style={[Styles.w100, Styles.pH20, Styles.pV10]}>
        <Button
          title="Sign Up"
          containerStyle={[Styles.w100]}
          textStyle={[
            styles.btnTextStyle,
            Styles.textTransformCap,
            { color: COLORS.white },
          ]}
          onPress={onClickSubmit}
          isLoading={loadingState}
          // disabled={loadingState || !isEmpty(errors)}
        />

        <View
          style={[
            Styles.w100,
            Styles.flexDirectionRow,
            Styles.mT10,
            Styles.alignItemsCenter,
          ]}>
          <Text style={[styles.valueStyle, { color: COLORS.gray }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SignIn' as never)}>
            <Text
              style={[styles.valueStyle, { color: COLORS.green }]}
              color={COLORS.carrot}
              weight={WEIGHT.w700}>
              Sign in.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
