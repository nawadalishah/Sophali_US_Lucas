import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { COLORS, Text } from '../../../constants';
import SwipeList from '../../../components/SwipeList';
import { ChevronDownIcon, ChevronUpIcon } from '../../../utils/icons';
import { useStyles } from './styles';
import { CrossSvg } from '../../../svg';
import Styles from '../../../utils/styles';
import { Button } from '../../../components';
import PopUpModal from '../../../components/PopUpModal';
import { AppConfig } from '../../../config';

const AddOnsMenu = ({
  addOnsHandler,
  addOnsData,
  toggleModal,
  deleteAddOnHandler,
  modal,
  addAddOnHandler,
  addOns,
  dropdown,
  addOnsDataHandler,
  handlePickImage,
  toggleEditAddonsModal,
  editAddOnsHandler,
}) => {
  const styles = useStyles();

  const editHandler = useCallback(() => {
    if (modal.edit) {
      editAddOnsHandler(addOns);
    } else {
      toggleModal('');
      addAddOnHandler();
    }
  }, [toggleModal, addAddOnHandler, modal, editAddOnsHandler]);

  const renderCategoryItem = (category: any) => (
    <View style={[styles.listItemStyle]} key={category.id}>
      <Text>{category.title}</Text>
    </View>
  );
  return (
    <>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          onPress={addOnsHandler}
          activeOpacity={0.7}
          style={styles.menuHeader}>
          <Text style={{ color: COLORS.gray }}>AddOns</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={addOnsHandler}>
            {dropdown?.addOns ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </TouchableOpacity>
        </TouchableOpacity>
        {dropdown?.addOns && (
          <View style={styles.listContainer}>
            <SwipeList
              data={addOnsData?.list}
              loading={addOnsData?.loading}
              renderItem={renderCategoryItem}
              openModal={() => toggleModal('')}
              handleDelete={deleteAddOnHandler}
              handleEdit={toggleEditAddonsModal}
            />
          </View>
        )}
      </View>

      {/* Model For Adding Addons */}
      {modal?.addOnModal && (
        <PopUpModal
          onClose={() => toggleModal('', true)}
          open={modal?.addOnModal}>
          <View style={styles.catModalStyle}>
            <View
              style={[
                Styles.flexDirectionRow,
                Styles.w100,
                Styles.justifyContentSpaceBetween,
              ]}>
              <Text style={styles.modalHeading}>
                {modal.edit ? 'Update AddOns' : 'Add AddOns'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  toggleModal('', true);
                }}>
                <CrossSvg />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Addon..."
              style={styles.modalInput}
              value={addOns?.title || ''}
              onChangeText={val => {
                addOnsDataHandler('title', val);
              }}
            />
            <TextInput
              placeholder="Price..."
              style={styles.modalInput}
              value={addOns?.price || ''}
              onChangeText={val => {
                addOnsDataHandler('price', val);
              }}
            />
            <TextInput
              placeholder="Size..."
              style={styles.modalInput}
              value={addOns?.size || ''}
              onChangeText={val => {
                addOnsDataHandler('size', val);
              }}
            />
            <View style={styles.modalInput}>
              <TouchableOpacity style={Styles.pV5} onPress={handlePickImage}>
                <Text>Select Image</Text>
              </TouchableOpacity>
              {addOns?.image && (
                <Image
                  source={{
                    uri: `${AppConfig.BaseUrl}getFileById?uuid=${addOns.photo}`,
                  }}
                  style={styles.image}
                />
              )}
            </View>

            <Button
              title={modal.edit ? 'Update' : 'Create'}
              onPress={editHandler}
              containerStyle={styles.addBtn}
              textStyle={styles.btnText}
              // disabled={}
            />
          </View>
        </PopUpModal>
      )}
    </>
  );
};

export default AddOnsMenu;
