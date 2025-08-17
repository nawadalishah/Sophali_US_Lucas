import { SafeAreaView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AndroidSafeArea } from '../../../constants';
import { useAppSelector } from '../../../redux/Store';
import { Header } from '../../../components';
import SubMerchantForm from './SubMerchantForm';
import {
  SUB_MERCHANT_VALUES,
  addSubMerchantHandler,
  fetchRolePermissions,
  subMerchantValidationSchema,
} from './helper';

export default function AddSubMerchant() {
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const [isMerchantSaving, setMerchantSaving] = useState<any>(false);
  const userData = user;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState(SUB_MERCHANT_VALUES);
  const [userRoles, setUserRoles] = useState<any>([]);

  const schema = subMerchantValidationSchema();

  useEffect(() => {
    fetchRolePermissions(setUserRoles);
  }, []);

  useEffect(() => {
    setErrors({});
  }, [form]);

  const togglePermission = useCallback(
    (permission: any) => {
      setForm((currentForm: any) => {
        const index = currentForm.permissions.findIndex(
          (p: any) => p.id === permission.id,
        );
        let newSelectedValues = [];
        if (index >= 0) {
          newSelectedValues = [
            ...currentForm.permissions.slice(0, index),
            ...currentForm.permissions.slice(index + 1),
          ];
        } else {
          newSelectedValues = [...currentForm.permissions, permission];
        }
        return {
          ...currentForm,
          permissions: newSelectedValues,
        };
      });
    },
    [form],
  );

  const onClickSubmit = useCallback(() => {
    addSubMerchantHandler(
      schema,
      form,
      userData?.userDetail,
      setMerchantSaving,
      setErrors,
      setForm,
      navigation,
    );
  }, [form, errors, navigation, userData, schema, isMerchantSaving]);
  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      <Header title={'Add Sub Merchant'} onPress={() => navigation.goBack()} />
      <SubMerchantForm
        form={form}
        errors={errors}
        onClickSubmit={onClickSubmit}
        setForm={setForm}
        isMerchantSaving={isMerchantSaving}
        userRoles={userRoles}
        togglePermission={togglePermission}
      />
    </SafeAreaView>
  );
}
