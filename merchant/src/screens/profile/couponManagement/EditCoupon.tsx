import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AndroidSafeArea, COLORS, FONTS, Text } from '../../../constants';
import { Button, Header, InputField } from '../../../components';
import { CheckSvgch, CrossRedSvg, CrossSvg } from '../../../svg';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import * as yup from 'yup';
import { Checkbox, FormControl, Select, Toast } from 'native-base';
import { axiosInstance } from '../../../config/axios';
import moment from 'moment';
import { productAction } from '../../../redux/merchant/product/productAction';
import { deviceWidth, MOBILE } from '../../../utils/orientation';
import { getUserList } from '../../../redux/User/userActions';
import ProductTable from './couponsTabs/ProductTable';
import { sendCouponAction } from '../../../redux/merchant/coupon/couponActions';
import { isString } from 'lodash';
import Styles from '../../../utils/styles';
import {
  getFullDayStart,
  HEADERS,
  isSubMerchant,
} from '../../../utils/helpers';
import { useStyles } from './styles';
import { scaleSize } from '../../../utils/mixins';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { COUPON_HOURS } from '../../account/helper';
import { FONT_FAMILY, WEIGHT } from '../../../constants/theme';
export default function EditCoupon() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const { editForm }: any = route.params;
  const { products } = useAppSelector(state => state.product);
  const { UserList } = useAppSelector(state => state.userList);
  const userSubscriber = UserList?.userList;
  const [form, setForm] = useState<any>({
    code: '',
    discountType: 'amount',
    expires_at: '2023-04-12',
    id: 0,
    max_uses: '',
    min_order_amount: '',
    product_ids: [],
    status: '',
    type: 'all',
    updatedAt: '2023-04-05T12:53:09.000Z',
    value: '',
  });

  const discountTypes = [
    { id: '1', type: 'Amount', value: 'amount' },
    { id: '2', type: 'Percentage', value: '%age' },
    { id: '3', type: 'Buy One Get One Free', value: 'bogof' },
    { id: '4', type: 'Deals', value: 'deals' },
  ];
  const couponTypes = [
    { id: '1', type: 'Specific Product', value: 'product' },
    { id: '2', type: 'Cart', value: 'all' },
  ];

  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isCouponSaving, setIsCouponSaving] = useState<any>(false);
  const [selectedCouponType, setCouponTimeType] = useState<any>('');
  const [SelectedProduct, setSelectedProduct] = useState<any>([]);
  const [SelectedDiscount, setSelectedDiscount] = useState<any>('');
  const currentTodayDate = new Date().getTime();
  const todayDate = new Date();
  const [date, setDate] = useState(new Date(currentTodayDate));
  const [startDate, setStartDate] = useState(new Date(currentTodayDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showExpireDatePicker, setShowExpireDatePicker] = useState(false);
  const [subUser, setsubUser] = useState<any>([]);
  const [dealImage, setDealImage] = useState('');
  const [userError, setUserError] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startTime, setStartTime] = useState(new Date(currentTodayDate));
  const [sendtoAll, setsendtoAll] = useState<any>();
  const [pricetotal, setPriceTotal] = useState<any>(0);
  const styles = useStyles();
  const isSubMerchantRole = isSubMerchant(user?.role?.name);

  const schema = yup.object().shape({
    discountType: yup.string().required('Discount type is required'),
    expires_at: yup.string().required('Expires At is required'),
    max_uses: yup
      .number()
      .required('Max Uses is required')
      .min(1, 'Max Uses should be greater than 0'),
    min_order_amount:
      SelectedDiscount !== '1'
        ? yup.number()
        : yup.number().required('Minimum Order Amount is required'),
    product_ids:
      selectedCouponType === 'all'
        ? yup.array()
        : yup.array().required('Products are required'),
    type: yup.string().required('Coupon type is required'),
    value:
      SelectedDiscount !== '1'
        ? yup.string()
        : yup.string().required('Discount Value is required'),
    validityHours:
      SelectedDiscount == '4'
        ? yup.string().required('Validity Hours is required')
        : yup.string(),
    title: yup.string().required('Deal Title is required'),
  });
  useEffect(() => {
    //Previous line of code
    // dispatch(productAction({ data: userData?.userDetail, isSubProduct: true }));

    dispatch(productAction({ data: userData?.userDetail }));
    dispatch(getUserList(userData?.userDetail));
  }, []);

  useEffect(() => {
    if (!editForm) return;
    const expiredDate =
      new Date(editForm?.expires_at) < new Date()
        ? new Date(currentTodayDate)
        : new Date(editForm?.expires_at);
    const startDates =
      new Date(editForm?.start_date) < new Date()
        ? new Date(currentTodayDate)
        : new Date(editForm?.start_date);
    const data = {
      custom_code: editForm?.custom_code,
      discountType: editForm?.discountType,
      expires_at: expiredDate,
      start_date: startDates,
      id: editForm?.id,
      max_uses: String(editForm?.max_uses || 0),
      min_order_amount: String(editForm?.min_order_amount || 0),
      product_ids: editForm?.Products?.map((i: any) => i?.id),
      status: editForm?.status,
      type: editForm?.type,
      updatedAt: editForm?.updatedAt,
      value: editForm?.value || 0,
      product_details: editForm?.product_details,
      image: editForm?.image || '',
      title: editForm?.title,
      validityHours: String(editForm?.validityHours || 0),
      CouponUsers: editForm?.CouponUsers,
      start_time: moment(new Date()).utc().valueOf(),
    };
    setsubUser([...editForm?.CouponUsers]);
    setCouponType(editForm.type);
    if (editForm.product_ids && editForm.product_ids.length) {
      selectProduct(editForm.product_ids[0]);
    }
    setSelectedDiscount(
      editForm?.discountType === 'amount'
        ? '1'
        : editForm?.discountType === '%age'
          ? '2'
          : editForm?.discountType === 'bogof'
            ? '3'
            : '4',
    );

    setDate(expiredDate);
    setStartDate(startDate);

    setDealImage(editForm?.image);

    setStartTime(new Date());
    setForm(data);
    modifierFunction(editForm);
  }, [editForm]);
  
  const modifierFunction = (editForm: any) => {
    if (!editForm || !editForm.product_details) return [];
    const productDetailss = JSON.parse(editForm.product_details);
    const existingProducts: any[] = productDetailss?.map((item: any) => ({
      product: products?.products.find(
        (product: any) => product.id === item.productId,
      ),
      quantity: item.quantity,
      scale: item.scaleId
        ? products?.products
            .find((product: any) => product.id === item.productId)
            ?.ProductSize.find((size: any) => size.id === item.scaleId)
        : null,
    }));
    let totalPrice = 0;
    editForm?.productListing?.forEach(i => {
      if (!i.scalePrice) {
        totalPrice += parseFloat(i.price) * parseInt(i?.quantity);
      } else {
        totalPrice += parseFloat(i.scalePrice) * parseInt(i?.quantity);
      }
    });
    setPriceTotal(totalPrice);
    setSelectedProduct(existingProducts);
  };

  useEffect(() => {
    if (SelectedDiscount === '3') {
      setForm({ ...form, value: 0, min_order_amount: 0 });
    }
  }, [SelectedDiscount]);
  useEffect(() => {
    if (SelectedDiscount === '4') {
      setForm({ ...form, min_order_amount: 0 });
    }
  }, [SelectedDiscount]);

  const checkProducts = (productDetails: any) => {
    const productsList = isString(productDetails)
      ? JSON.parse(productDetails)
      : productDetails;
    const totalQuantity = productsList.reduce(
      (sum, detail) => sum + detail.quantity,
      0,
    );
    const distinctProducts = new Set(
      productsList.map(detail => detail.productId),
    ).size;
    return totalQuantity >= 2 || distinctProducts >= 2;
  };

  const onClick = () => {
    schema
      .validate(form)
      .then(async () => {
        try {
          const isValid = checkProducts(form?.product_details) || false;

          setIsCouponSaving(true);
          if (form?.discountType === 'deals' && !isValid) {
            setIsCouponSaving(false);
            Toast.show({
              title: 'Select at least two product',
            });
            return;
          } else if (
            form.type === 'product' &&
            form?.product_ids?.length === 0
          ) {
            setIsCouponSaving(false);
            Toast.show({
              title: 'Select at least one product',
            });
            return;
          } else if (!sendtoAll && subUser.length === 0) {
            setUserError('*Select user');
            setIsCouponSaving(false);
            Toast.show({
              title: 'Select at least one user',
            });
            return;
          }
          const id = isSubMerchantRole
            ? userData?.userDetail?.parent_id
            : userData?.userDetail?.id;
          const data = {
            ...form,
            product_details: isString(form?.product_details)
              ? form?.product_details
              : JSON.stringify(form?.product_details || []),
            merchant_id: id,
            max_uses: parseInt(form?.max_uses || 0),
            min_order_amount: parseInt(form?.min_order_amount || 0),
            validityHours: parseInt(form?.validityHours || 0),
            value: parseFloat(form?.value || 0),
            expires_at: new Date(form?.expires_at).toISOString(),
            start_date: new Date(form?.start_date).toISOString(),
            start_time: ['24', 24, 'Full Day'].includes(form.validityHours)
              ? moment(getFullDayStart()).utc().valueOf()
              : new Date(form?.start_time).valueOf(),
            added_by: id,
          };
          if (form.type === 'all') {
            data.product_details = JSON.stringify([]);
          }
          const res = await axiosInstance.post(
            'coupon/activateCoupon',
            data,
            HEADERS,
          );
          if (res.data) {
            if (res?.data?.id) {
              const payload = {
                users: sendtoAll
                  ? userSubscriber.map((i: any) => i?.User?.id)
                  : subUser.map((i: any) => i?.User.id),
                id: res?.data?.id,
                merchant_id: id,
              };
              if (subUser.length > 0 || sendtoAll) {
                await dispatch(sendCouponAction(payload));
              }
            }
            Toast.show({
              title: 'Coupon Activated Successfully',
            });
            navigation.navigate('CouponList' as never);
            setTimeout(() => {
              setIsCouponSaving(false);
            }, 100);
          }
        } catch (e: any) {
          // dispatch(setSignUpError())
          console.log('e', e);
          setIsCouponSaving(false);

          Toast.show({
            title: e?.response?.data?.message || 'Something went wrong',
          });
        }
      })
      .catch((err: yup.ValidationError) => {
        setIsCouponSaving(false);
        if (!err.path) return;
        setErrors({ [err.path]: err.message });
      });
  };

  function setCouponType(type: any) {
    setCouponTimeType(type);
    if (type === 'all') {
      delete form.product_ids;
    }
    setForm({ ...form, type });
  }

  const selectProduct = useCallback(
    (type: any) => {
      if (type?.product) {
        const selectedProductIds = SelectedProduct.map(
          (i: any) => i?.product?.id,
        );
        const selectedSubProductIds = SelectedProduct.map(
          (i: any) => i?.scale?.id,
        );

        const isAlreadySelected =
          type?.scale === null
            ? selectedProductIds.includes(type?.product.id)
            : selectedSubProductIds.includes(type.scale.id);

        if (
          SelectedProduct.length >= 1 &&
          (editForm?.discountType === 'amount' ||
            editForm?.discountType === '%age')
        ) {
          Toast.show({
            title: 'You can only select up to 1 product.',
          });
          return;
        }

        if (!isAlreadySelected) {
          const updatedSelectedProductList = [...SelectedProduct, type];
          let totalPrice = 0;
          updatedSelectedProductList.forEach(i => {
            if (!i.scale) {
              totalPrice += parseFloat(i.product.price) * i?.quantity;
            } else {
              totalPrice += parseFloat(i.scale.price) * i?.quantity;
            }
          });
          const ids = updatedSelectedProductList.map(
            (i: any) => i?.product?.id,
          );
          const filterIds = [...new Set(ids)];

          setForm((prevForm: any) => ({
            ...prevForm,
            product_ids: filterIds,
            product_details: updatedSelectedProductList.map((item: any) => ({
              productId: item?.product?.id,
              scaleId: item?.scale ? item?.scale?.id : '',
              quantity: item?.quantity,
            })),
          }));

          setSelectedProduct(updatedSelectedProductList);
          setPriceTotal(totalPrice);
        } else {
          Toast.show({ title: 'Already Selected' });
        }
      }
    },
    [SelectedProduct, pricetotal, form, editForm],
  );

  const selectUser = (item: any) => {
    setUserError('');

    const ids = subUser.map((i: any) => i.User.id);
    // setForm({ ...form, product_ids: [...ids, item?.user_id] });
    if (!ids.includes(item?.user_id)) {
      setsubUser((prev: any) => [...prev, item]);
    } else {
      Toast.show({ title: 'User Already Selected' });
    }
  };

  const handleDeleteUser = (id: any) => {
    const filterData = subUser.filter((i: any) => i?.user_id !== id);
    setsubUser(filterData);
  };

  const showDatePicker = () => {
    setShowStartDatePicker(true);
  };
  const showDateExpirePicker = () => {
    setShowExpireDatePicker(true);
  };

  const showDateTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
    setShowStartDatePicker(false);
    setShowExpireDatePicker(false);
  }, [showExpireDatePicker, isDatePickerVisible, showStartDatePicker]);

  const onChangeExpire = useCallback(
    (selectedDate: any) => {
      setShowExpireDatePicker(false);
      const currentDate = selectedDate;
      setDate(currentDate);
      setForm({ ...form, expires_at: currentDate.toString() });
    },
    [showExpireDatePicker, date],
  );

  const onChangeStart = useCallback(
    (selectedDate: any) => {
      setShowStartDatePicker(false);
      const currentDate = selectedDate;
      setStartDate(currentDate);
      setForm({ ...form, start_date: selectedDate.toString() });
    },
    [showStartDatePicker, startDate],
  );

  const handleConfirm = useCallback(
    (newDate: any) => {
      setDatePickerVisibility(false);
      setStartTime(newDate);

      const pickedTime = moment(newDate);
      const startTimeInUTC = pickedTime.utc();
      setForm({ ...form, start_time: startTimeInUTC.valueOf() });
    },
    [startTime, isDatePickerVisible],
  );

  useEffect(() => {
    setErrors({});
    setUserError('');
  }, [form]);

  function renderHeader() {
    return (
      <Header
        title={'Active Coupon'}
        titleStyle={{ ...FONTS.H3 }}
        onPress={() => navigation.goBack()}
      />
    );
  }

  function onSelectCouponType(itemValue: string) {
    if (itemValue === 'all') {
      setSelectedProduct([]);
    }
    setCouponType(itemValue);
  }

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[
          Styles.pV10,
          {
            flexGrow: 1,
            paddingHorizontal: scaleSize(15),
          },
        ]}>
        <FormControl mb={30}>
          <InputField
            key="code"
            title="Code"
            placeholder="code"
            value={form.custom_code}
            onchange={(v: string) => {
              setForm({ ...form, custom_code: v });
            }}
            editable={false}
          />
        </FormControl>
        <FormControl mb={30} isInvalid={!!errors.title}>
          <InputField
            key="title"
            title="Title"
            placeholder=""
            value={form.title}
            onchange={(v: string) => {
              setForm({ ...form, title: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.title}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={30} isInvalid={!!errors.type} isReadOnly>
          <Select
            key="type"
            placeholder="Coupon Selection"
            selectedValue={selectedCouponType}
            isDisabled={
              editForm?.discountType === 'deals' ||
              editForm?.discountType === 'bogof'
            }
            width={deviceWidth - 35}
            onValueChange={itemValue => onSelectCouponType(itemValue)}>
            {couponTypes.map((item: any, index: any) => (
              <Select.Item key={index} label={item.type} value={item.value} />
            ))}
          </Select>
          <FormControl.ErrorMessage>{errors.type}</FormControl.ErrorMessage>
        </FormControl>

        {selectedCouponType !== 'all' && (
          <FormControl mb={30} isInvalid={!!errors.product_ids} isReadOnly>
            {!SelectedProduct[0]?.product?.id && (
              <Select
                key="product_ids"
                placeholder="Product Selection"
                selectedValue={SelectedProduct}
                width={deviceWidth - 35}
                onValueChange={(itemValue: string) => selectProduct(itemValue)}>
                {products?.products &&
                  products?.products?.map((item: any, index: any) =>
                    item?.ProductSize?.length ? (
                      item?.ProductSize?.map((i: any) => {
                        const combinedValue = {
                          product: item,
                          scale: i,
                          quantity: 1,
                        };
                        return (
                          <Select.Item
                            key={index}
                            label={
                              item.title +
                              ' (' +
                              (i?.scale_name || i?.scale?.scale_name) +
                              ')'
                            }
                            value={combinedValue}
                          />
                        );
                      })
                    ) : (
                      <Select.Item
                        key={index}
                        label={item.title}
                        value={{ product: item, scale: null, quantity: 1 }}
                      />
                    ),
                  )}
              </Select>
            )}
            <FormControl.ErrorMessage>
              {errors.product_ids}
            </FormControl.ErrorMessage>
            {SelectedProduct?.length ? (
              <Text style={[{ fontWeight: 'bold' }, Styles.pT10]}>
                Selected Products
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                marginVertical: 2,
                flexWrap: 'wrap',
              }}>
              {SelectedProduct?.length ? (
                <ProductTable
                  SelectedProduct={SelectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  setForm={setForm}
                  setPriceTotal={setPriceTotal}
                  pricetotal={pricetotal}
                />
              ) : null}
            </View>
          </FormControl>
        )}

        <Checkbox
          mb={5}
          onChange={() => {
            setsendtoAll(!sendtoAll);
            setUserError('');
          }}
          isChecked={sendtoAll}
          colorScheme="green"
          value={sendtoAll}>
          Send To All
        </Checkbox>
        {!sendtoAll && (
          <FormControl mb={30} isReadOnly>
            <Select
              key="user_ids"
              placeholder="Send To "
              selectedValue={subUser}
              width={deviceWidth - 35}
              onValueChange={(itemValue: string) => selectUser(itemValue)}>
              {userSubscriber &&
                userSubscriber.map((item: any, index: any) => (
                  <Select.Item
                    key={index}
                    label={item?.User?.username || item?.User?.first_name}
                    value={item}
                  />
                ))}
            </Select>
            {subUser?.length ? (
              <Text style={[{ fontWeight: 'bold' }, Styles.pV10]}>
                Selected User
              </Text>
            ) : null}
            {userError?.length ? (
              <Text style={{ fontWeight: '400', color: 'red' }}>
                {userError}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                marginVertical: 2,
                flexWrap: 'wrap',
              }}>
              {subUser?.length
                ? subUser?.map((user: any) => (
                    <View
                      key={user?.user_id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text>
                        {user?.User?.username || user?.User?.first_name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteUser(user?.User?.id)}>
                        <CrossRedSvg />
                      </TouchableOpacity>
                    </View>
                  ))
                : null}
            </View>
          </FormControl>
        )}

        {/* {SelectedDiscount == 4 && (
          <FormControl mb={30} isInvalid={!!errors.validityHours}>
            <InputField
              key="validityHours"
              title="Time Hours"
              placeholder=""
              value={form.validityHours?.toString()}
              onchange={(v: string) => {
                setForm({ ...form, validityHours: v });
              }}
            />
            <FormControl.ErrorMessage>
              {errors.validityHours}
            </FormControl.ErrorMessage>
          </FormControl>
        )} */}
        {selectedCouponType !== 'all' && (
          <View
            style={{
              paddingVertical: 15,
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}>
            <Text>Actual price: ${pricetotal.toFixed(2)}</Text>
          </View>
        )}
        {!(SelectedDiscount == 3) && (
          <FormControl mb={30} isInvalid={!!errors.value}>
            <InputField
              key="value"
              title={
                SelectedDiscount == 2
                  ? '%age off'
                  : SelectedDiscount == 4
                    ? 'Deal Price'
                    : 'Discount off '
              }
              placeholder=""
              value={(form?.value || '').toString()}
              onchange={(v: string) => {
                setForm({ ...form, value: v });
              }}
            />
            <FormControl.ErrorMessage>{errors.value}</FormControl.ErrorMessage>
          </FormControl>
        )}
        {selectedCouponType !== 'all' && form?.discountType !== 'bogof' && (
          <View
            style={{
              paddingVertical: 15,
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}>
            <Text>
              Price template: $
              {form.discountType === 'amount'
                ? (
                    parseFloat(pricetotal) -
                    parseFloat(parseFloat(form?.value) > 0 ? form?.value : 0)
                  ).toFixed(2)
                : form.discountType === 'deals'
                  ? parseFloat(form?.value || 0).toFixed(2)
                  : (
                      parseFloat(pricetotal) -
                      (parseFloat(pricetotal) / 100) * form?.value
                    ).toFixed(2)}
            </Text>
          </View>
        )}

        {!(SelectedDiscount == 3 || SelectedDiscount == 4) && (
          <FormControl mb={30} isInvalid={!!errors.min_order_amount}>
            <InputField
              key="min_order_amount"
              title="Minimum Order Amount"
              placeholder=""
              value={form.min_order_amount}
              onchange={(v: string) => {
                setForm({ ...form, min_order_amount: v });
              }}
            />
            <FormControl.ErrorMessage>
              {errors.min_order_amount}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
        <FormControl mb={30} isInvalid={!!errors.max_uses}>
          <InputField
            key="max_uses"
            title="Max Uses"
            placeholder=""
            value={form.max_uses}
            onchange={(v: string) => {
              setForm({ ...form, max_uses: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.max_uses}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl mb={30} isInvalid={!!errors.validityHours} isReadOnly>
          <Text
            weight={WEIGHT.w600}
            size={MOBILE.textSize.normal}
            fontFamily={FONT_FAMILY.SEMI_BOLD}
            style={{ marginBottom: 10 }}>
            Coupon Validity (Hours)
          </Text>
          <Select
            key="validityHours"
            placeholder={
              form?.validityHours
                ? `${form?.validityHours === '24' ? 'Full Day' : form?.validityHours}`
                : 'Select'
            }
            placeholderTextColor={
              form?.validityHours ? COLORS.black : COLORS.gray
            }
            selectedValue={form?.validityHours}
            width={deviceWidth - 35}
            onValueChange={(itemValue: any) =>
              setForm({ ...form, validityHours: itemValue })
            }>
            {COUPON_HOURS?.map((item: any) => {
              return (
                <Select.Item
                  padding={2}
                  style={{
                    backgroundColor: COLORS.lightGray,
                    marginBottom: 1,
                  }}
                  key={item?._id}
                  label={item.hour}
                  value={item.value}
                />
              );
            })}
          </Select>
          <FormControl.ErrorMessage>
            {errors.validityHours}
          </FormControl.ErrorMessage>
        </FormControl>

        {!['24', 24, 'Full Day'].includes(form.validityHours) ? (
          <TouchableOpacity
            style={styles.dateTimeField}
            activeOpacity={0.7}
            onPress={() => showDateTimePicker()}>
            <Text style={styles.dateTimeText}>
              Start Time:
              {' ' + moment(startTime).format('hh:mm A')}
            </Text>
          </TouchableOpacity>
        ) : null}
        {!!errors.start_time && (
          <View>
            <Text style={{ color: COLORS.carrot }}>
              Start time Is required.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.dateTimeField}
          activeOpacity={0.7}
          onPress={() => showDatePicker('StartDate')}>
          <Text style={styles.dateTimeText}>
            From:
            {' ' + moment(startDate).format('DD-MMM-YYYY')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.dateTimeField}
          onPress={() => showDateExpirePicker('EndDate')}>
          <Text style={styles.dateTimeText}>
            Expiration Date:
            {' ' + moment(date).format('DD-MMM-YYYY')}
          </Text>
        </TouchableOpacity>

        {!!errors.expires_at && (
          <View>
            <Text style={{ color: COLORS.carrot }}>Expires At required.</Text>
          </View>
        )}

        {isDatePickerVisible && (
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="time"
            date={startTime}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />
        )}
        {showStartDatePicker && (
          <DateTimePickerModal
            isVisible={showStartDatePicker}
            mode="date"
            date={startDate}
            onConfirm={onChangeStart}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />
        )}
        {showExpireDatePicker && (
          <DateTimePickerModal
            isVisible={showExpireDatePicker}
            mode="date"
            date={date}
            onConfirm={onChangeExpire}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />
        )}

        <Button
          title={isCouponSaving ? '' : 'Active Coupon'}
          isLoading={isCouponSaving}
          containerStyle={{ marginBottom: 20 }}
          onPress={onClick}
          disabled={isCouponSaving}
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
}
