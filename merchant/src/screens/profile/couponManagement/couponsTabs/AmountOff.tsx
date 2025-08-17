import { TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormControl, Select, Toast } from 'native-base';
import { Button, InputField } from '../../../../components';
import moment from 'moment';
import { COLORS, Text } from '../../../../constants';
import { useAppDispatch, useAppSelector } from '../../../../redux/Store';
import * as yup from 'yup';
import { productAction } from '../../../../redux/merchant/product/productAction';
import { axiosInstance } from '../../../../config/axios';
import { getUserList } from '../../../../redux/User/userActions';
import { deviceWidth, MOBILE } from '../../../../utils/orientation';
import { useStyles } from './style';
import ProductTable from './ProductTable';
import Styles from '../../../../utils/styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  getFullDayStart,
  HEADERS,
  isSubMerchant,
} from '../../../../utils/helpers';
import { COUPON_HOURS } from '../../../account/helper';
import { FONT_FAMILY, WEIGHT } from '../../../../constants/theme';

const AmountOff = ({ tabs, navToList }: any) => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(state => state.product);
  const styles = useStyles();
  const couponTypes = [
    { id: '1', type: 'Specific Product', value: 'product' },
    { id: '2', type: 'On Cart', value: 'all' },
  ];
  const { user } = useAppSelector(state => state.auth);
  const userData = user;
  const [form, setForm] = useState<any>({});
  const [isCouponSaving, setIsCouponSaving] = useState<any>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedCouponType, setCouponTimeType] = useState<any>('');
  const [SelectedProduct, setSelectedProduct] = useState<any>([]);
  const currentTodayDate = new Date().getTime();
  const [date, setDate] = useState(new Date(currentTodayDate));
  const [startDate, setStartDate] = useState(new Date(currentTodayDate));
  const [startTime, setStartTime] = useState(new Date(currentTodayDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showExpireDatePicker, setShowExpireDatePicker] = useState(false);
  const [pricetotal, setPriceTotal] = useState<any>(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const isSubMerchantRole = isSubMerchant(userData?.role?.name);
  const merchantId = isSubMerchantRole
    ? userData?.userDetail?.parent_id
    : userData?.userDetail?.id;
  useEffect(() => {
    //Previous line of code
    // dispatch(productAction({ data: userData?.userDetail, isSubProduct: true }));

    dispatch(productAction({ data: userData?.userDetail }));
    dispatch(getUserList(userData?.userDetail));
  }, []);

  useEffect(() => {
    if (tabs) {
      setForm((preform: any) => ({
        ...preform,
        code: '',
        title: '',
        value: tabs === 'buyonegetone' ? 0 : 0,
        expires_at: new Date(currentTodayDate),
        start_date: new Date(currentTodayDate),
        start_time: new Date(currentTodayDate),
        validityHours: '',
        max_uses: '',
        min_order_amount: '',
        discountType:
          tabs === 'amount'
            ? 'amount'
            : tabs === '%age'
              ? '%age'
              : tabs === 'buyonegetone'
                ? 'bogof'
                : 'deals',
        type:
          tabs === 'buyonegetone' || tabs === 'deals' ? 'product' : 'product',
        product_ids: [],
        product_details: [],
      }));
    }
  }, [tabs]);

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    discountType: yup.string().required('Discount type is required'),
    expires_at: yup.string().required('Expires At is required'),
    start_date: yup.string().required('Start At is required'),
    start_time: yup.string().required('Start time is required'),
    max_uses: yup
      .number()
      .required('Max Uses is required')
      .min(1, 'Max Uses should be greater than 0'),
    min_order_amount: yup.string(),
    product_ids:
      selectedCouponType === 'all'
        ? yup.array()
        : yup.array().required('Products are required'),
    type: yup.string().required('Coupon type is required'),
    value:
      tabs === 'buyonegetone'
        ? yup.number()
        : yup
            .number()
            .required('Discount value is required')
            .min(1, 'Discount value should be greater than 0'),

    validityHours: yup.string().required('Hours is required'),
  });

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

  const addCoupon = () => {
    schema
      .validate(form)
      .then(async () => {
        setIsCouponSaving(true);
        try {
          const isValid = checkProducts(form?.product_details) || false;
          if (form?.discountType === 'deals' && !isValid) {
            Toast.show({
              title: 'Select at least two product',
            });
            setIsCouponSaving(false);
            return;
          }
          const data = {
            ...form,
            validityHours: form?.validityHours || 0,
            product_details: JSON.stringify(form?.product_details),
            merchant_id: user?.userDetail.id,
            expires_at: new Date(form?.expires_at).toISOString(),
            start_date: new Date(form?.start_date).toISOString(),
            start_time: ['24', 24, 'Full Day'].includes(form.validityHours)
              ? moment(getFullDayStart()).utc().valueOf()
              : new Date(form?.start_time).valueOf(),
            added_by: merchantId,
          };

          const res = await axiosInstance.post('coupon/add', data, HEADERS);
          if (res.data) {
            Toast.show({
              title: 'Coupon Added',
            });
            setTimeout(() => {
              setIsCouponSaving(false);
            }, 100);
            setSelectedProduct([]);
            setPriceTotal(0);
            setStartDate(new Date().toISOString());
            setDate(new Date().toISOString());
            setStartTime(new Date());
            setCouponTimeType('');
            setForm((preform: any) => ({
              ...preform,
              code: '',
              title: '',
              value: tabs === 'buyonegetone' ? 0 : 0,
              expires_at: '',
              start_date: '',
              validityHours: '',
              max_uses: 0,
              min_order_amount: 0,
              discountType:
                tabs === 'amount'
                  ? 'amount'
                  : tabs === '%age'
                    ? '%age'
                    : tabs === 'buyonegetone'
                      ? 'bogof'
                      : 'deals',
              type:
                tabs === 'buyonegetone' || tabs === 'deals'
                  ? 'product'
                  : 'product',
              product_ids: [],
              product_details: [],
            })); // navigation.navigate('CouponList' as never);
            setTimeout(() => {
              setIsCouponSaving(false);
              navToList();
            }, 300);
          }
        } catch (e: any) {
          setIsCouponSaving(false);
          // dispatch(setSignUpError())
          Toast.show({
            title: e?.response?.data?.message || 'Something went wrong',
          });
        }
      })
      .catch((err: yup.ValidationError) => {
        console.log(err);
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
      if (type.product) {
        const selectedProductIds = SelectedProduct.map(
          (i: any) => i?.product?.id,
        );
        const selectedSubProductIds = SelectedProduct.map(
          (i: any) => i?.scale?.id,
        );

        const isAlreadySelected =
          type.scale === null
            ? selectedProductIds.includes(type.product.id)
            : selectedSubProductIds.includes(type.scale.id);

        if (
          SelectedProduct.length >= 1 &&
          (tabs === 'amount' || tabs === '%age')
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
            discountType:
              tabs === 'amount'
                ? 'amount'
                : tabs === '%age'
                  ? '%age'
                  : tabs === 'buyonegetone'
                    ? 'bogof'
                    : 'deals',
          }));

          setSelectedProduct(updatedSelectedProductList);
          setPriceTotal(totalPrice);
        } else {
          Toast.show({ title: 'Already Selected' });
        }
      }
    },
    [SelectedProduct, pricetotal, form, tabs],
  );

  useEffect(() => {
    setErrors({});
  }, [form]);

  const checkProducts = productDetails => {
    const totalQuantity = productDetails.reduce(
      (sum, detail) => sum + detail.quantity,
      0,
    );
    const distinctProducts = new Set(
      productDetails.map(detail => detail.productId),
    ).size;
    return totalQuantity >= 2 || distinctProducts >= 2;
  };

  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 10,
        }}>
        <FormControl mb={30} isInvalid={!!errors.title}>
          <InputField
            key="title"
            title="title"
            // placeholder="code"
            onchange={(v: string) => {
              setForm({ ...form, title: v });
            }}
            value={form?.title}
          />
          <FormControl.ErrorMessage>{errors.title}</FormControl.ErrorMessage>
        </FormControl>

        {!(tabs === 'buyonegetone' || tabs === 'deals') && (
          <FormControl mb={30} isInvalid={!!errors.type} isReadOnly>
            <Select
              key="type"
              placeholder="Coupon Selection"
              selectedValue={selectedCouponType}
              width={deviceWidth - 35}
              onValueChange={(itemValue: string) => setCouponType(itemValue)}>
              {couponTypes.map((item: any, index: any) => (
                <Select.Item key={index} label={item.type} value={item.value} />
              ))}
            </Select>
            <FormControl.ErrorMessage>{errors.type}</FormControl.ErrorMessage>
          </FormControl>
        )}

        {selectedCouponType !== 'all' && (
          <FormControl mb={30} isInvalid={!!errors.product_ids} isReadOnly>
            {!SelectedProduct[0]?.product?.id && (
              <Select
                key="product_ids"
                placeholder={'Product Selection'}
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
                            label={`${item.title} (${i?.scale_name || i?.scale?.scale_name})`}
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
              <Text style={[{ fontWeight: 'bold' }, Styles.pV5]}>
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

        {selectedCouponType !== 'all' && (
          <View style={styles.priceView}>
            <Text>Actual price: ${pricetotal.toFixed(2)}</Text>
          </View>
        )}

        {tabs !== 'buyonegetone' && (
          <FormControl mb={30} isInvalid={!!errors.value}>
            <InputField
              key="value"
              title={
                tabs === 'amount'
                  ? 'amount Off'
                  : tabs === '%age'
                    ? '%age'
                    : tabs === 'buyonegetone'
                      ? 'bogof'
                      : 'Deal Price'
              }
              placeholder=""
              onchange={(v: string) => {
                setForm({ ...form, value: v });
              }}
              keyboardType="numeric"
              value={form?.value}
            />
            <FormControl.ErrorMessage>{errors.value}</FormControl.ErrorMessage>
          </FormControl>
        )}

        {selectedCouponType !== 'all' && tabs !== 'bogof' && (
          <View style={styles.priceView}>
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

        {/* {!(tabs === 'buyonegetone' || tabs === 'deals') && ( */}
        <FormControl mb={30} isInvalid={!!errors.min_order_amount}>
          <InputField
            key="min_order_amount"
            title="Minimum Order Amount"
            placeholder=""
            onchange={(v: string) => {
              setForm({ ...form, min_order_amount: v });
            }}
            keyboardType="numeric"
            value={form?.min_order_amount}
          />
          <FormControl.ErrorMessage>
            {errors.min_order_amount}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl mb={30} isInvalid={!!errors.max_uses}>
          <InputField
            key="max_uses"
            title="Maximum Uses"
            placeholder=""
            onchange={(v: string) => {
              setForm({ ...form, max_uses: v });
            }}
            keyboardType="numeric"
            value={form?.max_uses}
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
            placeholder={'Select'}
            selectedValue={form?.validityHours}
            width={deviceWidth - 35}
            onValueChange={(itemValue: string) =>
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
                  label={`${item.hour}`}
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
            onPress={showDateTimePicker}>
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

        <>
          <Button
            title={isCouponSaving ? '' : 'Add'}
            isLoading={isCouponSaving}
            style={{ marginBottom: 20 }}
            onPress={addCoupon}
            disabled={isCouponSaving}
          />
        </>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <View style={[Styles.flex, Styles.w100, Styles.pT25]}>
      {renderContent()}
    </View>
  );
};

export default AmountOff;
