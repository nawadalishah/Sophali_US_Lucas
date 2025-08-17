/* eslint-disable @typescript-eslint/no-use-before-define */
import { SafeAreaView, View, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Select, Toast } from 'native-base';
import { AndroidSafeArea, COLORS, Text } from '../../constants';
import {
  Button,
  Header,
  ImagePreviewModal,
  InputField,
  TitleText,
  Loader,
} from '../../components';
import { useAppSelector } from '../../redux/Store';
import { axiosInstance } from '../../config/axios';
import { TouchableOpacity } from 'react-native';
import { FORMDATAHEADERS, HEADERS } from '../../utils/helpers';
import { MOBILE, deviceWidth } from '../../utils/orientation';
import Styles from '../../utils/styles';
import { FONT_FAMILY, WEIGHT } from '../../constants/theme';
import { scaleSize } from '../../utils/mixins';
import * as ImagePicker from 'expo-image-picker';
import { AppConfig } from '../../config';
import * as DocumentPicker from 'expo-document-picker';
import keys from '../../constants/keys';

export default function BusinessInfo() {
  const { createToken } = useStripe();
  const navigation = useNavigation();
  const { user } = useAppSelector(state => state.auth);
  const [stripPublicKey, setStripPublicKey] = useState(keys.STRIPE_KEY);
  const [form, setForm] = useState({
    stripe_account_id: '',
    bank_name: '',
    account_holder_name: '',
    bank_account_number: '',
    bank_routing_number: '',
    account_type: '',
    user_id: '',
    id: '',
    transitNumber: '',
    institutionNumber: '',
  });
  const [imageForm, setImageForm] = useState({
    id_front: '',
    id_back: '',
    address_front: '',
    address_back: '',
    uri: '',
    name: '',
    type: '',
    currentDocType: '',
  });
  const userData = user;
  const [favorite, setFavorite] = useState('Banking Info');
  const [showModal, setShowModal] = useState(false);
  const [docsData, setDocsData] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState<any>({
    uri: '',
    name: '',
    size: '',
    type: '',
    isPDF: false,
  });
  const [loading, setLoading] = useState(true);
  const [disableUpload, setDisableUpload] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    getVerificationDocs();
    getBankingInfo();
  }, [userData?.userDetail.id]);

  const getVerificationDocs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<any>(
        `userInfo/verification-docs?user_id=${userData?.userDetail.id}`,
      );
      setDocsData(res.data);
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Cannot get verification docs',
      });
      setLoading(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (!imageForm?.id_front && !docsData?.data?.id_front) {
      setDisableUpload(true);
    } else {
      setDisableUpload(false);
    }
  }, [imageForm?.id_front, docsData?.data?.id_front]);

  async function getBankingInfo() {
    try {
      const res = await axiosInstance.get<any>(
        `userInfo/get-banking-info?user_id=${userData?.userDetail.id}`,
      );
      const bankRoutingNumber = res?.data?.bankInfo?.bank_routing_number;
      const [part1, part2] = bankRoutingNumber
        ? bankRoutingNumber.split('-')
        : ['', ''];

      if (res.data && res.data.bankInfo) {
        setForm(prevForm => ({
          ...prevForm,
          ...res.data.bankInfo,
          transitNumber: part1,
          institutionNumber: part2,
        }));
      }
    } catch (e: any) {
      Toast.show({
        title: e?.response?.data?.message || 'Cannot get banking info',
      });
    }
  }

  const categoryRecords = [
    { value: 'company', title: 'Company' },
    { value: 'individual', title: 'Individual' },
  ];

  async function saveSettings() {
    setButtonLoader(true);
    if (
      !form?.bank_name ||
      !form?.account_holder_name ||
      !form?.bank_account_number ||
      !form?.transitNumber ||
      !form?.institutionNumber ||
      !form?.account_type
    ) {
      Toast.show({
        title: 'Provide all banking information',
      });
      setButtonLoader(false);
      return;
    }
    const routingNumber =
      (form?.transitNumber || '') + '-' + (form?.institutionNumber || '');
    const { error, token } = await createToken({
      type: 'BankAccount',
      accountHolderName: form.account_holder_name,
      accountHolderType: form.account_type,
      accountNumber: form.bank_account_number,
      country: 'CA',
      currency: 'cad',
      routingNumber: routingNumber,
    });
    if (error) {
      console.error('[error]', error);
      setButtonLoader(false);
      Toast.show({
        title: error.message,
      });
      return;
    } else {
      try {
        const response = await axiosInstance.post<any>(
          'userInfo/add-banking-info-stripe',
          {
            accountId: form.stripe_account_id,
            externalAccountToken: token.id,
          },
          HEADERS,
        );
      } catch (error) {
        setButtonLoader(false);
        Toast.show({
          title: 'Banking information is incorrect',
        });
        console.error('Error:', error);
        return;
      }
    }
    form.user_id =
      userData?.userDetail && userData?.userDetail?.id
        ? userData?.userDetail?.id?.toString()
        : '';

    try {
      const res = await axiosInstance.post<any>(
        'userInfo/add-banking-info',
        {
          ...form,
          bank_routing_number: routingNumber,
          id_front: null,
          id_back: null,
          address_front: null,
          address_back: null,
        },
        HEADERS,
      );

      if (res.data) {
        Toast.show({
          title: 'Profile updated successfully',
        });
        await getBankingInfo();
        setButtonLoader(false);
      }
    } catch (e: any) {
      setButtonLoader(false);

      Toast.show({
        title: e?.response?.data?.message || 'Cannot update profile',
      });
    } finally {
      setButtonLoader(false);
    }
  }
  function NavigateToScreen(screenName: string) {
    navigation.dispatch(
      CommonActions.navigate({
        name: screenName,
      }),
    );
  }

  function renderHeader() {
    return <Header title="Banking Info" onPress={() => navigation.goBack()} />;
  }

  const uploadDocument = async (docType: string) => {
    try {
      const docData = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!docData.canceled) {
        const fileSizeInMB = docData.assets[0].fileSize / (1024 * 1024);
        if (fileSizeInMB > 4) {
          Toast.show({
            title: 'File size should be less than 4MB',
          });
          return;
        }
        setForm(prevForm => ({
          ...prevForm,
          [docType]: docData.assets[0].uri,
          uri: docData.assets[0].uri,
          name: docData.assets[0].uri.split('/').pop(),
          type: 'image/jpeg' || 'image/png',
          currentDocType: docType,
        }));

        setShowModal(true);
        setPreviewImage(docData.assets[0].uri);
      } else {
        Toast.show({
          title: 'Image not selected',
        });
      }
    } catch (error) {
      console.error('Error picking an image: ', error);
      Toast.show({
        title: 'Error picking an image',
      });
    }
  };

  const pickDocument = async (docType: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      console.log('The result', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedDocument = result.assets[0];
        const fileSizeInMB = pickedDocument.size / (1024 * 1024);
        if (fileSizeInMB > 4) {
          Toast.show({
            title: 'File size should be less than 4MB',
          });
          return;
        }

        setImageForm(prevForm => ({
          ...prevForm,
          [docType]: pickedDocument.uri,
          uri: pickedDocument.uri,
          name: pickedDocument.name,
          type: pickedDocument.mimeType,
          currentDocType: docType,
        }));

        setShowModal(true);
        setPreviewImage({
          uri: pickedDocument.uri,
          name: pickedDocument.name,
          type: pickedDocument.mimeType,
          size: pickedDocument.size,
          isPDF: !!pickedDocument.mimeType.includes('pdf'),
        });
      } else {
        Toast.show({
          title: 'File not selected',
        });
        console.log('No selection or cancelled by user');
      }
    } catch (error) {
      console.error('Error picking a document: ', error);
      Toast.show({
        title: 'Issue occurred picking a file',
      });
    }
  };

  const uploadVerificationDocs = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', userData?.userDetail?.id);
      formData.append('doc_type', imageForm.currentDocType);
      formData.append('file', {
        uri: imageForm.uri,
        name: imageForm.name,
        type: previewImage.type,
      });

      const uploadRes = await axiosInstance.post<any>(
        'userInfo/upload-verification-docs',
        formData,
        FORMDATAHEADERS,
      );
      console.log('Upload', JSON.stringify(uploadRes?.data?.code));
      if (uploadRes?.data?.code == 200) {
        Toast.show({
          title: 'Document uploaded successfully',
        });
      } else if (uploadRes?.data?.code == 201) {
        Toast.show({
          title: uploadRes?.data?.message,
        });
      } else {
        Toast.show({
          title: 'Document is corrupted or already exist',
        });
      }
      setTimeout(() => {
        getVerificationDocs();
      }, 5000);
    } catch (error) {
      console.error('Error uploading document: ', error);
      Toast.show({
        title: 'Document is corrupted or already exist',
      });
      setLoading(false);
    }
  };

  function renderUploadButton({
    title,
    onPress,
    disabled = false,
  }: {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
  }) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={onPress}
        style={[styles.uploadCon, disabled && styles.disabledUploadCon]}>
        <Text style={[styles.uploadText]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  function renderContent() {
    return (
      <StripeProvider
        publishableKey={stripPublicKey}
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{
            ...Styles.pT30,
            ...Styles.pB30,
            ...Styles.pH15,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: 12,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 12,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'Settings' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 155,
                }}
                onPress={() => NavigateToScreen('Settings')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Settings' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'Banking Info' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 155,
                }}
                onPress={() => setFavorite('Banking Info')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Banking Info' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Banking Info
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 12,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'BusinessInfo' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 150,
                }}
                onPress={() => NavigateToScreen('BusinessInfo')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'BusinessInfo' ? COLORS.white : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Business Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    favorite === 'Change Password' ? COLORS.green : '#F3F7FF',
                  borderRadius: 50,
                  marginHorizontal: 5,
                  width: 150,
                }}
                onPress={() => NavigateToScreen('ChangePassword')}>
                <Text
                  style={{
                    paddingHorizontal: 28,
                    paddingVertical: 3,
                    lineHeight: 12 * 1.3,
                    color:
                      favorite === 'Change Password'
                        ? COLORS.white
                        : COLORS.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputField
            title="Bank Name"
            placeholder="Bank"
            value={form.bank_name}
            onchange={(v: string) => {
              setForm({ ...form, bank_name: v });
            }}
            containerStyle={{ marginBottom: 30 }}
          />
          <InputField
            title="Account Holder Name"
            placeholder="Brian Reynolds"
            value={form.account_holder_name}
            onchange={(v: string) => {
              setForm({ ...form, account_holder_name: v });
            }}
            containerStyle={{ marginBottom: 30 }}
          />
          <InputField
            title="Bank Account Number"
            placeholder="000123456789"
            value={form.bank_account_number}
            onchange={(v: string) => {
              setForm({ ...form, bank_account_number: v });
            }}
            containerStyle={{ marginBottom: 30 }}
            // icon={<CheckSvgch />}
          />
          <InputField
            placeholder="11000"
            title="Transit/Branch Number"
            value={form.transitNumber}
            onchange={(v: string) => {
              setForm({ ...form, transitNumber: v });
            }}
            containerStyle={{ marginBottom: 30 }}
            maxLength={5}
            keyboardType={'numeric'}
          />

          <InputField
            placeholder="000"
            title="Institution Number"
            value={form.institutionNumber}
            onchange={(v: string) => {
              setForm({ ...form, institutionNumber: v });
            }}
            containerStyle={{ marginBottom: 30 }}
            maxLength={3}
            keyboardType={'numeric'}
          />

          <View
            style={[
              Styles.mB20,
              {
                flexDirection: 'column',
                justifyContent: 'center',
              },
            ]}>
            <TitleText title="Account Holder Type" />
            <Select
              key="type"
              placeholder="Account Type"
              selectedValue={form.account_type}
              width={deviceWidth - 35}
              onValueChange={(itemValue: any) =>
                setForm({ ...form, account_type: itemValue })
              }>
              {categoryRecords?.map((item, index) => (
                <Select.Item
                  key={index}
                  label={item.title}
                  value={item.value}
                />
              ))}
            </Select>
          </View>

          <>
            <Button
              title="Save"
              containerStyle={{ ...Styles.mV15 }}
              onPress={saveSettings}
              disabled={loading || buttonLoader}
              isLoading={buttonLoader}
            />
          </>

          <View style={[Styles.w100, Styles.mV10]}>
            <TitleText title="Note:" />
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Do not upload the same document in multiple categories. ID
              documents should be in .png or .jpg format, while address
              documents can be in .png, .jpg, or .pdf format.
            </Text>
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Only original, color documents are accepted. Do not upload
              photocopies, altered, or damaged documents.
            </Text>
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Ensure the entire document is visible, with all edges clearly
              shown.
            </Text>
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Confirm that your documents are current; expired documents will
              not be accepted.
            </Text>
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Avoid black-and-white scans. Use a mobile device to capture
              high-quality, clear images where all details are readable.
            </Text>
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Avoid areas with strong overhead lighting that may cast shadows
              on your document. Stay away from bright lights that could cause
              glare on the document.
            </Text>
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Higher quality images significantly improve the likelihood of
              successful verification.
            </Text>
            <Text size={MOBILE.textSize.mSmall} style={Styles.pB5}>
              - Ensure the full name and address on the document are clear,
              legible, and prominently displayed.
            </Text>
          </View>

          <TitleText
            title="Identity Document"
            subTitle=" (Passport / ID Card)"
          />

          {loading ? (
            <View
              style={{
                width: '100%',
                height: scaleSize(200),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Loader />
            </View>
          ) : (
            <>
              <View style={styles.rowSb}>
                <ImageCard
                  item={docsData?.data?.id_front}
                  path={docsData?.filePath?.idFront}
                  type={'id_front'}
                  title="Upload Front"
                  first={true}
                />

                <ImageCard
                  item={docsData?.data?.id_back}
                  path={docsData?.filePath?.idBack}
                  type={'id_back'}
                  title="Upload Back"
                />
              </View>

              <TitleText
                title="Address Document"
                subTitle=" (Driving License)"
              />
              <View style={[styles.rowSb, Styles.mB30]}>
                <ImageCard
                  item={docsData?.data?.address_front}
                  path={docsData?.filePath?.addressFront}
                  type={'address_front'}
                  title="Upload Front"
                />
                <ImageCard
                  item={docsData?.data?.address_back}
                  path={docsData?.filePath?.addressBack}
                  type={'address_back'}
                  title="Upload Back"
                />
              </View>
            </>
          )}
        </KeyboardAwareScrollView>
      </StripeProvider>
    );
  }
  const extractFileName = path => {
    const normalizedPath = path.replace(/\\/g, '/');
    return normalizedPath.split('/').pop();
  };

  const ImageCard = ({ item, path, title, type, first = false }) => {
    const name = item ? extractFileName(path) : '';
    return item ? (
      <>
        {path.includes('.pdf') ? (
          <View
            style={[
              Styles.justifyContentCenter,
              Styles.alignItemsCenter,
              styles.uploadedImg,
              Styles.pH5,
              { backgroundColor: COLORS.white },
            ]}>
            <Text size={MOBILE.textSize.common} color={COLORS.green}>
              File: {name || ''}
            </Text>
          </View>
        ) : (
          <Image
            source={{
              uri: `${AppConfig.BaseUrl}${path}`,
            }}
            style={styles.uploadedImg}
          />
        )}
      </>
    ) : (
      renderUploadButton({
        title,
        onPress: () => pickDocument(type),
        disabled: first ? false : disableUpload,
      })
    );
  };

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}

      {showModal && (
        <ImagePreviewModal
          data={previewImage || ''}
          onClose={() => {
            setShowModal(false);
            setPreviewImage({
              uri: '',
              name: '',
              size: '',
              type: '',
              isPDF: false,
            });
          }}
          onConfirm={() => {
            setShowModal(false);
            uploadVerificationDocs();
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.transparent,
    margin: 100,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  mainView: {
    paddingHorizontal: 8,
    paddingVertical: 15,
    backgroundColor: COLORS.green,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
  },
  heading: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: 'bold',
  },
  textdesign: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 20,
  },
  qr_box: {
    height: 250,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtn: {},
  mainView1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  absoluteFillObject: {},
  rowSb: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadCon: {
    height: scaleSize(35),
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: COLORS.green,
    borderStyle: 'dashed',
    borderRadius: scaleSize(5),
    borderWidth: scaleSize(2),
    marginBottom: scaleSize(20),
    width: deviceWidth / 2.4,
    ...Styles.mT5,
  },
  disabledUploadCon: {
    borderColor: COLORS.gray,
    opacity: 0.2,
  },
  uploadText: {
    color: COLORS.green,
    fontSize: MOBILE.textSize.normal,
    fontWeight: WEIGHT.w600,
    fontFamily: FONT_FAMILY.SEMI_BOLD,
  },
  uploadedImg: {
    borderRadius: scaleSize(10),
    width: scaleSize(120),
    height: scaleSize(120),
    resizeMode: 'contain',
    borderWidth: scaleSize(0.5),
    borderColor: COLORS.lightGray,
    elevation: 1.5,
  },
});
