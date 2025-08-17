import { Toast } from 'native-base';
import { deleteCategoryAction } from '../../../redux/merchant/category/deleteCategoryAction';
import { deleteAddOnsAction } from '../../../redux/merchant/addOns/deleteAddOnsAction';
import * as ImagePicker from 'expo-image-picker';
import { AppConfig } from '../../../config';
import * as FileSystem from 'expo-file-system';
import { axiosInstance } from '../../../config/axios';
import { getRole } from '../../../utils/helpers';

//Menu

export const handleCategoryDeletion = async (
  id: any,
  dispatch: any,
  setCategory: any,
) => {
  try {
    //@ts-ignore
    const deletedCategory = await dispatch(deleteCategoryAction({ id }));
    if (deletedCategory?.payload?.status === 200) {
      setCategory((prev: any) => ({
        ...prev,
        list: prev?.list.filter((j: any) => j?.id !== id),
      }));
    }
  } catch (e: any) {
    Toast.show({
      title: e?.response?.data?.message || 'Something went wrong',
    });
  }
};

export const handleAddOnDeletion = async (
  id: any,
  dispatch: any,
  setAddOn: any,
) => {
  try {
    //@ts-ignore
    const deletedAddOn = await dispatch(deleteAddOnsAction({ id }));
    if (deletedAddOn?.payload?.status === 200) {
      setAddOn((prev: any) => ({
        ...prev,
        list: prev?.list.filter((j: any) => j?.id !== id),
      }));
    }
  } catch (e: any) {
    Toast.show({
      title: e?.response?.data?.message || 'Something went wrong',
    });
  }
};

export const pickImage = async setImage => {
  // No permissions request is necessary for launching the image library
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: false,
  });

  if (!result.canceled) {
    setImage(prev => ({ ...prev, image: result?.assets[0]?.uri }));
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
      setImage(prev => ({ ...prev, photo: imageUpload }));

      return res.body;
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Unable to upload image',
      });
    }
  }
};

export const fetchCategoryHandler = async (
  categoryData,
  setCategoryData,
  dropdown,
  setDropdown,
  userData,
  check = false,
) => {
  setCategoryData({
    ...categoryData,
    loading: true,
  });
  if (check) {
    setDropdown({
      ...dropdown,
      category: !dropdown?.category,
    });
  }
  try {
    const role = await getRole();
    const id =
      role?.id === 4
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
    await axiosInstance
      .get<any>(`categories/list?added_by=${id}`)
      .then((res: any) => {
        res = res?.data;
        setCategoryData({
          ...categoryData,
          loading: false,
          list: res?.categories?.rows || [],
        });
      })
      .catch(err => {
        setCategoryData({
          ...categoryData,
          loading: false,
        });
      });
  } catch (error) {
    setCategoryData({
      ...categoryData,
      loading: false,
    });
  }
};

export const fetchAddOnsHandler = async (
  addOnsData,
  setAddOnsData,
  dropdown,
  setDropdown,
  userData,
) => {
  setAddOnsData({
    ...addOnsData,
    loading: true,
  });
  setDropdown({
    ...dropdown,
    addOns: !dropdown?.addOns,
  });
  try {
    const role = await getRole();
    const id =
      role?.id === 4
        ? userData?.userDetail?.parent_id
        : userData?.userDetail?.id;
    await axiosInstance
      .get<any>(`addons/list?added_by=${id}`)
      .then((res: any) => {
        res = res?.data;
        setAddOnsData({
          ...addOnsData,
          loading: false,
          list: res?.addons?.rows || [],
        });
      })
      .catch(err => {
        setAddOnsData({
          ...addOnsData,
          loading: false,
        });
      });
  } catch (error) {
    setAddOnsData({
      ...addOnsData,
      loading: false,
    });
  }
};
