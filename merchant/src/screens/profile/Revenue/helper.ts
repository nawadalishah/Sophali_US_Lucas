export const fetchTransactionStatus = (status = '') =>
  status === 'active'
    ? 'completed'
    : status == 'inactive'
      ? 'rejected'
      : status;

export const isRejected = (status = '') => !!(status == 'inactive');
