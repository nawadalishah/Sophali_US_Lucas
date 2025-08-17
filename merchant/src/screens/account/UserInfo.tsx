import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AndroidSafeArea, COLORS, FONTS } from '../../constants';
import { Platform, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Button, Header, InputField } from '../../components';
import { CheckSvgch } from '../../svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch } from '../../redux/Store';
import { stepOne } from '../../redux/authentication/authReducer';
import * as yup from 'yup';
import { FormControl, View } from 'native-base';
import PhoneInput from 'react-native-phone-input';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  companyName: yup.string().required('Company name is required'),
  ContactPerson: yup
    .string()
    .required('Contact Person Name is required')
    .email(),
  //kufkufkhgtvk
  ContactNumber: yup.number().required('Contact number is required'),
});

const UserInfo = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date(1676419200));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    ContactPerson: '',
    ContactNumber: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onClick = () => {
    // console.log('form',form)
    // schema
    //     .validate(form)
    //     .then(() => {
    dispatch(stepOne(form));
    navigation.navigate('UserAddress' as never);
    // })
    // .catch((err: yup.ValidationError) => {
    //     if (!err.path) return;
    //     setErrors({[err.path]: err.message});
    // });
  };

  useEffect(() => {
    setErrors({});
  }, [form]);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    console.log(selectedDate.toString());
    // setForm({...form, dateOfBirth: selectedDate.toString()})
  };

  const showMode = (currentMode: any) => {
    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  function renderHeader() {
    return (
      <Header
        title="Step 2"
        goBack={true}
        onPress={() => navigation.goBack()}
      />
    );
  }

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        <Text
          style={{
            marginBottom: 54,
            ...FONTS.H1,
            color: COLORS.black,
          }}>
          Personal info
        </Text>
        <FormControl mb={30} isInvalid={!!errors.firstName}>
          <InputField
            title="First name"
            placeholder="Darlene"
            icon={<CheckSvgch />}
            onchange={(v: string) => {
              setForm({ ...form, firstName: v });
            }}
          />
          <FormControl.ErrorMessage>
            {errors.firstName}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={30} isInvalid={!!errors.lastName}>
          <InputField
            title="Last name"
            placeholder="Robertson"
            icon={<CheckSvgch />}
            onchange={(v: string) => {
              setForm({ ...form, lastName: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.lastName}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={30} isInvalid={!!errors.email}>
          <InputField
            title="Company Name"
            placeholder="Company Name"
            icon={<CheckSvgch />}
            onchange={(v: string) => {
              setForm({ ...form, companyName: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl mb={30} isInvalid={!!errors.screenName}>
          <InputField
            title="Contact Person Name"
            placeholder="Contact Person Name"
            icon={<CheckSvgch />}
            onchange={(v: string) => {
              setForm({ ...form, ContactPerson: v });
            }}
          />
          <FormControl.ErrorMessage>
            {errors.screenName}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl mb={30} isInvalid={!!errors.phone}>
          <View>
            <Text
              style={{
                ...FONTS.Lato_400Regular,
                fontSize: 12,
                textTransform: 'uppercase',
                marginBottom: 11,
                color: COLORS.gray,
              }}>
              phone number
            </Text>
            <PhoneInput
              style={{
                // @ts-ignore
                fontSize: 16,
                fontFamily: 'Lato-Regular',
                borderBottomWidth: 1,
                borderBottomColor: '#E2E2E2',
                paddingBottom: 10,
              }}
              placeholderTextColor={COLORS.black}
              initialCountry={'us'}
              onChangePhoneNumber={v => {
                setForm({ ...form, ContactNumber: parseInt(v) });
                console.log(v);
              }}
              // initialValue="0123456789"
            />
          </View>
          <FormControl.ErrorMessage>{errors.phone}</FormControl.ErrorMessage>
        </FormControl>
        <Button
          title="Next"
          containerStyle={{ marginBottom: 20 }}
          onPress={onClick}
        />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default UserInfo;
