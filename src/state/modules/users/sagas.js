import { all, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import {
  FETCH_USER_SAGA,
  EDIT_USER_SAGA,
  ADD_USER_SAGA,
  DELETE_USER_SAGA,
  CHANGE_PASSWORD_SAGA,
  FETCH_APP_USER_SAGA
} from './index';
import {
  fetchAllUsersApi,
  updateUserApi,
  createUserApi,
  deleteUserApi,
  changePasswordApi,
  appUserListApi
} from '../../../api/userListApi';
import { constants } from '../../../containers/ToastNotification';
import { showToast } from '../notification/index';
import { getToken, getRoles } from '../auth/index';
import { apiHandleError } from '../../sagas/homeSagas';
import {
  fetchUser,
  processedUser,
  fetchingUser,
  fetchAppUser,
  fetchingAppUser
} from './index';
import { updateInfoUserSaga } from '../auth';
import { isPermissionAccess } from '../../../helper/permission';

function* fetchUsersSaga(action) {
  yield put(fetchingUser());
  const token = yield select(getToken);
  const res = yield fetchAllUsersApi(token);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const account = data.users;
    const { total } = data.meta;
    yield put(fetchUser(account, total));
  } else {
    yield put(apiHandleError(res));
  }
}

function* editUserSaga(action) {
  const { user, fromUserWidget } = action.payload;
  const token = yield select(getToken);
  const res = yield updateUserApi(token, user);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Cập nhật thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    if (!fromUserWidget) {
      yield fetchUsersSaga();
    } else {
      yield put(updateInfoUserSaga(user.id));
    }
    yield put(processedUser());
  } else {
    yield put(apiHandleError(res));
  }
}

function* addUserSaga(action) {
  const { user } = action.payload;
  const token = yield select(getToken);
  const res = yield createUserApi(token, user);
  if (_.get(res, 'data.status') === 'success') {
    yield fetchUsersSaga();
    yield put(processedUser());
  } else {
    yield put(apiHandleError(res));
  }
}

function* deleteUSerSaga(action) {
  const { userId } = action.payload;
  const token = yield select(getToken);
  const res = yield deleteUserApi(token, userId);
  if (_.get(res, 'data.status') === 'success') {
    yield fetchUsersSaga();
  } else {
    yield put(apiHandleError(res));
  }
}

function* changePasswordSaga(action) {
  const { user } = action.payload;
  const token = yield select(getToken);
  const res = yield changePasswordApi(token, user);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Cập nhật thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
  } else {
    yield put(apiHandleError(res));
  }
}

function* fetchAppUserSaga(action) {
  yield put(fetchingAppUser());
  const token = yield select(getToken);
  const roles = yield select(getRoles);
  if (isPermissionAccess(roles, ['user_app'])) {
    const res = yield appUserListApi(token);
    if (_.get(res, 'data.status') === 'success') {
      const { data } = res.data;
      const account = data.users;
      const { total } = data.meta;
      yield put(fetchAppUser(account, total));
    } else {
      yield put(fetchAppUser([], 0));
      yield put(apiHandleError(res));
    }
  }
}
export default function* usersSagas() {
  yield all([
    takeEvery(FETCH_USER_SAGA, fetchUsersSaga),
    takeEvery(EDIT_USER_SAGA, editUserSaga),
    takeEvery(ADD_USER_SAGA, addUserSaga),
    takeEvery(DELETE_USER_SAGA, deleteUSerSaga),
    takeEvery(CHANGE_PASSWORD_SAGA, changePasswordSaga),
    takeEvery(FETCH_APP_USER_SAGA, fetchAppUserSaga)
  ]);
}
