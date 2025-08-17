import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import { useAppDispatch, useAppSelector } from '../../../redux/Store';
import { COLORS, FONTS, SIZES } from '../../../constants';
import { AppConfig } from '../../../config';
import { ArrowSvg } from '../../../svg';

export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product }: any = route.params;
  const [productData, setProductData] = useState<any>();

  useEffect(() => {
    if (product && product.id) {
      setProductData(product);
    }
  }, [product]);

  function renderSlider() {
    return (
      <View
        style={{
          width: SIZES.width,
          flex: 1,
        }}>
        <Image
          source={{
            uri:
              productData && productData.uuids
                ? `${AppConfig.BaseUrl}getFileById?uuid=${JSON.parse(
                    productData.uuids,
                  )}`
                : 'https://via.placeholder.com/1125x660',
          }}
          style={{ width: '100%', height: '100%' }}
        />
        
      </View>
    );
  }

  function renderDishInfo() {
    return (
      <View style={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 30 }}>
        <Text
          style={{
            ...FONTS.H2,
            marginBottom: 10,
            textTransform: 'capitalize',
            color: COLORS.black,
          }}>
          Title: {(productData && productData.title) || ''}
        </Text>

        <Text
          style={{
            ...FONTS.Lato_400Regular,
            fontSize: 14,
            color: COLORS.gray,
            lineHeight: 14 * 1.5,
            marginBottom: 10,
          }}>
          Description: {(productData && productData.description) || 'N/A'}
        </Text>

        {productData?.ProductSize.length === 0 ? (
          <Text
            style={{
              ...FONTS.Lato_400Regular,
              fontSize: 14,
              color: COLORS.gray,
              textTransform: 'capitalize',
              marginBottom: 10,
            }}>
            Price: $
            {(productData && parseFloat(productData.price).toFixed(2)) || 'N/A'}
          </Text>
        ) : (
          <Text
            style={{
              ...FONTS.Lato_400Regular,
              fontSize: 14,
              color: COLORS.gray,
              textTransform: 'capitalize',
              marginBottom: 10,
            }}>
            Product Sizes:{' '}
            {(productData &&
              productData.ProductSize.map(
                (item: any) =>
                  `${item.scale_name} - $${parseFloat(item?.price || 0).toFixed(2)}`,
              ).join(', ')) ||
              'N/A'}
          </Text>
        )}
        <Text
          style={{
            ...FONTS.Lato_400Regular,
            fontSize: 14,
            color: COLORS.gray,
            textTransform: 'capitalize',
            marginBottom: 10,
          }}>
          Product Modifiers:{' '}
          {(productData &&
            productData.ProductModifier.map(
              (item: any) =>
                `${item.modifier_name} - $${parseFloat(item?.price || 0).toFixed(2)}`,
            ).join(', ')) ||
            'N/A'}
        </Text>

        <Text
          style={{
            ...FONTS.Lato_400Regular,
            fontSize: 14,
            color: COLORS.gray,
            textTransform: 'capitalize',
            marginBottom: 10,
          }}>
          Product Addons:{' '}
          {(productData &&
            productData.ProductAddons.map(
              (item: any) =>
                `Addon ID: ${item.Addon.title}- $${parseFloat(item?.price || 0).toFixed(2)}`,
            ).join(', ')) ||
            'N/A'}
        </Text>

        {/* <Text
          style={{
            ...FONTS.Lato_400Regular,
            fontSize: 14,
            color: COLORS.green,
            textTransform: 'capitalize',
            marginBottom: 10,
          }}>
          Status: {(productData && productData.status) || ''}
        </Text> */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 15,
          zIndex: 9999,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 24,
        }}
        onPress={() => navigation.goBack()}>
        <ArrowSvg />
      </TouchableOpacity>

      {renderSlider()}
      {renderDishInfo()}
    </View>
  );
}
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
