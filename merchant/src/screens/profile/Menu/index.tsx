import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import ProductsScreen from '../../merchant/product/product_1';
import TopNavigation from '../../../components/TopNavigation';
import { useAppSelector } from '../../../redux/Store';
import { useDispatch } from 'react-redux';
import {
  addCategoryAction,
  editCategoryAction,
} from '../../../redux/merchant/category/addCategoryAction';
import {
  fetchAddOnsHandler,
  fetchCategoryHandler,
  handleAddOnDeletion,
  handleCategoryDeletion,
  pickImage,
} from './helper';
import Styles from '../../../utils/styles';
import { useStyles } from './styles';
import CategoryMenu from './CategoryMenu';
import AddOnsMenu from './AddOnsMenu';
import {
  addAddOnsAction,
  editAddOnsAction,
} from '../../../redux/merchant/addOns/addAddOnsAction';
import { Header } from '../../../components';
import { isSubMerchant } from '../../../utils/helpers';

const MenuScreen = () => {
  const { user: userData } = useAppSelector(state => state.auth);
  const [modal, setModal] = useState({
    addOnModal: false,
    categoryModal: false,
    edit: false,
  });
  const [category, setCategory] = useState('');
  const [addOns, setAddOns] = useState({
    title: '',
    size: '',
    price: '',
    image: '',
    photo: '',
  });
  const [dropdown, setDropdown] = useState({
    category: false,
    addOns: false,
  });
  const [categoryData, setCategoryData] = useState<any>({
    dropdown: false,
    list: [],
    loading: false,
  });
  const [addOnsData, setAddOnsData] = useState<any>({
    dropdown: false,
    list: [],
    loading: false,
  });
  const [updateData, setUpdateData] = useState<any>({
    id: '',
  });

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const styles = useStyles();
  const isSubMerchantRole = isSubMerchant(userData?.role?.name);
  const merchantId = isSubMerchantRole
    ? userData?.userDetail?.parent_id
    : userData?.userDetail?.id;

  useEffect(() => {
    fetchCategoryHandler(
      categoryData,
      setCategoryData,
      dropdown,
      setDropdown,
      userData,
      false,
    );
  }, []);

  const categoryHandler = useCallback(async () => {
    fetchCategoryHandler(
      categoryData,
      setCategoryData,
      dropdown,
      setDropdown,
      userData,
      true,
    );
  }, [dropdown, categoryData, userData]);

  const addOnsHandler = useCallback(async () => {
    fetchAddOnsHandler(
      addOnsData,
      setAddOnsData,
      dropdown,
      setDropdown,
      userData,
    );
  }, [dropdown, addOnsData, userData]);

  const addOnsDataHandler = useCallback((label, value) => {
    setAddOns(prev => ({
      ...prev,
      [label]: value,
    }));
  }, []);

  const toggleModal = useCallback(
    (value = '', close = false) => {
      setAddOns({
        photo: '',
        title: '',
        size: '',
        price: '',
        image: '',
      });
      setCategory('');
      if (close) {
        setModal({
          ...modal,
          categoryModal: false,
          addOnModal: false,
          edit: false,
        });
      } else {
        if (value) {
          setModal({
            ...modal,
            categoryModal: !modal.categoryModal,
          });
        } else {
          setModal({
            ...modal,
            addOnModal: !modal.addOnModal,
          });
        }
      }
    },
    [modal],
  );
  //Toggle the Edit Modal
  const toggleEditModal = useCallback(async (data: any) => {
    setModal({
      ...modal,
      categoryModal: !modal.categoryModal,
      edit: !modal.edit,
    });
    setCategory(data.title);
    setUpdateData({
      id: data.id,
    });
  }, []);
  const toggleEditAddonsModal = useCallback(async (data: any) => {
    const a = JSON.parse(data?.photo);

    setModal({
      ...modal,
      addOnModal: !modal.addOnModal,
      edit: !modal.edit,
    });
    setAddOns({
      ...addOns,
      title: data?.title || '',
      size: data?.size || '',
      price: data?.price?.toString() || '',
      image: (a && a[0]) || '',
      photo: (a && a[0]) || '',
    });
    setUpdateData({
      id: data.id,
    });
    setModal({
      ...modal,
      addOnModal: !modal.addOnModal,
      edit: !modal.edit,
    });
  }, []);
  const editCategoryHandler = useCallback(
    async (value = '') => {
      // @ts-ignore
      await dispatch(editCategoryAction({ ...updateData, title: value }));
      await categoryHandler();
      setModal({
        ...modal,
        edit: !modal.edit,
        categoryModal: !modal.categoryModal,
      });
    },
    [modal, updateData],
  );

  const editAddOnsHandler = useCallback(
    async (value = '') => {
      const body = {
        id: updateData.id,
        title: value?.title ? value?.title : addOns?.title,
        price: value?.price
          ? parseFloat(value?.price)
          : parseFloat(addOns?.price),
        photo: value?.photo ? JSON.stringify([value?.photo]) : addOns?.photo,
        size: value?.size ? value?.size : addOns?.size,
      };
      //@ts-ignore
      await dispatch(editAddOnsAction(body));
      await addOnsHandler();
      setModal({
        ...modal,
        addOnModal: !modal.addOnModal,
        edit: !modal.edit,
      });
    },
    [modal, updateData],
  );

  //Adding the category
  const addCategoryHandler = useCallback(async () => {
    await dispatch(
      //@ts-ignore
      addCategoryAction({
        title: category,
        added_by: merchantId,
      }),
    );
    await categoryHandler();
    toggleModal('', true);
  }, [category, userData]);

  //Adding Addons
  const addAddOnHandler = useCallback(async () => {
    const body = {
      title: addOns?.title,
      price: parseFloat(addOns?.price),
      photo: JSON.stringify([addOns?.photo]),
      size: addOns?.size,
      added_by: merchantId,
    };
    //@ts-ignore
    await dispatch(addAddOnsAction(body));
    await addOnsHandler();
    toggleModal('', true);
  }, [addOns, userData]);

  //Delete the category
  const deleteCategoryHandler = useCallback(
    (item: any) => {
      handleCategoryDeletion(item, dispatch, setCategoryData);
    },
    [dispatch],
  );
  const deleteAddOnHandler = useCallback(
    (item: any) => {
      handleAddOnDeletion(item, dispatch, setAddOnsData);
    },
    [dispatch],
  );

  const handlePickImage = useCallback(() => {
    pickImage(setAddOns);
  }, []);

  const handleCategoryField = useCallback((value: any) => {
    setCategory(value);
  }, []);
  return (
    <View style={[Styles.flex, Styles.primaryBackground]}>
      <TopNavigation currentScreen={'Menu'} />
      <Header
        title={'Menu'}
        onPress={() => navigation.goBack()}
        containerStyle={[Styles.primaryBackground]}
      />
      <View style={styles.container}>
        <CategoryMenu
          categoryHandler={categoryHandler}
          categoryData={categoryData}
          toggleModal={toggleModal}
          deleteCategoryHandler={deleteCategoryHandler}
          modal={modal}
          category={category}
          setCategory={handleCategoryField}
          addCategoryHandler={addCategoryHandler}
          dropdown={dropdown}
          editCategoryHandler={editCategoryHandler}
          toggleEditModal={toggleEditModal}
        />
        <AddOnsMenu
          addOnsHandler={addOnsHandler}
          addOnsData={addOnsData}
          toggleModal={toggleModal}
          deleteAddOnHandler={deleteAddOnHandler}
          modal={modal}
          addAddOnHandler={addAddOnHandler}
          dropdown={dropdown}
          addOnsDataHandler={addOnsDataHandler}
          addOns={addOns}
          handlePickImage={handlePickImage}
          toggleEditAddonsModal={toggleEditAddonsModal}
          editAddOnsHandler={editAddOnsHandler}
        />
      </View>
      <View style={Styles.flex}>
        <ProductsScreen isCategoryExist={categoryData?.list.length > 0} />
      </View>
    </View>
  );
};

export default MenuScreen;
