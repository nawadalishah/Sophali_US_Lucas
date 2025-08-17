import { COLORS } from '../../../constants';

export const fetchTransactionStatus = (status = '') =>
  status === 'active'
    ? 'completed'
    : status == 'inactive'
      ? 'rejected'
      : status;

export const isRejected = (status = '') => !!(status == 'inactive');
export const fetchTransactionType = (status = '') =>
  status === 'order_payment'
    ? 'Order'
    : status == 'withdrawal'
      ? 'withdrawal'
      : status;

export const fetchTransactionTypeColor = (status = '') =>
  status == 'withdrawal'
    ? COLORS.redShade
    : status == 'subscription'
      ? COLORS.reddish
      : COLORS.black;
