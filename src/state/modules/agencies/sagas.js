import { all, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import {
  FETCH_AGENCY_SAGA,
  EDIT_AGENCY_SAGA,
  ADD_AGENCY_SAGA,
  DELETE_AGENCY_SAGA,
  RESET_PASSWORD
} from './index';
import {
  fetchAgenciesApi,
  updateAgencyApi,
  createAgencyApi,
  deleteAgencyApi,
  resetAgencyPassword
} from '../../../api/agencyApi';
import { constants } from '../../../containers/ToastNotification';
import { showToast } from '../notification/index';
import { getToken } from '../auth/index';
import { fetchAgency, processedAgency, fetchingAgency } from './index';
import { apiHandleError } from '../../sagas/homeSagas';
import { updateInfoAgencySaga } from '../auth';

function* fetchAgenciesSaga(action) {
  yield put(fetchingAgency());
  const token = yield select(getToken);
  const res = yield fetchAgenciesApi(token);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const agencies = data.agencies.map(agency => ({
      ...agency,
      useCustomDomain:
        !_.isNil(agency.agency_information) &&
        !_.isEmpty(agency.agency_information),
      userNameMng: _.get(agency, ['users', 0, 'username'], '--'),
      nameMng: _.get(agency, ['users', 0, 'name'], '--'),
      phoneMng: _.get(agency, ['users', 0, 'phone'], '--')
    }));
    const { total } = data.meta;
    yield put(fetchAgency(agencies, total));
  } else {
    yield put(fetchAgency([], 0));
    yield put(apiHandleError(res));
  }
}

function* editAgencySaga(action) {
  const { agency, fromUserWidget } = action.payload;
  const token = yield select(getToken);
  const res = yield updateAgencyApi(token, agency);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Cập nhật thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    if (!fromUserWidget) {
      yield fetchAgenciesSaga();
    } else {
      yield put(updateInfoAgencySaga(agency.id));
    }
    yield put(processedAgency());
  } else {
    yield put(apiHandleError(res));
  }
}

function* addAgencySaga(action) {
  const { agency } = action.payload;
  const token = yield select(getToken);
  const res = yield createAgencyApi(token, agency);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Thêm đại lý thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield put(processedAgency());
    yield fetchAgenciesSaga();
  } else {
    yield put(apiHandleError(res));
  }
}

function* deleteUSerSaga(action) {
  const { agencyId } = action.payload;
  const token = yield select(getToken);
  const res = yield deleteAgencyApi(token, agencyId);
  if (_.get(res, 'data.status') === 'success') {
    yield fetchAgenciesSaga();
  } else {
    yield put(apiHandleError(res));
  }
}

function* resetPasswordSagas(action) {
  const { agencyId, newPassword } = action.payload;
  const token = yield select(getToken);
  const res = yield resetAgencyPassword(token, agencyId, newPassword);
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

export default function* agenciesSagas() {
  yield all([
    takeEvery(FETCH_AGENCY_SAGA, fetchAgenciesSaga),
    takeEvery(EDIT_AGENCY_SAGA, editAgencySaga),
    takeEvery(ADD_AGENCY_SAGA, addAgencySaga),
    takeEvery(DELETE_AGENCY_SAGA, deleteUSerSaga),
    takeEvery(RESET_PASSWORD, resetPasswordSagas)
  ]);
}
