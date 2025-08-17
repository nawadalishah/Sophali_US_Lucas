import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, InputField } from '../components';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { CheckIcon, Radio, Select } from 'native-base';
import { COLORS } from '../constants';
import { useStyles } from './styles';
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Name Is  Required'),
  areaofInterest: Yup.string().required('Please Choose Any One'),
  email: Yup.string().email('Invalid email').required('Email Required'),
  gender: Yup.string().required('Choose your gender'),
});

const PracticeForm = () => {
  const [regsiterUser, setRegisterUser] = useState<any>([]);
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [service, setService] = useState<any>('');
  const navigation = useNavigation();
  const toggleModalHandler = () => {
    setToggleModal(!toggleModal);
  };

  const styles = useStyles();

  return (
    <View style={styles.container2}>
      {/* <View style={styles.OpenModalContainer}>
                <Text style={styles.OpenModalContainerText}>Show Register User</Text>
                <TouchableOpacity onPress={() => toggleModalHandler()}>
                    {!toggleModal ?
                        (<AntDesign name="down" size={20} color="grey" />) :
                        (<AntDesign name="up" size={20} color="grey" />)
                    }
                </TouchableOpacity>
            </View> */}
      <Formik
        initialValues={{
          email: '',
          name: '',
          gender: '',
          areaofInterest: '',
        }}
        onSubmit={(values, { resetForm }) => {
          const data = [...regsiterUser, values];
          console.log(values);
          setRegisterUser((pre: any) => [...pre, values]);
          console.log('ddddddd', service);
          //@ts-ignore
          navigation.navigate('ShowUserData' as never, { data });
          resetForm();
        }}
        validationSchema={SignupSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          touched,
        }) => (
          <View style={styles.signFormContainer}>
            <Text style={styles.formHeading}>Register User</Text>
            <InputField
              onchange={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              // style={styles.input}
              // placeholder='Enter email'
              title="Email"
            />
            {touched.email && errors.email ? (
              <Text style={{ color: COLORS.carrot }}>{errors.email}</Text>
            ) : null}
            <InputField
              onBlur={handleBlur('name')}
              value={values.name}
              // style={styles.input}
              // placeholder="Enter Password"
              title="name"
              onchange={handleChange('name')}
            />
            {touched.name && errors.name ? (
              <Text style={{ color: COLORS.carrot }}>{errors.name}</Text>
            ) : null}
            <Select
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Area Of Interest"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => {
                handleChange('areaofInterest')(itemValue);
              }}>
              <Select.Item label="UX Research" value="ux" />
              <Select.Item label="Web Development" value="web" />
              <Select.Item label="Cross Platform Development" value="cross" />
              <Select.Item label="UI Designing" value="ui" />
              <Select.Item label="Backend Development" value="backend" />
            </Select>
            {errors.areaofInterest ? (
              <Text style={{ color: COLORS.carrot }}>
                {errors.areaofInterest}
              </Text>
            ) : null}
            <Radio.Group
              value={values.gender}
              name="myRadioGroup"
              accessibilityLabel="Pick your favorite number"
              onChange={nextValue => handleChange('gender')(nextValue)}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Radio colorScheme={'green'} value="1" my={1}>
                  Male
                </Radio>
                <Radio colorScheme={'green'} value="2" my={1}>
                  Female
                </Radio>
              </View>
            </Radio.Group>
            {errors.gender ? (
              <Text style={{ color: COLORS.carrot }}>{errors.gender}</Text>
            ) : null}
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default PracticeForm;
