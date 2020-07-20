import { all, put, takeEvery, select, call } from 'redux-saga/effects';
import _ from 'lodash';
import { delay } from 'redux-saga';

import {
  LOGIN_SAGA,
  CHECK_LOGIN,
  LOGOUT_SAGA,
  UPDATE_AGENCY_SAGA,
  UPDATE_USER_SAGA
} from './index';
import { loginApi } from '../../../api/userApi';
import { fetchUserApi } from '../../../api/userListApi';
import { fetchAgencyApi } from '../../../api/agencyApi';
import { constants } from '../../../containers/ToastNotification';
import { showToast } from '../notification/index';
import {
  loadedLogin,
  logout,
  loadingLogin,
  errorLogin,
  updateInfoUser,
  updateInfoAgency
} from './index';
import { ROUTE_CONTROL } from '../routing';
import {
  refreshUserToken as refreshUserTokenApi,
  getCurrentUser as getCurrentUserApi
} from '../../../api/userListApi';
import { getToken /* getRefreshToken */ } from '../auth/index';
import { apiHandleError } from '../../sagas/homeSagas';

function* loginSaga(action) {
  yield put(loadingLogin());
  yield call(delay, 1000);
  const { username, password } = action.payload;
  const user = {
    username: username,
    password
  };
  const res = yield loginApi(user);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Đăng nhập thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    const { data } = res.data;
    const { user } = data;
    yield put(showToast(toast));
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem(
      'time_expired',
      new Date().getTime() + data.expires_in * 1000
    );
    const agencyRes = yield fetchAgencyApi(data.access_token, user.agency_id);
    const agency =
      _.get(agencyRes, 'data.status') === 'success'
        ? _.get(agencyRes, 'data.data.agency')
        : [];
    yield put(
      loadedLogin({
        ...data,
        user,
        agency,
        roles: user.roles
      })
    );
    yield put({ type: ROUTE_CONTROL });
  } else {
    const toast = {
      message: res.data.message || 'Đăng nhập không thành công',
      action: 'Dismiss',
      type: constants.ERROR
    };
    yield put(
      errorLogin({
        OAuthErrorDescription: res.data.message
      })
    );
    yield put(showToast(toast));
  }
}

function* checkLoginSaga(action) {
  yield put(loadingLogin());
  const tokenLocal = localStorage.getItem('access_token');
  const refreshTokenLocal = localStorage.getItem('refresh_token');
  const timeExpired = parseInt(localStorage.getItem('time_expired'));
  const currentTime = new Date().getTime();
  // const refresh_token = yield select(getRefreshToken);
  if (!tokenLocal || (timeExpired && currentTime > timeExpired)) {
    yield logoutSaga();
  } else {
    const currentUser = yield getCurrentUserApi(tokenLocal);
    // yield refreshUserToken(tokenLocal);
    if (_.get(currentUser, 'data.status', '') === 'success') {
      const { data } = currentUser.data;
      const { user } = data;
      const agencyRes = yield fetchAgencyApi(tokenLocal, user.agency_id);
      const agency =
        _.get(agencyRes, 'data.status') === 'success'
          ? _.get(agencyRes, 'data.data.agency')
          : [];
      yield put(
        loadedLogin({
          access_token: tokenLocal,
          refresh_token: refreshTokenLocal,
          user,
          roles: user.roles,
          agency
        })
      );
    } else {
      const toast = {
        message: currentUser.data.message || 'Có lỗi xảy ra.',
        action: 'Dismiss',
        type: constants.ERROR
      };
      yield put(showToast(toast));
      yield logoutSaga();
    }
  }
  if (timeExpired - currentTime < 60 * 1000) {
    const access_token = yield select(getToken);
    yield refreshUserToken(access_token);
  }
  if (currentTime > timeExpired) {
    const toast = {
      message: 'Phiên đăng nhập hết hạn',
      action: 'Dismiss',
      type: constants.ERROR
    };
    yield put(showToast(toast));
  }
}

function* refreshUserToken(token) {
  const res = yield refreshUserTokenApi(token);
  if (_.get(res, 'data.status') === 'success') {
    localStorage.setItem('time_expired', new Date().getTime() + 600000);
  }
}

export function* updateMainUserSaga(action) {
  const { userId } = action.payload;
  const token = yield select(getToken);
  const res = yield fetchUserApi(token, userId);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Cập nhật thông tin thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    const { data } = res.data;
    const { user } = data;
    yield put(showToast(toast));
    yield put(updateInfoUser(user));
  } else {
    yield put(apiHandleError(res));
  }
}

export function* updateMainAgencySaga(action) {
  const { agencyId } = action.payload;
  const token = yield select(getToken);
  const res = yield fetchAgencyApi(token, agencyId);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Cập nhật thông tin thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    const { data } = res.data;
    const { agency } = data;
    yield put(showToast(toast));
    yield put(updateInfoAgency(agency));
  } else {
    yield put(apiHandleError(res));
  }
}

export function* logoutSaga(action) {
  yield put(loadingLogin());
  yield call(delay, 1000);
  localStorage.removeItem('access_token');
  localStorage.removeItem('time_expired');
  localStorage.removeItem('refresh_token');
  yield put(logout());
  yield put({
    type: 'route/ROUTE_LOGIN'
  });
  if (_.get(action, 'payload.fromApp')) {
    window.location.reload();
  }
}

export default function* auth() {
  yield all([
    takeEvery(LOGIN_SAGA, loginSaga),
    takeEvery(CHECK_LOGIN, checkLoginSaga),
    takeEvery(LOGOUT_SAGA, logoutSaga),
    takeEvery(UPDATE_AGENCY_SAGA, updateMainAgencySaga),
    takeEvery(UPDATE_USER_SAGA, updateMainUserSaga)
  ]);
}
