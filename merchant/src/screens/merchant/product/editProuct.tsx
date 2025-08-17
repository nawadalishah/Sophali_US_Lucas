import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AndroidSafeArea, COLORS, FONTS, SIZES } from '../../../constants';
import { ArrowTwo } from '../../../svg';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { categoryAction } from '../../../redux/merchant/category/categoryAction';
import { Checkbox, FormControl, Select, Toast } from 'native-base';
import { Button, InputField } from '../../../components';
import { productAction } from '../../../redux/merchant/product/productAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../../config/axios';
import { AppConfig } from '../../../config';
import * as FileSystem from 'expo-file-system';
import { HEADERS } from '../../../utils/helpers';
import { deviceWidth } from '../../../utils/orientation';
export default function EditProduct() {
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [selectedProductSize, setSelectedProductSize] = useState<any>();
  const [selectedTimeType, setSelectedTimeType] = useState<any>(0);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const currentTodayDate = new Date().getTime();
  const [date, setDate] = useState(new Date(currentTodayDate));
  const [checkboxValue, setCheckboxValue] = useState('my-checkbox-value');
  const [SelectedCheckboxValue, setSelectedCheckboxValue] = useState(false);
  const [imageUUID, setImageUUID] = useState('');
  const userData = user;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [productId, setProductId] = useState<any>(null);
  const { categories } = useAppSelector(state => state.category);
  const [sizesAndPrices, setSizesAndPrices] = useState([]);
  const addSizeAndPrice = () => {
    setSizesAndPrices([...sizesAndPrices, { scale_name: '', price: '' }]);
  };
  const updateSizeAndPrice = (
    index: number,
    field: 'scale_name' | 'price',
    value: any,
  ) => {
    const updatedSizesAndPrices = [...sizesAndPrices];
    updatedSizesAndPrices[index][field] = value;
    setSizesAndPrices(updatedSizesAndPrices);
  };
  const dispatch = useAppDispatch();
  const showDatePicker = () => {
    showMode('date');
  };
  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };
  useEffect(() => {
    dispatch(categoryAction(userData?.userDetail));
  }, []);
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    discount: 0,
    stock: 0,
    cat_id: 0,
    added_by: 0,
    parent_id: 0,
    product_scale: [],
    size: 0,
    time: 0,
    time_type: '',
    is_transferable: false,
    transfer_expire_date: '',
    transfer_expire_days: 0,
    uuids: [],
    tax: 0,
  });
  const route = useRoute();
  const { product }: any = route.params;
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    setSelectedCategory(product.cat_id);
    const timeTypeId = timeType.find(x => {
      if (x.key == product.time_type) {
        return x.Value;
      }
    });
    setSelectedTimeType(timeTypeId?.id);
    const date = new Date(product.transfer_expire_date).getTime();
    setDate(new Date(date));
    setImage(
      `${AppConfig.BaseUrl}getFileById?uuid=${JSON.parse(product.uuids)}`,
    );
    const checked = product.is_transferable == 1 ? true : false;
    setIsChecked(checked);
    setSelectedCheckboxValue(checked);
    setImageUUID(JSON.parse(product.uuids) ? JSON.parse(product.uuids)[0] : '');
    setProductId(product.id);
    setSizesAndPrices(product.product_scale);

    setForm({
      title: product.title ? product.title : 0,
      description: product.description ? product.description : '',
      ingredients: product.ingredients ? product.ingredients : '',
      discount: product.discount ? product.discount.toString() : 0,
      stock: product.stock ? product.stock.toString() : 0,
      cat_id: product.cat_id ? product.cat_id : 0,
      added_by: product.added_by ? product.added_by : 0,
      parent_id: product.parent_id ? product.parent_id : 0,
      product_scale: product.product_scale,
      size: product.size ? product.size.toString() : 0,
      time: product.time ? product.time.toString() : 0,
      time_type: product.time_type ? product.time_type : 0,
      is_transferable: checked,
      transfer_expire_date: product.transfer_expire_date
        ? product.transfer_expire_date
        : '',
      transfer_expire_days: checked ? product?.transfer_expire_days : 0,
      uuids: product.uuids ? product.uuids : [],
      tax: product.tax ? product.tax.toString() : 0,
    });
  }, [product]);
  console.log(SelectedCheckboxValue);
  useEffect(() => {
    dispatch(productAction({ data: userData?.userDetail }));
  }, []);
  const handlePress = () => {
    console.log(SelectedCheckboxValue, 'SelectedCheckboxValue');
    setIsChecked(!isChecked);
    setSelectedCheckboxValue(!isChecked);
  };
  const handleOutsidePress = () => {
    console.log('called outside');
    if (isChecked) {
      setIsChecked(false);
    }
  };
  const timeType = [
    { key: 'minutes', Value: 'Minutes', id: 1 },
    { key: 'hours', Value: 'Hours', id: 2 },
  ];
  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    console.log(selectedDate.toString());
    setForm({ ...form, transfer_expire_date: selectedDate.toString() });
  };
  const [image, setImage] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      try {
        const res = await FileSystem.uploadAsync(
          `${AppConfig.BaseUrl}upload`,
          result.assets[0].uri,
          {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'Files',
          },
        );
        Toast.show({
          title: 'image upload successfully',
        });
        const { data: imageUpload } = JSON.parse(res.body);
        setImageUUID(imageUpload);
        return res.body;
      } catch (e: any) {
        console.log(JSON.stringify(e), e.message);
        Toast.show({
          title: e?.response?.data?.message || 'Unable to upload image',
        });
      }
    }
  };
  function setCategory(id: string) {
    setSelectedCategory(id);
  }
  function setTimeType(time: any) {
    setSelectedTimeType(time);
  }

  async function editProduct() {
    const timeTypeId = timeType.find(x => {
      if (x.id == selectedTimeType) {
        return x.Value;
      }
    });
    if (imageUUID && productId) {
      const product: any = {
        id: productId,
        cat_id: selectedCategory,
        description: form.description,
        ingredients: form.ingredients,
        discount: form.discount,
        is_transferable: form.is_transferable
          ? form.is_transferable
          : SelectedCheckboxValue,
        is_featured: 1,
        parent_id: userData?.userDetail.id,
        product_scale: sizesAndPrices,
        stock: form.stock,
        tax: form.tax,
        time: form.time,
        time_type: timeTypeId?.key,
        title: form.title,
        uuids: JSON.stringify([imageUUID]),
      };
      if (form.transfer_expire_date != '') {
        product.transfer_expire_date = form.transfer_expire_date;
      }
      try {
        const res = await axiosInstance.post<any>(
          'product/update',
          product,
          HEADERS,
        );
        Toast.show({
          title: 'Edit product successfully',
        });
        if (res.data) {
          console.log('res.data', res.data);
        }
        return res.data;
      } catch (e: any) {
        Toast.show({
          title: e?.response?.data?.message || 'Unable to edit product',
        });
      }
    } else {
      Toast.show({ title: 'please upload image first' });
    }
  }
  const removeSizeAndPrice = (index: number) => {
    const newSizesAndPrices = [...sizesAndPrices];
    newSizesAndPrices.splice(index, 1);
    setSizesAndPrices(newSizesAndPrices);
  };

  const sizePriceFields = sizesAndPrices.map((sp, index) => (
    <View
      key={index}
      style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <FormControl
        mb={7}
        isInvalid={!!errors[`scale_name${index}`]}
        style={{ flex: 1, marginRight: 10 }}>
        <InputField
          title="Size"
          placeholder=""
          onchange={(v: string) => updateSizeAndPrice(index, 'scale_name', v)}
        />
        <FormControl.ErrorMessage>
          {errors[`scale_name${index}`]}
        </FormControl.ErrorMessage>
      </FormControl>

      <FormControl
        mb={7}
        isInvalid={!!errors[`price${index}`]}
        style={{ flex: 1 }}>
        <InputField
          title="Price"
          placeholder=""
          onchange={(v: string) => updateSizeAndPrice(index, 'price', v)}
        />
        <FormControl.ErrorMessage>
          {errors[`price${index}`]}
        </FormControl.ErrorMessage>
      </FormControl>
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => removeSizeAndPrice(index)}
          style={{ alignSelf: 'center', marginLeft: 10 }}>
          <Text style={{ fontSize: 30, color: 'red' }}>x</Text>
        </TouchableOpacity>
      </View>
    </View>
  ));
  function renderContent() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 30,
        }}>
        <View style={{}}>
          <Text style={{ ...FONTS.H1 }}>Edit Product</Text>
          <TouchableOpacity style={{ position: 'absolute', left: 16, top: 34 }}>
            <ArrowTwo />
          </TouchableOpacity>
        </View>
        <FormControl mb={7} isReadOnly isRequired>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Select
              key="category"
              placeholder="Category Selection"
              selectedValue={selectedCategory}
              width={deviceWidth - 35}
              onValueChange={(itemValue: any) => setCategory(itemValue)}>
              {categories?.categories?.rows.map((item: any, index: any) => (
                <Select.Item key={index} label={item.title} value={item.id} />
              ))}
            </Select>
          </View>
        </FormControl>

        <FormControl mb={7} isInvalid={!!errors.email}>
          <InputField
            title="Title"
            placeholder=""
            value={form.title}
            onchange={(v: string) => {
              setForm({ ...form, title: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Description"
            placeholder=""
            value={form.description}
            onchange={(v: string) => {
              setForm({ ...form, description: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Ingredients"
            value={form.ingredients}
            placeholder="Enter comma separated ingredients"
            onchange={(v: string) => {
              setForm({ ...form, ingredients: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Stock"
            placeholder=""
            value={form.stock}
            onchange={(v: number) => {
              setForm({ ...form, stock: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>

        {!sizesAndPrices.length && (
          <FormControl mb={7} isInvalid={!!errors.password}>
            <InputField
              title="Price"
              placeholder=""
              onchange={(v: number) => {
                setForm({ ...form, price: v });
              }}
            />
            <FormControl.ErrorMessage>
              {errors.password}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
        <View style={{ marginBottom: 20 }}>
          {sizePriceFields}
          <Button
            color="#007BFF" // You can choose a color that fits your theme
            style={{
              marginTop: 10,
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#007BFF', // Same color as the text
            }}
            title="Add More Sizes"
            onPress={addSizeAndPrice}
          />
        </View>

        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Time to make"
            placeholder=""
            value={form.time}
            onchange={(v: number) => {
              setForm({ ...form, time: v });
            }}
            titleStyle={{ textTransform: 'none' }}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={7} isInvalid={!!errors.password}>
          <Select
            key="size"
            placeholder="Time Type Selection"
            selectedValue={selectedTimeType}
            minWidth={360}
            onValueChange={(itemValue: string) => setTimeType(itemValue)}>
            {timeType.map((item: any, index: any) => (
              <Select.Item key={index} label={item.Value} value={item.id} />
            ))}
          </Select>
        </FormControl>
        <FormControl mb={7} isInvalid={!!errors.password}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontWeight: 'normal',
                lineHeight: 16 * 1.2,
                color: COLORS.gray,
                fontSize: 14,
                marginRight: 30,
              }}>
              is Transferable
            </Text>

            <TouchableWithoutFeedback onPress={handleOutsidePress}>
              <TouchableOpacity onPress={handlePress}>
                <Checkbox
                  value={checkboxValue}
                  isChecked={SelectedCheckboxValue}
                  onChange={handlePress}
                  aria-label="My checkbox label"
                />
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          </View>
        </FormControl>
        {isChecked && Platform.OS === 'android' && (
          <View style={{ marginBottom: 7 }}>
            <TouchableOpacity onPress={showDatePicker}>
              <Text
                style={{
                  fontWeight: 'normal',
                  lineHeight: 16 * 1.2,
                  color: COLORS.gray,
                }}>
                Transfer Expire Date
                {moment(date).format('DD-MMM-YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {((isChecked && show) || Platform.OS !== 'android') && (
          <View>
            <Text style={{ marginTop: 10 }}>Transfer Expire Date </Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'date'}
              onChange={onChange}
            />
          </View>
        )}
        {isChecked && (
          <FormControl mt={7} mb={7} isInvalid={!!errors.password}>
            <InputField
              title="Number of days"
              placeholder=""
              vale={form.transfer_expire_days}
              onchange={(v: number) => {
                setForm({ ...form, transfer_expire_days: v });
              }}
            />
            <FormControl.ErrorMessage>
              {errors.password}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Discount"
            placeholder=""
            value={form.discount}
            onchange={(v: number) => {
              setForm({ ...form, discount: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Tax"
            value={form.tax}
            placeholder=""
            onchange={(v: number) => {
              setForm({ ...form, tax: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 20,
            width: 100,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.transparent,
              borderRadius: 50,
            }}
            onPress={pickImage}>
            <Text
              style={{
                lineHeight: 14 * 1.5,
                color: COLORS.black,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}>
              Select Image
            </Text>
          </TouchableOpacity>
        </View>
        {image && (
          <Image
            source={{
              uri: image
                ? image
                : `${AppConfig.BaseUrl}getFileById?uuid=${JSON.parse(
                    product?.uuids,
                  )}`,
            }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
              marginLeft: 4,
              marginBottom: 10,
            }}
          />
        )}
        <Button
          title="Add"
          containerStyle={{ marginBottom: 20 }}
          onPress={editProduct}
        />
      </KeyboardAwareScrollView>
    );
  }
  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderContent()}
    </SafeAreaView>
  );
}
