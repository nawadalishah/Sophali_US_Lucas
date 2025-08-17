import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useStyles } from './style';
import { FlatList } from 'react-native-gesture-handler';
import Styles from '../../../../utils/styles';

const ProductTable = ({
  SelectedProduct,
  setSelectedProduct,
  setForm,
  pricetotal,
  setPriceTotal,
}: any) => {
  const styles = useStyles();

  const listHeader = () => (
    <View style={styles.productheaderRow}>
      <Text style={{ ...styles.productheaderRowText, ...styles.rowWidth }}>
        Product Name
      </Text>
      <Text style={{ ...styles.productheaderRowText, ...styles.rowWidth }}>
        Scale
      </Text>
      <Text style={{ ...styles.productheaderRowText, ...styles.rowWidth }}>
        Price
      </Text>
      <Text style={{ ...styles.productheaderRowText, ...styles.rowWidth }}>
        Quantity
      </Text>
      <Text style={{ ...styles.productheaderRowText, ...styles.rowWidth }}>
        Action
      </Text>
    </View>
  );

  const productDeleteHandler = (item: any) => {
    const updatedSelectedProductList = SelectedProduct.filter((pro: any) =>
      item?.scale === null
        ? pro?.product?.id !== item?.product?.id
        : pro?.scale?.id !== item?.scale?.id,
    );
    const ids = updatedSelectedProductList.map((i: any) => i?.product?.id);
    const filterIds = [...new Set(ids)];

    if (SelectedProduct?.length) {
      item?.scale === null
        ? setPriceTotal(
            Number(pricetotal) - Number(item?.product?.price) * item?.quantity,
          )
        : setPriceTotal(
            Number(pricetotal) - Number(item?.scale?.price) * item?.quantity,
          );
    } else {
      setPriceTotal(0);
    }
    const produtDetailsIdss = updatedSelectedProductList.map((item: any) => ({
      productId: item?.product?.id,
      scaleId: item?.scale ? item?.scale?.id : '',
      quantity: item?.quantity,
    }));
    setForm((prevForm: any) => ({
      ...prevForm,
      product_ids: filterIds,
      product_details: produtDetailsIdss,
    }));

    setSelectedProduct(updatedSelectedProductList);
  };
  const IncrementCounter = (item: any) => {
    const updatedSelectedProductList = SelectedProduct.map((product: any) => {
      if (
        item?.scale === null
          ? product?.product?.id === item?.product?.id
          : product?.scale?.id === item?.scale?.id
      ) {
        return {
          ...product,
          quantity: product.quantity + 1,
        };
      }
      return product;
    });

    const ids = updatedSelectedProductList.map((i: any) => i?.product?.id);
    const filterIds = [...new Set(ids)];
    if (SelectedProduct?.length) {
      item?.scale === null
        ? setPriceTotal(Number(pricetotal) + Number(item?.product?.price))
        : setPriceTotal(Number(pricetotal) + Number(item?.scale?.price));
    } else {
      setPriceTotal(0);
    }
    const produtDetailsIdss = updatedSelectedProductList.map((item: any) => ({
      productId: item?.product?.id,
      scaleId: item?.scale ? item?.scale?.id : '',
      quantity: item?.quantity,
    }));
    setForm((prevForm: any) => ({
      ...prevForm,
      product_ids: filterIds,
      product_details: produtDetailsIdss,
    }));

    setSelectedProduct(updatedSelectedProductList);
  };

  const decrementCounter = (item: any) => {
    const updatedSelectedProductList = SelectedProduct.map((product: any) => {
      if (
        item?.scale === null
          ? product?.product?.id === item?.product?.id
          : product?.scale?.id === item?.scale?.id
      ) {
        return {
          ...product,
          quantity: product.quantity > 0 ? product.quantity - 1 : 0,
        };
      }
      return product;
    });
    if (SelectedProduct?.length) {
      item?.scale === null
        ? setPriceTotal(Number(pricetotal) - Number(item?.product?.price))
        : setPriceTotal(Number(pricetotal) - Number(item?.scale?.price));
    } else {
      setPriceTotal(0);
    }
    const ids = updatedSelectedProductList.map((i: any) => i?.product?.id);
    const filterIds = [...new Set(ids)];
    // const arrayProductDetails = updatedSelectedProductList.flatMap((i: any) =>
    //     Array.from({ length: i.quantity }, () => ({
    //         productId: i.product.id,
    //         scaleId: i.scale ? i.scale.id : null,
    //         productquantity: i.quantity
    //     }))
    // );
    const produtDetailsIdss = updatedSelectedProductList.map((item: any) => ({
      productId: item?.product?.id,
      scaleId: item?.scale ? item?.scale?.id : '',
      quantity: item?.quantity,
    }));
    setForm((prevForm: any) => ({
      ...prevForm,
      product_ids: filterIds,
      product_details: produtDetailsIdss,
    }));
    setSelectedProduct(updatedSelectedProductList);
  };

  return (
    <FlatList
      data={SelectedProduct}
      ListHeaderComponent={() => listHeader()}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <View style={styles.productcontentRow}>
          <Text style={styles.rowWidth}>
            {item?.scale === null ? item.product?.title : item.product?.title}
          </Text>
          <Text style={styles.rowWidth}>
            {item?.scale === null ? ' N/A' : item?.scale?.scale_name}
          </Text>
          <Text style={styles.rowWidth}>
            $
            {item?.scale === null
              ? item?.product?.price.toFixed(2)
              : item?.scale?.price.toFixed(2)}
          </Text>
          <View style={{ ...styles.qantityBtn, ...styles.rowWidth }}>
            <TouchableOpacity
              style={styles.incrementBtn}
              disabled={item?.quantity === 1}
              onPress={() => {
                decrementCounter(item);
              }}>
              <Text>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.countText}>
              <Text>{item?.quantity}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.incrementBtn}
              onPress={() => {
                IncrementCounter(item);
              }}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              { ...styles.rowWidth },
              Styles.justifyContentCenter,
              Styles.alignContentCenter,
            ]}>
            <TouchableOpacity
              style={{ ...styles.deleteBtn }}
              onPress={() => {
                productDeleteHandler(item);
              }}>
              <Text style={styles.productdelbtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      // numColumns={5}
      // keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default ProductTable;
