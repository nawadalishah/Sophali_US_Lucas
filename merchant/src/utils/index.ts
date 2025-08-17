import _ from 'lodash';
import Pusher from 'pusher-js';

export const generateRandomKey = (item: any, index: any) =>
  (
    (item?.id || item?._id || Math.random().toString(36).substring(2, 10)) +
    _.uniqueId() +
    index
  ).toString();

export const generateRandomId = () => {
  const min = 1000;
  const max = 9999;
  const randomID = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomID.toString();
};

const PUSHER_APP_KEY = 'd25a6a9053d2a026b528';
const PUSHER_APP_CLUSTER = 'ap2';

export const pusherEventHandler = (id: any, handle = () => {}) => {
  const pusher = new Pusher(PUSHER_APP_KEY, {
    cluster: PUSHER_APP_CLUSTER,
  });

  const channel = pusher.subscribe('merchant');
  channel.bind(`count-${id}`, () => {
    handle();
  });

  return () => {
    channel.unbind_all();
    channel.unsubscribe();
    pusher.disconnect();
  };
};
