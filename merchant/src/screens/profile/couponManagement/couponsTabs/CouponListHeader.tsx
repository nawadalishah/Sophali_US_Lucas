import { View, Text } from 'react-native';
import React from 'react';
import { useStyles } from './style';

const CouponListHeader = ({ headerName }: any) => {
  const styles = useStyles();
  return (
    <View style={styles.headerRow}>
      <Text style={styles.headerRowText}>Code</Text>
      <Text style={styles.headerRowText}>Title</Text>
      <Text style={styles.headerRowText}>Items</Text>
      <Text style={styles.headerRowText}>Price</Text>
      <Text style={styles.headerRowText}>
        {headerName === 'active'
          ? 'Exp. Date'
          : headerName === 'template'
            ? 'Active'
            : headerName === 'expired'
              ? 'Usage'
              : ''}
      </Text>
      <Text style={styles.headerRowText}>
        {headerName === 'template' ? 'Delete' : 'Details'}
      </Text>
    </View>
  );
};

export default CouponListHeader;
