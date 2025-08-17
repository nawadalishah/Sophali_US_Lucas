import React, { FC } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Toast } from 'native-base';
import { AndroidSafeArea, COLORS } from '../constants';
import { DeleteIcon, EditIcon } from '../utils/icons';
import Button from './Button';
import Styles from '../utils/styles';
import { scaleSize } from '../utils/mixins';

interface SwipeListProps {
  data: any[];
  renderItem: (item: any) => React.ReactElement;
  loading: boolean;
  handleDelete: () => void;
  handleEdit: () => void;
  openModal: () => void;
}

const SwipeList: FC<SwipeListProps> = ({
  data,
  renderItem,
  loading,
  handleDelete,
  handleEdit,
  openModal,
}) => {
  const deleteItemFrom = async (item: any) => {
    try {
      Alert.alert('Confirm Deletion', 'Are you sure?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            console.log('data.product', item);
            handleDelete && handleDelete(item?.product?.id);
          },
        },
      ]);
    } catch (e: any) {
      console.log(JSON.stringify(e));
      Toast.show({
        title: e?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const editItem = (item: any) => {
    console.log('product', item);
    handleEdit && handleEdit(item?.product);
  };

  const renderHiddenItem = (item: any) => (
    <View style={styles.hiddenItemContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => editItem({ product: item })}
        style={[Styles.mR10]}>
        <EditIcon onPress={() => editItem({ product: item })} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => deleteItemFrom({ product: item })}>
        <DeleteIcon onPress={() => deleteItemFrom({ product: item })} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <SwipeListView
        data={data}
        keyExtractor={(item: any) => `${item.id}+${item.id}`}
        renderItem={({ item }) => renderItem(item)}
        renderHiddenItem={({ item }) => renderHiddenItem(item)}
        rightOpenValue={-90}
        contentContainerStyle={styles.swipeListContent}
        showsVerticalScrollIndicator={true}
        disableRightSwipe={true}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.blue} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text>No data to display</Text>
            </View>
          )
        }
      />
      <Button
        containerStyle={styles.addBtn}
        onPress={() => openModal && openModal()}
        title={'Add more'}
        textStyle={styles.btnText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...AndroidSafeArea.AndroidSafeArea,
  },
  mainContainer: {
    flex: 1,
  },
  swipeListContent: {},
  hiddenItemContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    ...Styles.flexDirectionRow,
    width: '100%',
    height: '100%',
    ...Styles.pT10,
  },
  hiddenItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiddenItemIcon: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Styles.pV15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Styles.pV15,
  },
  addBtn: {
    height: scaleSize(40),
    ...Styles.mV5,
  },
  btnText: {
    textTransform: 'capitalize',
  },
});

export default SwipeList;
