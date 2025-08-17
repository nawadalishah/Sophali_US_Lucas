import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { generateRandomKey } from '../../../utils';
import { COLORS, Text } from '../../../constants';
import { useStyles } from './styles';
import Styles from '../../../utils/styles';
import { MOBILE, isLandscape } from '../../../utils/orientation';
import { scaleSize } from '../../../utils/mixins';

const OrderTable = ({
  data = [],
  loading = true,
  onRefresh = () => {},
  handleSelectOrder = () => {},
}) => {
  const styles = useStyles();
  return (
    <View style={[Styles.w100, Styles.flex]}>
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerStyle={[Styles.pB20]}
        ListHeaderComponent={() => (
          <View style={[styles.listHeaderContainer]}>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader, styles.textAlignLeft]}>
                Order No
              </Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={styles.textHeader}>Customer</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={styles.textHeader}>Price</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader]}>Time</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader]}>Instructions</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader]}>Status</Text>
            </View>
            <View style={[styles.w25]}>
              <Text style={[styles.textHeader]}>Actions</Text>
            </View>
          </View>
        )}
        stickyHeaderIndices={[0]}
        maxToRenderPerBatch={50}
        initialNumToRender={50}
        keyExtractor={(item, index) => generateRandomKey(item, index)}
        ListEmptyComponent={() =>
          !loading &&
          data.length === 0 && (
            <View style={[styles.emptyComponent]}>
              <Text color={COLORS.gray} size={MOBILE.textSize.medium}>
                Orders not found
              </Text>
            </View>
          )
        }
        renderItem={({ item, index }: any) => {
          const rowBackgroundColors = [
            COLORS.lightBlue,
            COLORS.lightGray,
            COLORS.white,
          ];

          const rowBackgroundColor =
            rowBackgroundColors[index % rowBackgroundColors.length];
          return (
            <View
              style={[
                styles.listItemContainer,
                { backgroundColor: rowBackgroundColor },
              ]}>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    Styles.textTransformUpper,
                    styles.textAlignLeft,
                  ]}>
                  {(item && item?.purchase_order_id) || ''}{' '}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text lines={1} style={[styles.textRow]}>
                  {(item && item?.User?.username) || ''}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[styles.textRow, Styles.textTransformCap]}>
                  ${parseFloat(item.amount_cad).toFixed(2)}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text lines={1} style={[styles.textRow]}>
                  {item?.total_time_in_minutes}mins
                </Text>
              </View>

              <View style={[styles.w25]}>
                <Text lines={1} style={[styles.textRow]}>
                  {item?.special_instructions?.length &&
                  item?.special_instructions?.length > 0
                    ? 'Yes'
                    : 'No'}
                </Text>
              </View>
              <View style={[styles.w25]}>
                <Text
                  lines={1}
                  style={[
                    styles.textRow,
                    Styles.textTransformCap,
                    { color: item?.collected_color },
                  ]}>
                  {item?.status}
                </Text>
              </View>
              {item?.status === 'prepared' ? (
                <View
                  style={[
                    Styles.flexDirectionColumn,
                    { width: '15%', flexWrap: 'wrap' },
                    isLandscape()
                      ? Styles.justifyContentSpaceBetween
                      : Styles.justifyContentCenter,
                    Styles.alignItemsCenter,
                    Styles.alignContentCenter,
                    Styles.pH5,
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleSelectOrder(item, 'details')}
                    style={[
                      {
                        height: scaleSize(20),
                        width: scaleSize(50),
                        backgroundColor: COLORS.customButton,
                        borderRadius: scaleSize(5),
                      },
                      Styles.justifyContentCenter,
                      Styles.mV2,
                    ]}>
                    <Text
                      lines={1}
                      style={[
                        styles.textRow,
                        Styles.textTransformCap,
                        {
                          fontSize: MOBILE.textSize.xxSmall,
                          color: COLORS.white,
                        },
                      ]}>
                      View
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleSelectOrder(item, 'pickup')}
                    style={[
                      {
                        height: scaleSize(20),
                        width: scaleSize(50),
                        backgroundColor: COLORS.green,
                        borderRadius: scaleSize(5),
                      },
                      Styles.justifyContentCenter,
                      Styles.mV2,
                    ]}>
                    <Text
                      lines={1}
                      style={[
                        styles.textRow,
                        Styles.textTransformCap,
                        {
                          fontSize: MOBILE.textSize.xxSmall,
                          color: COLORS.white,
                        },
                      ]}>
                      Pick Up
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[
                    Styles.flexDirectionColumn,
                    { width: '15%', flexWrap: 'wrap' },
                    isLandscape()
                      ? Styles.justifyContentSpaceBetween
                      : Styles.justifyContentCenter,
                    Styles.alignItemsCenter,
                    Styles.alignContentCenter,
                    Styles.pH5,
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleSelectOrder(item, 'receipt')}
                    style={[
                      {
                        height: scaleSize(20),
                        width: scaleSize(50),
                        backgroundColor: COLORS.green,
                        borderRadius: scaleSize(5),
                      },
                      Styles.justifyContentCenter,
                      Styles.mV2,
                    ]}>
                    <Text
                      lines={1}
                      style={[
                        styles.textRow,
                        Styles.textTransformCap,
                        {
                          fontSize: MOBILE.textSize.xxSmall,
                          color: COLORS.white,
                        },
                      ]}>
                      Receipt
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
export default OrderTable;
