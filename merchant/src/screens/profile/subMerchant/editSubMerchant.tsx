import { SafeAreaView, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AndroidSafeArea } from '../../../constants';
import { useAppSelector } from '../../../redux/Store';
import SubMerchantForm from './SubMerchantForm';
import {
  SUB_MERCHANT_EDIT_VALUES,
  editSubMerchantHandler,
  fetchRolePermissions,
  setFormInitialValues,
  subMerchantValidationEditSchema,
} from './helper';
import { Header } from '../../../components';
import { Spinner } from 'native-base';
import Styles from '../../../utils/styles';
import { MOBILE } from '../../../utils/orientation';

export default function EditSubMerchant() {
  const route = useRoute();
  const navigation = useNavigation();
  const { subMerchant }: any = route.params;
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [isMerchantSaving, setMerchantSaving] = useState<any>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState(SUB_MERCHANT_EDIT_VALUES);
  const [isLoading, setLoading] = useState<any>(true);
  const [userRoles, setUserRoles] = useState<any>([]);

  const schema = subMerchantValidationEditSchema();

  useEffect(() => {
    setFormInitialValues(subMerchant, setForm, setLoading);
    fetchRolePermissions(setUserRoles);
  }, [subMerchant]);

  useEffect(() => {
    setErrors({});
  }, [form]);

  const togglePermission = useCallback(
    (permission: any) => {
      setForm((currentForm: any) => {
        const index = currentForm?.permissions?.findIndex(
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
    editSubMerchantHandler(
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
      <Header title={'Edit Sub Merchant'} onPress={() => navigation.goBack()} />
      {!isLoading ? (
        <SubMerchantForm
          form={form}
          errors={errors}
          onClickSubmit={onClickSubmit}
          setForm={setForm}
          isMerchantSaving={isMerchantSaving}
          isEdit
          userRoles={userRoles}
          togglePermission={togglePermission}
        />
      ) : (
        <View style={[Styles.Centered]}>
          <Spinner size={MOBILE.spinner.large} />
        </View>
      )}
    </SafeAreaView>
  );
}
