import { TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react';
import { COLORS, Text } from '../../../constants';
import TimerTick from '../../../components/TimerTick';
import Scroller from '../../../components/Scroller';
import { generateRandomKey } from '../../../utils';
import Styles from '../../../utils/styles';
import { scaleSize } from '../../../utils/mixins/index';
import { FONT_FAMILY, WEIGHT } from '../../../constants/theme';

export default function OrderList(props: any) {
  const {
    data = [],
    favorite,
    setView,
    acceptOrder,
    handleDetailsClick,
    setLoadingState,
    orderPrepared,
    openRejectionModal,
    toggleOrderDetailModal,
    setPickUp,
    setPickedUpOrder,
    cancelOrder,
  } = props;

  return (
    <Scroller
      data={data}
      style={[Styles.mT10]}
      contentContainerStyle={[Styles.w100, Styles.pH10]}
      renderItem={({ item, index }: any) => (
        <View key={generateRandomKey(item, index)} style={styles.cardContainer}>
          <View
            style={[
              Styles.flexDirectionRow,
              Styles.justifyContentSpaceBetween,
            ]}>
            <View style={[Styles.flexDirectionColumn, Styles.w60]}>
              <OrderItemRow
                label={favorite === 'trans' ? 'T_IDs' : 'Order #'}
                value={
                  favorite === 'trans'
                    ? +item?.custom_id || 'N/A'
                    : (item && item?.reference_number) || ''
                }
              />

              <OrderItemRow
                label={'Customer Name'}
                value={item && item?.User?.screenName}
                style={[Styles.mT5]}
              />

              <OrderItemRow
                label={'Instructions'}
                value={item?.special_instructions?.length > 0 ? 'Yes' : 'No'}
                style={[Styles.mT5]}
              />
            </View>
            <View
              style={[
                Styles.flexDirectionColumn,
                Styles.w50,
                Styles.alignItemsStart,
              ]}>
              <OrderItemRow
                label={'Time'}
                value={`${item.total_time_in_minutes} mins`}
              />
              <OrderItemRow
                label={'Price'}
                value={`$${item?.amount_cad || 0}`}
                style={[Styles.mT5]}
              />
              <View
                style={[
                  Styles.flexDirectionRow,
                  Styles.mT5,
                  item.status === 'preparing' && Styles.flexDirectionColumn,
                ]}>
                <Text>Status:</Text>
                {item.status && item.status != 'new' ? (
                  <>
                    {item.status === 'prepared' ||
                    item.status === 'closed' ||
                    item.status === 'cancelled' ? (
                      <View style={[Styles.flexDirectionRow]}>
                        <Text
                          style={{
                            textTransform: 'capitalize',

                            //
                            color:
                              item.status == 'cancelled'
                                ? COLORS.black
                                : item.collected_color,
                          }}
                          lines={1}>
                          {item.status == 'cancelled'
                            ? 'Rejected'
                            : item.status.toUpperCase()}
                        </Text>
                      </View>
                    ) : (
                      item.status === 'preparing' && <TimerTick item={item} />
                    )}
                  </>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={[Styles.pL5, Styles.textTransformCap]}
                      lines={1}
                      color={
                        item.status == 'cancelled'
                          ? COLORS.black
                          : item.collected_color
                      }>
                      {item.status == 'cancelled' ? 'Rejected' : item.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View
            style={[
              Styles.w100,
              Styles.flexDirectionRow,
              Styles.justifyContentCenter,
              Styles.mT5,
            ]}>
            {item.status !== 'closed' ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  {item.status === 'new' ? (
                    <>
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            item.status == 'new' || item.status == 'closed'
                              ? COLORS.green
                              : COLORS.gray,
                          borderRadius: 30,
                          padding: 5,
                          marginLeft: 5,

                          // marginHorizontal: 5,
                        }}
                        onPress={async () => {
                          item.viewed = true;
                          setLoadingState(true);
                          await handleDetailsClick(item);
                          await setView(true);
                          setLoadingState(false);
                          toggleOrderDetailModal();
                        }}>
                        <Text
                          style={{
                            textTransform: 'capitalize',
                            color: COLORS.white,
                            paddingRight: 10,
                            paddingLeft: 10,
                          }}
                          lines={1}>
                          View
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={favorite === 'trans' ? true : !item?.viewed}
                        style={{
                          backgroundColor:
                            item?.product_order_type === 'Transfer'
                              ? 'grey'
                              : (item?.status === 'new' ||
                                    item?.status === 'closed') &&
                                  item?.viewed
                                ? COLORS.green
                                : 'grey',
                          borderRadius: 30,
                          marginLeft: 5,
                          padding: 5,
                        }}
                        onPress={() => acceptOrder(item)}>
                        <Text
                          style={[Styles.pH10]}
                          lines={1}
                          color={COLORS.white}>
                          {item.status == 'new' ? 'Accept' : null}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        // disabled={true}
                        style={{
                          borderRadius: 30,
                          marginLeft: 5,
                          padding: 5,
                          backgroundColor:
                            item.status == 'new' ? 'grey' : COLORS.green,
                        }}
                        disabled={item.status == 'new'}
                        onPress={() => orderPrepared(item)}>
                        <Text
                          style={[Styles.pH10]}
                          lines={1}
                          color={COLORS.white}>
                          Alert
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : item.status == 'preparing' ? (
                    <>
                      <TouchableOpacity
                        // disabled={true}
                        style={{
                          backgroundColor:
                            item.status == 'new' || item.status == 'closed'
                              ? COLORS.green
                              : COLORS.gray,
                          borderRadius: 30,
                          padding: 5,
                          marginLeft: 5,
                        }}
                        onPress={async () => {
                          item.viewed = true;
                          setLoadingState(true);
                          await handleDetailsClick(item);
                          await setView(true);
                          setLoadingState(false);
                        }}>
                        <Text
                          style={[Styles.pH10]}
                          lines={1}
                          color={COLORS.white}>
                          View
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: COLORS.green,
                          borderRadius: 30,
                          padding: 5,
                          marginLeft: 5,
                        }}
                        onPress={() => orderPrepared(item)}>
                        <Text
                          style={[Styles.pH10]}
                          lines={1}
                          color={COLORS.white}>
                          Alert
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : item.status == 'cancelled' ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.carrot,
                        borderRadius: 30,
                        padding: 5,
                        marginLeft: 5,
                      }}
                      onPress={() => openRejectionModal(item)}>
                      <Text
                        style={[Styles.pH10]}
                        lines={1}
                        color={COLORS.white}>
                        {item.status == 'cancelled' ? ' Alert' : ''}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {item.status != 'cancelled' && item.status !== 'prepared' ? (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      // disabled={true}
                      style={{
                        backgroundColor: COLORS.carrot,
                        borderRadius: 30,
                        marginLeft: 5,
                        padding: 5,
                      }}
                      onPress={() => cancelOrder(item)}>
                      <Text
                        style={[Styles.pH10]}
                        lines={1}
                        color={COLORS.white}>
                        {item.status != 'cancelled' ? ' Reject' : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : item.status == 'prepared' ? (
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.green,
                        borderRadius: 30,
                        marginLeft: 5,
                        padding: 5,
                      }}
                      onPress={() => {
                        setPickUp(true);
                        setPickedUpOrder(item);
                      }}>
                      <Text
                        style={[Styles.pH10]}
                        lines={1}
                        color={COLORS.white}>
                        Pick Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.green,
                      borderRadius: 30,
                      marginLeft: 5,
                      padding: 5,
                    }}
                    onPress={() => {
                      item.viewed = true;
                      handleDetailsClick(item);
                      setView(true);
                    }}>
                    <Text style={[Styles.pH10]} lines={1} color={COLORS.white}>
                      Receipt
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    />
  );
}

const OrderItemRow = ({ label, value, style }: any) => (
  <View style={[Styles.flexDirectionRow, style]}>
    <Text lines={1}>{label}:</Text>
    <Text
      lines={1}
      weight={WEIGHT.w600}
      fontFamily={FONT_FAMILY.SEMI_BOLD}
      style={[Styles.mL5]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.black,
    paddingVertical: 10,
    backgroundColor: COLORS.gray,
  },

  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: scaleSize(10),
    marginBottom: scaleSize(10),
    padding: scaleSize(10),
    elevation: 5,
    ...Styles.flexDirectionColumn,
    ...Styles.w100,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  evenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  oddRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerCellDouble: {
    flex: 2,
    fontWeight: 'bold',
  },
  headerCellTriple: {
    flex: 3,
    fontWeight: 'bold',
  },
  cellWrapperDouble: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  cellWrapperTriple: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  selectContainer: {
    width: '100%',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  col: {
    width: '25%', // Assuming 4 columns
  },
  strong: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
  },
  buttonText: {
    color: 'white',
  },
  orderSummary: {
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'lightgrey',
    paddingVertical: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  orderSummaryContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchBar: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
});
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
