import { all, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import {
  GET_NOTIFICATION_LIST_SAGA,
  SUBCRIBE_FCM_SAGA,
  UNSUBCRIBE_FCM_SAGA,
  ADD_NOTIFICATION_SAGA,
  READ_NOTIDICATION_SAGA,
  READ_NOTIDICATION_ALL_SAGA,
  addNotification as addNotificationAction,
  getNotificationList,
  getNotificationListSaga
} from './index';
import {
  getNotificationApi,
  subCloudMessApi,
  unSubCloudMessApi,
  seenNotification,
  seenAllNotification
} from '../../../api/notificationApi';
import { guid } from '../../../helper/util';
import { getToken } from '../auth/index';

function* getNotification(action) {
  const { agencyId } = action.payload;
  const token = yield select(getToken);
  const res = yield getNotificationApi(token, agencyId);
  if (res.data && res.data.ok) {
    const notificationList = _.get(res, 'data.data', []);
    const readed = notificationList.filter(item => item.read === true).length;
    const unreaded = notificationList.filter(item => item.read !== true).length;
    const notificationListReprocess = notificationList.map(item => ({
      ...item,
      id: `${item.id}-${guid()}`,
      seen: item.read,
      type: _.get(item, 'data.type', 'complete'),
      notificationTitle: item.title,
      notificationBody: item.body,
      productType: _.get(item, 'data.product_type', ''),
      statusDescription: moment(new Date(item.timestamp * 1000)).format(
        'HH:mm:ss DD-MM-YYYY'
      )
    }));
    yield put(getNotificationList(notificationListReprocess, readed, unreaded));
  }
}

function* subcribeCloudMessage(action) {
  const { token, agencyId } = action.payload;
  const access_token = yield select(getToken);

  yield subCloudMessApi(access_token, agencyId, token);
}

function* unSubcribeCloudMessage(action) {
  const { token, agencyId } = action.payload;
  const access_token = yield select(getToken);

  yield unSubCloudMessApi(access_token, agencyId, token);
}

function* addNotification(action) {
  const { agencyId, notification: messageBody } = action.payload;
  const notificationReprocess = {
    ...messageBody,
    id: `a1-${guid()}`,
    body: messageBody.notification.body,
    title: messageBody.notification.title,
    seen: false,
    read: false,
    type: 'warning',
    notificationTitle: messageBody.notification.title,
    notificationBody: messageBody.notification.body,
    statusDescription: moment(Date.now()).format('DD-MM-YYYY HH:mm:ss')
  };
  yield put(addNotificationAction(notificationReprocess));
  yield put(getNotificationListSaga(agencyId));
}

function* clickNotifi(action) {
  const { agencyId, timestamp } = action.payload;
  const token = yield select(getToken);

  yield seenNotification(token, agencyId, timestamp);
  yield put(getNotificationListSaga(agencyId));
}

function* readallNoti(action) {
  const { agencyId } = action.payload;
  const token = yield select(getToken);

  yield seenAllNotification(token, agencyId);
  yield put(getNotificationListSaga(agencyId));
}

export default function* notificationSagas() {
  yield all([
    takeEvery(GET_NOTIFICATION_LIST_SAGA, getNotification),
    takeEvery(SUBCRIBE_FCM_SAGA, subcribeCloudMessage),
    takeEvery(UNSUBCRIBE_FCM_SAGA, unSubcribeCloudMessage),
    takeEvery(ADD_NOTIFICATION_SAGA, addNotification),
    takeEvery(READ_NOTIDICATION_SAGA, clickNotifi),
    takeEvery(READ_NOTIDICATION_ALL_SAGA, readallNoti)
  ]);
}
