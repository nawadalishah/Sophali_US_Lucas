import React from 'react';
import { Modal, View, Image, StyleSheet } from 'react-native';
import Button from './Button';
import { COLORS, Text } from '../constants';
import { scaleSize } from '../utils/mixins';
import { MOBILE } from '../utils/orientation';
import Styles from '../utils/styles';

interface ImagePreviewModalProps {
  image: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  data,
  onClose,
  onConfirm,
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={true}
    onRequestClose={onClose}>
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.confirmTxt}>
          Are you sure you want to upload this image?
        </Text>
        {!data?.isPDF && data && (
          <Image source={{ uri: data.uri }} style={styles.img} />
        )}
        <Text
          lines={2}
          style={[styles.confirmTxt, data?.isPDF && { color: COLORS.green }]}>
          Document: {data?.name || ''}
        </Text>
        <View style={styles.contentContainer}>
          <View style={styles.btnContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              containerStyle={[styles.btn, { backgroundColor: COLORS.danger }]}
            />
            <Button
              title="Confirm"
              onPress={onConfirm}
              containerStyle={[styles.btn, { backgroundColor: COLORS.green }]}
            />
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    backgroundColor: COLORS.white,
    width: '80%',
    paddingVertical: scaleSize(15),
    borderRadius: scaleSize(10),
    alignItems: 'center',
    justifyContent: 'center',
    ...Styles.pH12_5,
  },
  img: { width: scaleSize(200), height: scaleSize(200) },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaleSize(20),
  },
  btnContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '80%',
  },
  btn: { width: scaleSize(90), height: scaleSize(40) },
  confirmTxt: {
    marginBottom: scaleSize(10),
    fontSize: MOBILE.textSize.medium,
    fontWeight: 'bold',
  },
});

export default ImagePreviewModal;
