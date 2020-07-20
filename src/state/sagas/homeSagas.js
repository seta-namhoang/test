import { all, put, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import { constants } from '../../containers/ToastNotification';
import { showToast } from '../modules/notification/index';
import { logoutSaga } from '../modules/auth/sagas';

export const API_ERROR_HANDLE = 'API_ERROR_HANDLE';
export const apiHandleError = data => ({
  type: API_ERROR_HANDLE,
  payload: {
    data
  }
});

function* apiHandleErrorSaga(action) {
  const { data } = action.payload;
  const messageFromAPI = _.get(data, 'data.message');
  const code = _.get(data, 'data.code');
  const message = code !== 'SS103' ? messageFromAPI : 'Phiên đăng nhập hết hạn';
  const toast = {
    message: message || 'Đã có lỗi xảy ra',
    action: 'Dismiss',
    type: constants.ERROR
  };
  yield put(showToast(toast));
  if (code === 'SS103') {
    yield logoutSaga();
  }
}
export default function* homeSaga() {
  yield all([takeEvery(API_ERROR_HANDLE, apiHandleErrorSaga)]);
}
