import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AndroidSafeArea, COLORS, FONTS } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { categoryAction } from '../../../redux/merchant/category/categoryAction';
import { getAddOnsActions } from '../../../redux/merchant/addOns/addOnsAction';
import {
  Checkbox,
  FormControl,
  Select,
  Toast,
  Radio,
  Spinner,
} from 'native-base';
import { Button, Header, InputField } from '../../../components';
import * as yup from 'yup';
import { productAction } from '../../../redux/merchant/product/productAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../../config/axios';
import * as FileSystem from 'expo-file-system';
import { AppConfig } from '../../../config';
import { currency } from '../../../constants/dummyData';
import { SquareClose } from '../../../utils/icons';
import { HEADERS, isSubMerchant } from '../../../utils/helpers';
import { deviceWidth } from '../../../utils/orientation';
import Loader from '../../../components/Loader';
import { margin } from '../../../utils/mixins';

export default function AddProduct() {
  const navigation = useNavigation();

  const route = useRoute();
  const { productId }: any = route.params || {};
  const { Title }: any = route.params || {};
  const [product, setProduct] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<any>([]);
  const [isAddonsModalVisible, setAddonsModalVisible] = useState(false);

  const [selectedTimeType, setSelectedTimeType] = useState<any>('');
  const [transferableShow, setTransferableShow] = useState(false);
  const transfertime = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const [form, setForm] = useState<any>({
    title: '',
    description: '',
    discount: '',
    stock: 0,
    cat_id: 0,
    added_by: 0,
    parent_id: 0,
    price: '',
    size: 0,
    time: '',
    time_type: '',
    is_transferable: false,
    transfer_expire_date: transfertime,
    transfer_expire_days: '30',
    uuids: [],
    tax: '',
    ProductModifier: [],
    ProductSize: [],
    ProductAddons: [],
  });
  // one year from today
  const [date, setDate] = useState(transfertime);
  const [type, setType] = useState('Product');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTransferable, setIsTransferable] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState('my-checkbox-value');
  const [imageUUID, setImageUUID] = useState('');
  const [sizesAndPrices, setSizesAndPrices] = useState<any>([]);
  const [modifiersAndPricesAndImages, setModifiersAndPricesAndImages] =
    useState<any>([]);
  const [modifiersImages, setModifiersImages] = useState<any>([]);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('Add');
  const [loadingState, setLoadingState] = useState<any>(false);
  const [imageUploadLoading, setImageUploadLoading] = useState<any>(false);

  // Redux
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const userData = user;

  const { products } = useAppSelector(state => state.product);

  const merchantProducts = products?.products;

  const { categories } = useAppSelector(state => state.category);
  const { addOnsList } = useAppSelector(state => state.addOns);

  const isSubMerchantRole = isSubMerchant(userData?.role?.name);
  const merchantId = isSubMerchantRole
    ? userData?.userDetail?.parent_id
    : userData?.userDetail?.id;

  // UseEffects
  useEffect(() => {
    dispatch(categoryAction(userData?.userDetail));
  }, [userData]);
  useEffect(() => {
    dispatch(productAction({ data: userData?.userDetail }));
  }, [userData]);
  useEffect(() => {
    dispatch(getAddOnsActions(userData?.userDetail));
  }, [userData]);
  useEffect(() => {
    if (productId && Title) {
      setLoadingState(true);
      getProduct();
    }
  }, [productId, Title]);

  // Functions
  const getProduct = async () => {
    setTitle('Edit');
    try {
      const product = await axiosInstance.get<any>(
        `product-by-id?product_id=${productId}`,
      );

      setProduct(product?.data?.products);
      setCheckboxValue(
        product?.data?.products.is_transferable ? 'false' : 'true',
      );
      setIsTransferable(product?.data?.products.is_transferable ? true : false);
      setSelectedCategory(product?.data?.products.cat_id);
      setSelectedProduct(product?.data?.products.parent_id);
      setSelectedTimeType(product?.data?.products.time_type);
      setType(product?.data?.products.parent_id ? 'Sub-Product' : 'Product');
      setForm({
        ...form,
        type: product?.data?.products.type,
        title: product?.data?.products.title,
        description: product?.data?.products.description,
        discount: product?.data?.products.discount
          ? '' + product?.data?.products.discount
          : '0',
        stock: product?.data?.products.stock,
        cat_id: product?.data?.products.cat_id,
        added_by: product?.data?.products.added_by,
        parent_id: product?.data?.products.parent_id,
        price: product?.data?.products.price,
        size: product?.data?.products.size,
        time: product?.data?.products.time,
        time_type: product?.data?.products.time_type,
        is_transferable: product?.data?.products.is_transferable,
        transfer_expire_date: product?.data?.products.transfer_expire_date,
        transfer_expire_days: product?.data?.products.transfer_expire_days,
        uuids: product?.data?.products.uuids,
        tax: product?.data?.products?.tax || '0',
        ProductModifier: product?.data?.products.ProductModifier,
        ProductSize: product?.data?.products.ProductSize,
        ProductAddons: product?.data?.products.ProductAddons,
      });
      setImage(
        `${AppConfig.BaseUrl}getFileById?uuid=${
          JSON.parse(product?.data?.products.uuids)[0]
        }`,
      );
      setDate(new Date(product?.data?.products?.transfer_expire_date));
      setImageUUID(JSON.parse(product?.data?.products.uuids)[0]);
      setSizesAndPrices(product?.data?.products.ProductSize);
      setModifiersAndPricesAndImages(product?.data?.products.ProductModifier);
      product?.data?.products.ProductModifier.map(
        (mp: any) =>
          mp.uuid &&
          setModifiersImages([
            ...modifiersImages,
            `${AppConfig.BaseUrl}getFileById?uuid=${mp.uuid}`,
          ]),
      );
      setSelectedAddons(product?.data?.products.ProductAddons);
      setTimeout(() => {
        setLoadingState(false);
      }, 10);
    } catch (error) {
      console.error(error);
      setLoadingState(false);
    }
  };
  const toggleAddon = (id: number) => {
    if (selectedAddons.some((addon: any) => addon.addons_id === id)) {
      setSelectedAddons(
        selectedAddons.filter((addon: any) => addon.addons_id !== id),
      );
    } else {
      setSelectedAddons([...selectedAddons, { addons_id: id }]);
    }
  };
  // Sizes Functions
  const addSizeAndPrice = () => {
    setSizesAndPrices([...sizesAndPrices, { scale_name: '', price: '' }]);
  };

  const checkMoreSizes = () => {
    if (
      sizesAndPrices.length < 0 ||
      sizesAndPrices.some(
        (size: any) => size.scale_name === '' || size.price === '',
      )
    ) {
      Toast.show({
        title: 'Please add size and price both',
      });
      return true;
    }
    return false;
  };
  const addModifierAndPriceAndImage = () => {
    setModifiersAndPricesAndImages([
      ...modifiersAndPricesAndImages,
      { modifier_name: '', price: '', uuid: '' },
    ]);
  };

  const checkAddMoreModifiers = () => {
    if (
      modifiersAndPricesAndImages.length < 0 ||
      modifiersAndPricesAndImages.some(
        (modifier: any) =>
          modifier.modifier_name === '' || modifier.price === '',
      )
    ) {
      Toast.show({
        title: 'Must add both modifier name and price',
      });
      return true;
    }
    return false;
  };
  const removeModifierAndPriceAndImage = (index: number) => {
    const newModifiersAndPricesAndImages = [...modifiersAndPricesAndImages];
    newModifiersAndPricesAndImages.splice(index, 1);
    setModifiersAndPricesAndImages(newModifiersAndPricesAndImages);
  };
  const removeSizeAndPrice = (index: number) => {
    const newSizesAndPrices = [...sizesAndPrices];
    newSizesAndPrices.splice(index, 1);
    setSizesAndPrices(newSizesAndPrices);
  };
  const updateModifierAndPriceAndImage = (
    index: number,
    field: 'modifier_name' | 'price' | 'uuid',
    value: string,
  ) => {
    const updatedModifiersAndPricesAndImages: any = [
      ...modifiersAndPricesAndImages,
    ];
    updatedModifiersAndPricesAndImages[index][field] = value;
    setModifiersAndPricesAndImages(updatedModifiersAndPricesAndImages);
  };

  const updateSizeAndPrice = (
    index: number,
    field: 'scale_name' | 'price',
    value: string,
  ) => {
    const updatedSizesAndPrices: any = [...sizesAndPrices];
    updatedSizesAndPrices[index][field] = value;
    setSizesAndPrices(updatedSizesAndPrices);
  };

  const onTransferExpireDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setTransferableShow(false);
    setDate(currentDate);
    setForm({ ...form, transfer_expire_date: selectedDate.toString() });
  };
  const pickModifierImage = async (index: number) => {
    // No permissions request is necessary for launching the image library
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.assets[0].uri) return;
    setModifiersImages([...modifiersImages, result.assets[0].uri]);
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
      updateModifierAndPriceAndImage(index, 'uuid', imageUpload);
      return res.body;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.assets[0].uri) return;

    setImage(result.assets[0].uri);
    try {
      setImageUploadLoading(true);
      const res = await FileSystem.uploadAsync(
        `${AppConfig.BaseUrl}upload`,
        result.assets[0].uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'Files',
        },
      );
      setImageUploadLoading(false);
      Toast.show({
        title: 'image upload successfully',
      });
      const { data: imageUpload } = JSON.parse(res.body);
      setImageUUID(imageUpload);
      return res.body;
    } catch (e: any) {
      setImageUploadLoading(false);
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  // API Functions
  async function addProduct() {
    // const aa = checkMoreSizes();
    // if (aa) return;
    // const bb = checkAddMoreModifiers();
    // if (bb) return;
    if (checkMoreSizes() || checkAddMoreModifiers()) return;
    if (!selectedCategory) {
      Toast.show({ title: 'Please select the category first' });
      return;
    }
    if (!form?.title || form.time <= 0) {
      Toast.show({ title: 'Please enter title or time' });
      return;
    }
    if (imageUUID) {
      const product: any = {
        merchant_id: userData?.userDetail.id,
        cat_id: selectedCategory,
        description: form.description,
        discount: form.discount,
        is_transferable: isTransferable,
        is_featured: 1,
        parent_id: selectedProduct,
        price: form.price,
        product_scale: sizesAndPrices,
        stock: 1000,
        tax: form.tax ? form.tax : null,
        time: form.time,
        time_type: 'minutes',
        title: form.title,
        uuids: JSON.stringify([imageUUID]),
        ProductModifier: modifiersAndPricesAndImages,
        ProductSize: sizesAndPrices,
        ProductAddons: selectedAddons,
        added_by: merchantId,
      };
      if (form.transfer_expire_date != '') {
        product.transfer_expire_date = form.transfer_expire_date;
      }
      if (form.transfer_expire_days != '') {
        product.transfer_expire_days = form.transfer_expire_days;
      }
      try {
        if (!productId) {
          const res = await axiosInstance.post<any>(
            'product/add',
            product,
            HEADERS,
          );
          Toast.show({
            title: 'Added product successfully',
          });
          if (res.data) {
            // goback

            navigation.goBack();
          }
        } else {
          const res = await axiosInstance.post<any>(
            'product/update',
            {
              ...product,
              id: productId,
            },
            HEADERS,
          );
          Toast.show({
            title: 'Updated product successfully',
          });
          if (res.data) {
            // goback

            navigation.goBack();
          }
        }
      } catch (e: any) {
        if (e?.response?.data?.message?.duplicateNames?.length > 0) {
          Toast.show({
            title: `Cannot add Duplicate size name: ${e?.response?.data?.message?.duplicateNames[0]}`,
          });
        } else {
          Toast.show({
            title: e?.response?.data?.message || 'Something went wrong',
          });
        }
      }
    } else {
      Toast.show({ title: 'Please upload image of the product' });
    }
  }

  // Render Functions
  const modifiersAndPricesAndImagesFields = modifiersAndPricesAndImages.map(
    (mp: any, index: any) => (
      <View
        key={index}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <FormControl mb={7} style={{ flex: 1, marginRight: 10 }}>
          <InputField
            title="Name"
            value={mp.modifier_name}
            placeholder="Pepperoni"
            placeholderColor={COLORS.lightGray}
            onchange={(v: string) =>
              updateModifierAndPriceAndImage(index, 'modifier_name', v)
            }
          />
        </FormControl>

        <FormControl mb={7} style={{ flex: 1 }} isRequired>
          <InputField
            title="Price"
            placeholder="0.0"
            value={'' + mp.price}
            onchange={(v: string) =>
              updateModifierAndPriceAndImage(index, 'price', v)
            }
            keyboardType="numeric"
            placeholderColor={COLORS.lightGray}
          />
        </FormControl>
        <FormControl mb={7} style={{ flex: 1 }}>
          {/* shouldnt it be an image picker or something */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.transparent,
                borderRadius: 50,
              }}
              onPress={() => {
                pickModifierImage(index);
              }}>
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
        </FormControl>

        {modifiersImages[index] && (
          <Image
            source={{ uri: modifiersImages[index] }}
            style={{ marginBottom: 10, width: 40, height: 40 }}
          />
        )}

        <View style={{ justifyContent: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => removeModifierAndPriceAndImage(index)}
            style={{ alignSelf: 'center', marginLeft: 10 }}>
            <SquareClose
              onPress={() => removeModifierAndPriceAndImage(index)}
            />
          </TouchableOpacity>
        </View>
      </View>
    ),
  );

  const sizePriceFields = sizesAndPrices.map((sp: any, index: any) => (
    <View
      key={index}
      style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <FormControl
        mb={7}
        isInvalid={!!errors[`scale_name${index}`]}
        style={{ flex: 1, marginRight: 10 }}>
        <InputField
          title="Size"
          value={sp.scale_name}
          placeholder="Small"
          placeholderColor={COLORS.lightGray}
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
          value={'' + sp.price}
          placeholder="0.0"
          onchange={(v: string) => updateSizeAndPrice(index, 'price', v)}
          keyboardType="numeric"
          placeholderColor={COLORS.lightGray}
        />
        <FormControl.ErrorMessage>
          {errors[`price${index}`]}
        </FormControl.ErrorMessage>
      </FormControl>
      <View style={{ justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={() => removeSizeAndPrice(index)}
          style={{ alignSelf: 'center', marginLeft: 10 }}>
          <SquareClose onPress={() => removeSizeAndPrice(index)} />
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
          marginTop: 15,
        }}>
        {/* <View style={{}}>
          <Text style={{ ...FONTS.H1 }}>{title} Product</Text>
          <TouchableOpacity
            style={{
              position: 'relative',
              left: 16,
              top: 34,
              backgroundColor: 'red',
            }}>
            <ArrowTwo />
          </TouchableOpacity>
        </View> */}

        <FormControl mb={7} isRequired isReadOnly>
          <Select
            width={deviceWidth - 35}
            key="category"
            placeholder="Category Selection"
            selectedValue={selectedCategory}
            onValueChange={(itemValue: any) => {
              setSelectedCategory(itemValue);
            }}>
            {categories?.categories?.rows.map((item: any, index: any) => (
              <Select.Item key={index} label={item.title} value={item.id} />
            ))}
          </Select>
        </FormControl>
        <Radio.Group
          name="productTypeGroup"
          accessibilityLabel="product type"
          value={type}
          onChange={nextValue => {
            setType(nextValue);
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }} // Aligning the entire group horizontally
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
            <Radio
              // @ts-ignore
              _radioColor="#007BFF"
              colorScheme="green"
              value="Product"
              accessibilityLabel="Product type"
            />
            <Text style={{ marginLeft: 10 }}>Product</Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
            <Radio
              // @ts-ignore
              _radioColor="#007BFF"
              colorScheme="green"
              value="Sub-Product"
              accessibilityLabel="Sub-product type"
            />
            <Text style={{ marginLeft: 10 }}>Sub-Product</Text>
          </View>
        </Radio.Group>
        {type == 'Sub-Product' && (
          <FormControl mt={6} mb={7} isReadOnly isInvalid={!!errors.password}>
            <Select
              width={deviceWidth - 35}
              key="products"
              placeholder="Product Selection"
              selectedValue={selectedProduct}
              onValueChange={(itemValue: any) => {
                setSelectedProduct(itemValue);
              }}>
              {merchantProducts?.map((item: any, index: any) => (
                <Select.Item key={index} label={item.title} value={item.id} />
              ))}
            </Select>
          </FormControl>
        )}
        <Button
          color="#28a745"
          style={{
            marginBottom: 5,
            padding: 0,
            marginTop: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#28a745',
          }}
          title="Extract data from product image"
          onPress={() => {
            // You can implement the extraction logic here or call a handler
            // if (typeof extractDataFromProductImage === 'function') {
            //   extractDataFromProductImage();
            // } else { 
            //   Toast && Toast.show
            //     ? Toast.show({ title: 'Extraction feature not implemented yet.' })
            //     : alert('Extraction feature not implemented yet.');
            // }
          }}
        />
        <FormControl
          style={{
            marginTop: type == 'Product' ? 30 : 0,
          }}
          mb={7}
          isInvalid={!!errors.email}>
          <InputField
            title="Title"
            value={form.title}
            placeholder="Pizza"
            placeholderColor={COLORS.lightGray}
            onchange={(v: string) => {
              setForm({ ...form, title: v });
            }}
          />
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Description"
            value={form.description}
            placeholder="Tasty pizza with fresh cheese and sauce!"
            placeholderColor={COLORS.lightGray}
            onchange={(v: string) => {
              setForm({ ...form, description: v });
            }}
            maxLength={250}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>

        {!sizesAndPrices.length && (
          <FormControl mb={7} isInvalid={!!errors.password}>
            <InputField
              title="Price"
              value={'' + form.price}
              placeholder="0.0"
              keyboardType="number-pad"
              onchange={(v: number) => {
                setForm({ ...form, price: v });
              }}
              placeholderColor={COLORS.lightGray}
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
            title="Time to make (mins)"
            value={'' + form.time}
            titleStyle={{ textTransform: 'none' }}
            placeholder="15"
            placeholderColor={COLORS.lightGray}
            maxLength={3}
            onchange={(v: number) => {
              setForm({ ...form, time: v, time_type: 'minutes' });
            }}
            keyboardType="numeric"
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        {/* <FormControl mb={7} isInvalid={!!errors.password} isReadOnly>
          <Select
            key="size"
            placeholder="Time Type Selection"
            selectedValue={selectedTimeType}
            width={deviceWidth - 35}
            onValueChange={(itemValue: string) => {
              setSelectedTimeType(itemValue);
            }}>
            <Select.Item key={1} label="Minutes" value="minutes" />
            <Select.Item key={2} label="Hours" value="hours" />
          </Select>
        </FormControl> */}
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
            <TouchableOpacity
              onPress={() => {
                setCheckboxValue(`${!checkboxValue}`);
                setIsTransferable(!isTransferable);
              }}>
              <Checkbox
                colorScheme="green"
                value={checkboxValue}
                isChecked={isTransferable}
                onChange={() => {
                  setCheckboxValue(`${!checkboxValue}`);
                  setIsTransferable(!isTransferable);
                }}
                aria-label="is Transferable"
              />
            </TouchableOpacity>
          </View>
        </FormControl>
        {isTransferable && Platform.OS === 'android' && (
          <View style={{ marginBottom: 7 }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.transparent,
                borderRadius: 5,
                width: '100%',
                borderWidth: 1,
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderColor: COLORS.lightGray,
              }}
              onPress={() => {
                setTransferableShow(true);
              }}>
              <Text
                style={{
                  fontWeight: 'normal',
                  lineHeight: 16 * 1.2,
                  color: COLORS.gray,
                }}>
                Transfer Expire Date {moment(date).format('DD-MMM-YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {((isTransferable && transferableShow) ||
          Platform.OS !== 'android') && (
          <View>
            <Text style={{ marginTop: 10 }}>Transfer Expire Date </Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'date'}
              minimumDate={new Date()}
              onChange={onTransferExpireDateChange}
            />
          </View>
        )}
        {/* {isTransferable && (
          <FormControl mt={7} mb={7} isInvalid={!!errors.password}>
            <InputField
              title='Number of days'
              value={'' + form.transfer_expire_days}
              placeholder=''
              onchange={(v: string) => {
                setForm({ ...form, transfer_expire_days: v });
              }}
            />
            <FormControl.ErrorMessage>
              {errors.password}
            </FormControl.ErrorMessage>
          </FormControl>
        )} */}
        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Discount"
            value={'' + form.discount}
            placeholder="0.0"
            onchange={(v: string) => {
              setForm({ ...form, discount: v });
            }}
            keyboardType="numeric"
            placeholderColor={COLORS.lightGray}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mb={7} isInvalid={!!errors.password}>
          <InputField
            title="Tax"
            value={'' + form.tax}
            placeholder="0.0"
            onchange={(v: number) => {
              setForm({ ...form, tax: v });
            }}
            keyboardType="numeric"
            placeholderColor={COLORS.lightGray}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        {!imageUploadLoading ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              // marginTop: 20,
              // width: 100,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.transparent,
                borderRadius: 5,
                width: '100%',
                borderWidth: 1,
                borderStyle: 'dashed',
                paddingVertical: 10,
                borderColor: COLORS.green,
              }}
              onPress={() => {
                pickImage();
              }}>
              <Text
                style={{
                  lineHeight: 14 * 1.5,
                  color: COLORS.black,
                  fontFamily: 'Lato-Regular',
                  fontSize: 14,
                  paddingLeft: 5,
                  alignSelf: 'center',
                }}>
                Select Image
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Loader />
        )}
        {image && (
          <Image
            source={{ uri: image }}
            style={{ marginBottom: 10, width: 200, height: 200 }}
          />
        )}
        <View style={{ marginBottom: 20 }}>
          {modifiersAndPricesAndImagesFields}
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
            title="Add More Modifiers"
            onPress={addModifierAndPriceAndImage}
          />
        </View>

        <Button
          containerStyle={{ marginBottom: 20 }}
          title="Select Addons"
          onPress={() => setAddonsModalVisible(true)}
          disabled={addOnsList?.addons?.rows.length === 0}
        />
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: 20,
            width: 100,
            flex: 1,
          }}
        > */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddonsModalVisible}
          onRequestClose={() => {
            setAddonsModalVisible(!isAddonsModalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={addOnsList?.addons?.rows}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleAddon(item.id)}>
                    <Text
                      style={[
                        styles.addonText,
                        {
                          color: selectedAddons.some(
                            (addon: any) => addon.addons_id === item.id,
                          )
                            ? 'blue'
                            : 'black',
                        },
                      ]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.buttonContainer}>
                <Button
                  title="Done"
                  onPress={() => setAddonsModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* </View> */}

        <Button
          title={title}
          containerStyle={{ marginBottom: 20 }}
          onPress={addProduct}
          disabled={imageUploadLoading}
        />
      </KeyboardAwareScrollView>
    );
  }
  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      <Header
        goBack={true}
        onPress={() => navigation.goBack()}
        title={`${title} Products`}
        titleStyle={{ textAlign: 'left', ...FONTS.H3 }}
      />
      {loadingState ? (
        <Spinner
          color={COLORS.green}
          size={50}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  addonText: {
    padding: 10,
  },
  buttonContainer: {
    // alignItems: 'flex-end',
  },
});
