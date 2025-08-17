import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Toast } from 'native-base';
import { AppConfig } from '../../config';
import { axiosInstance } from '../../config/axios';
import { HEADERS } from '../../utils/helpers';

export const pickImage = async setImage => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: false,
    selectionLimit: 5,
  });

  if (!result.canceled && result.assets) {
    const newImages = [];

    for (const asset of result.assets) {
      try {
        const uploadRes = await FileSystem.uploadAsync(
          `${AppConfig.BaseUrl}upload`,
          asset.uri,
          {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'Files',
          },
        );

        const { data: imageUpload } = JSON.parse(uploadRes.body);
        newImages.push({ localUri: asset.uri, uri: imageUpload, isFile: true });

        Toast.show({
          title: 'Image uploaded successfully',
        });
      } catch (error) {
        Toast.show({
          title: error?.response?.data?.message || 'Unable to upload image',
        });
      }
    }

    setImage(currentImages => [...currentImages, ...newImages]);

    return newImages.map(i => i.uri);
  } else {
    return [];
  }
};

export const saveMerchantSetting = async (payload: any, setLoading) => {
  try {
    const res = await axiosInstance.post<any>(
      'setting/update',
      payload,
      HEADERS,
    );
    console.log('The setting has been saved', payload, res?.data);
    if (res?.data) {
      Toast.show({
        title: 'Setting updated successfully',
      });
      setTimeout(() => {
        setLoading && setLoading(false);
      }, 200);
      return res?.data;
    } else {
      setLoading && setLoading(false);
      return null;
    }
  } catch (e: any) {
    setLoading && setLoading(false);
    Toast.show({
      title: e?.response?.data?.message || 'Cannot update settings',
    });
    return null;
  }
};

export const getMerchantSetting = async (
  id: number,
  setMerchantSettings,
  setImageCollections,
  setDescription,
  setLoading,
) => {
  setLoading && setLoading(true);
  try {
    const res = await axiosInstance.get(`setting/${id}`);
    if (res?.data && res?.data?.settings) {
      setMerchantSettings(res?.data?.settings);
      setDescription(res?.data?.settings?.description || '');
      if (res?.data?.settings?.image_collection) {
        const newCollection = res?.data?.settings?.image_collection
          ? typeof res?.data?.settings?.image_collection === 'string'
            ? (() => {
                try {
                  return JSON.parse(res?.data?.settings?.image_collection);
                } catch (e) {
                  console.error('Failed to parse image_collection:', e);
                  return [];
                }
              })()
            : Array.isArray(res?.data?.settings?.image_collection)
              ? res?.data?.settings?.image_collection
              : []
          : [];
        setImageCollections(prev => {
          const prevCollectionString = JSON.stringify(prev.map(i => i.uri));
          const newCollectionString = JSON.stringify(newCollection);

          if (prevCollectionString !== newCollectionString) {
            return newCollection.map(i => ({ isFile: false, uri: i }));
          }
          return prev;
        });
      }
      setLoading && setLoading(false);
    } else {
      setLoading && setLoading(false);
    }
  } catch (e: any) {
    console.log('The eeee', e);
    setLoading && setLoading(false);
    Toast.show({
      title: e?.response?.data?.message || 'Cannot get settings',
    });
  }
};

export const deleteImage = async (payload: any) => {
  try {
    const res = await axiosInstance.post<any>(
      'setting/delete-image',
      payload,
      HEADERS,
    );
    if (res?.data) {
      setLoading && setLoading(false);
      Toast.show({
        title: 'Image deleted',
      });
    } else {
      setLoading && setLoading(false);
    }
  } catch (e: any) {
    setLoading && setLoading(false);
    Toast.show({
      title: e?.response?.data?.message || 'Cannot delete image',
    });
  }
};
