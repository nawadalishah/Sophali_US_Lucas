/* eslint-disable react/jsx-no-useless-fragment */
import React, { useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { COLORS } from '../constants';
import { generateRandomKey } from '../utils';
import Styles from '../utils/styles';

const Scroller = ({
  data = [],
  loader = false,
  loadMoreResults = () => {},
  listFooterComponent = () => {},
  listEmptyComponent = () => {},
  listHeaderComponent = () => {},
  renderItem = () => {},
  horizontal = false,
  style = {},
  contentContainerStyle = {},
  bounces = true,
  col = 1,
  refreshing = false,
  onRefresh = () => {},
  windowSize = 100,
  nestedScrollEnabled = false,
}) => {
  const ScrollMemo = useMemo(
    () => (
      <FlatList
        data={data}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.green]}
            tintColor={COLORS.green}
            progressViewOffset={10}
          />
        }
        nestedScrollEnabled={nestedScrollEnabled}
        horizontal={horizontal}
        bounces={bounces}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        windowSize={windowSize}
        numColumns={col}
        style={[Styles.flex, style]}
        contentContainerStyle={[Styles.flexGrow, contentContainerStyle]}
        keyExtractor={(item, index) => generateRandomKey(item, index)}
        listKey={(item, index) => generateRandomKey(item, index)}
        extraData={loader}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          loadMoreResults && loadMoreResults();
        }}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        ListEmptyComponent={listEmptyComponent && listEmptyComponent}
        ListFooterComponent={listFooterComponent && listFooterComponent}
        ListHeaderComponent={listHeaderComponent && listHeaderComponent}
        swipeThreshold={0.01}
        removeClippedSubviews
        renderItem={renderItem}
      />
    ),
    [
      data,
      refreshing,
      onRefresh,
      horizontal,
      bounces,
      col,
      style,
      contentContainerStyle,
      loader,
      listEmptyComponent,
      listFooterComponent,
      listHeaderComponent,
      renderItem,
      loadMoreResults,
      windowSize,
      nestedScrollEnabled,
    ],
  );

  return <>{ScrollMemo}</>;
};

export default Scroller;
