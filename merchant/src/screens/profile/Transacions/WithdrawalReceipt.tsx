/* eslint-disable @typescript-eslint/no-use-before-define */
import { SafeAreaView, ScrollView, View } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../../../components';
import { AndroidSafeArea } from '../../../constants';
import Styles from '../../../utils/styles';
import { useStyles } from './styles';
import { convertTime } from '../../../utils/helpers';
import LabelView from '../../../components/LabelView';

const WithdrawalReceipt = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item }: any = route.params;
  const styles = useStyles();

  function getTime(date: any, isTime = false) {
    if (isTime) {
      const newDate = new Date(date).getTime();
      return `${new Date(newDate).getHours()} : ${new Date(
        newDate,
      ).getMinutes()} : ${new Date(newDate).getSeconds()} sec`;
    } else {
      const newDate = new Date(date).getTime();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const month = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ];
      const monthName = month[new Date(newDate).getMonth()];
      const dayName = days[new Date(newDate).getDay()];
      return `${dayName} , ${monthName} ${new Date(
        newDate,
      ).getDate()}, ${new Date(newDate).getFullYear()}`;
    }
  }
  function renderHeader() {
    return <Header title={'Receipt'} onPress={() => navigation.goBack()} />;
  }
  const renderContent = () => (
    <View style={[Styles.flex]}>
      <ScrollView
        contentContainerStyle={Styles.flexGrow}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.containerStyle]}>
          <View style={[styles.receiptContainerStyle]}>
            <LabelView
              label={'Transfer ID'}
              value={`${item?.transferId || '-'}`}
            />
            <LabelView
              label={'Withdrawal Date'}
              value={`${getTime(item?.createdAt)}`}
            />
            <LabelView
              label={'Withdrawal Time'}
              value={`${convertTime(item?.createdAt)}`}
            />

            <LabelView label={'Merchant ID'} value={`M_${item?.merchant_id}`} />
            <LabelView
              label={'Merchant Name'}
              value={`${item?.Merchant?.company_name || ''}`}
            />

            <LabelView
              label={'Withdrawal Amount'}
              value={`$${parseFloat(item?.amount_cad || 0).toFixed(2)}`}
            />

            <LabelView
              label={'Sophali fee '}
              value={`$${parseFloat(item?.sophali_fee || 0).toFixed(2)}`}
            />
            <LabelView
              label={'Total Amount '}
              value={`$${parseFloat(item?.amount_usd || 0).toFixed(2)}`}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={{ ...AndroidSafeArea.AndroidSafeArea }}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default WithdrawalReceipt;
