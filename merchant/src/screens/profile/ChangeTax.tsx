import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Styles from '../../utils/styles';
import { Button, InputField } from '../../components';
import { deviceWidth } from '../../utils/orientation';
import { useAppSelector } from '../../redux/Store';
import { axiosInstance } from '../../config/axios';
import { Toast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { HEADERS } from '../../utils/helpers';

const ChangeTax = ({
  openModal,
  setOpenModal,
  toggleModal,
  merchantSettings,
  setIsSavingLoading,
  settings,
  getSetting,
}: any) => {
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [taxRate, setTaxRate] = useState<any>();
  const updateTaxHanlder = async () => {
    const merchantId =
      merchantSettings?.settings?.merchant_id || userData?.userDetail.id;
    const payload = {
      id: settings?.id,
      merchant_id: merchantId,
      tax: taxRate,
    };
    try {
      const res = await axiosInstance.post<any>(
        'setting/update',
        payload,
        HEADERS,
      );
      if (res.data) {
        setIsSavingLoading(false);
        Toast.show({
          title: 'Update Tax Rate Successfully',
        });
        getSetting && getSetting();
      } else {
        setIsSavingLoading(false);
      }
    } catch (e: any) {
      setIsSavingLoading(false);
      Toast.show({
        title: e?.response?.data?.message || 'Cannot update settings',
      });
    }
    setOpenModal((prevOpenModal: any) => !prevOpenModal);
  };
  useEffect(() => {
    setTaxRate(merchantSettings?.settings?.tax || 0);
  }, [openModal, merchantSettings]);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={toggleModal}
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                top: 10,
                right: 10,
              }}>
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              Your Current Tax Rate is: {merchantSettings?.settings?.tax || '0'}
              %{' '}
            </Text>

            <InputField
              title="Enter Tax Rate"
              value={taxRate}
              onchange={(e: any) => {
                setTaxRate(e);
              }}
              keyboardType="numeric"
            />
            <Button
              containerStyle={[Styles.mV15]}
              title="Update Tax Rate"
              onPress={updateTaxHanlder}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangeTax;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    gap: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: deviceWidth - 40,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
