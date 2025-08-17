import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS } from '../../../constants';
import SwipeList from '../../../components/SwipeList';
import { ChevronDownIcon, ChevronUpIcon } from '../../../utils/icons';
import { useStyles } from './styles';
import { CrossSvg } from '../../../svg';
import Styles from '../../../utils/styles';
import { Button } from '../../../components';
import PopUpModal from '../../../components/PopUpModal';

const CategoryMenu = ({
  categoryHandler,
  categoryData,
  toggleModal,
  deleteCategoryHandler,
  modal,
  category,
  setCategory,
  addCategoryHandler,
  dropdown,
  toggleEditModal,
  editCategoryHandler,
}: any) => {
  const styles = useStyles();

  const renderCategoryItem = (category: any) => (
    <View style={[styles.listItemStyle]} key={category.id}>
      <Text>{category.title}</Text>
    </View>
  );
  const actionHandler = useCallback(() => {
    if (modal.edit) {
      editCategoryHandler(category);
    } else {
      toggleModal('category');
      addCategoryHandler();
    }
  }, [modal, category, addCategoryHandler, editCategoryHandler, toggleModal]);
  return (
    <>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          onPress={categoryHandler}
          activeOpacity={0.7}
          style={styles.menuHeader}>
          <Text style={{ color: COLORS.gray }}>Category</Text>
          <TouchableOpacity onPress={categoryHandler}>
            {dropdown?.category ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </TouchableOpacity>
        </TouchableOpacity>

        {dropdown?.category && (
          <View style={styles.listContainer}>
            <SwipeList
              data={categoryData?.list}
              loading={categoryData?.loading}
              renderItem={renderCategoryItem}
              handleDelete={deleteCategoryHandler}
              handleEdit={toggleEditModal}
              openModal={() => toggleModal('category')}
            />
          </View>
        )}
      </View>

      {/* Modal for Adding Category */}
      {modal?.categoryModal && (
        <PopUpModal
          onClose={() => toggleModal('', true)}
          open={modal?.categoryModal}>
          <View style={styles.catModalStyle}>
            <View
              style={[
                Styles.flexDirectionRow,
                Styles.w100,
                Styles.justifyContentSpaceBetween,
              ]}>
              <Text style={styles.modalHeading}>
                {modal.edit ? 'Update Category' : 'Add Category'}
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
              placeholder="Category..."
              style={styles.modalInput}
              value={category}
              onChangeText={val => {
                setCategory(val);
              }}
            />

            <Button
              title={modal.edit ? 'Update' : 'Create'}
              onPress={actionHandler}
              containerStyle={styles.addBtn}
              textStyle={styles.btnText}
              disabled={!category}
            />
          </View>
        </PopUpModal>
      )}
    </>
  );
};

export default CategoryMenu;
