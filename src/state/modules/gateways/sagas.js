import { all, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import {
  FETCH_GATEWAY_SAGA,
  EDIT_GATEWAY_SAGA,
  ADD_GATEWAY_SAGA,
  DELETE_GATEWAY_SAGA,
  SELL_GATEWAY_SAGA,
  FETCH_ALL_GATEWAY_SAGA,
  EXTEND_TIME_GATEWAY,
  REVOKE_GATEWAY_SAGA,
  ENABLE_CALL_AGENT,
  ACTIVE_OFFICE_GATEWAY,
  UPDATE_INFO_ACTIVE_OFFICE_GATEWAY
} from './index';
import {
  enableCallAgentStart,
  enableCallAgentSuccess,
  enableCallAgentError
} from './index';
import { FETCH_GATEWAY_TYPE_SAGA } from '../products';
import {
  fetchGatewaysApi,
  updateGatewayApi,
  createGatewayApi,
  deleteGatewayApi,
  sellGatewayApi,
  fetchAllGatewaysApi,
  extendTimeApi,
  revokeGatewaysApi,
  enableAgencyPhoneApi
} from '../../../api/gatewayApi';
import {
  activeOfficeGatewayApi,
  updateInfoActiveOfficeGatewayApi
} from '../../../api/systemApi';
import { constants } from '../../../containers/ToastNotification';
import { showToast } from '../notification/index';
import { getToken } from '../auth/index';
import {
  fetchGateways,
  processedGateway,
  fetchingGateway,
  selledGateway,
  fetchAllGateways
} from './index';
import { fetchGatewaysControlSaga } from '../control';
import { seeAll } from './selector';
import { fetchGatewayTypes } from '../products/index';
import { fetchGatewayTypesApi } from '../../../api/productApi';
import { fetchAgenciesSaga, getAgencies } from '../agencies/index';
import { getRoles } from '../auth/index';
import { isPermissionAccess } from '../../../helper/permission';
import { apiHandleError } from '../../sagas/homeSagas';

const getDiffDay = end => {
  const now = moment(new Date());
  const endDate = moment(new Date(end));
  if (now.isAfter(endDate)) {
    return 'Hết hạn';
  }
  return Math.round(moment.duration(endDate.diff(now)).asDays());
};

export function* fetchGatewayTypesSaga() {
  const token = yield select(getToken);
  const gatewayTypes = yield fetchGatewayTypesApi(token, 'SGW');
  if (_.get(gatewayTypes, 'data.status') === 'success') {
    const { data } = gatewayTypes.data;
    const product_types = data.product_types;
    yield put(fetchGatewayTypes(product_types));
  } else {
    yield put(apiHandleError(gatewayTypes));
  }
}

function* fetch() {
  const seeAllStatus = yield select(seeAll);
  if (seeAllStatus) {
    yield fetchAllGatewaysSaga();
  } else {
    yield fetchGatewaysSaga();
  }
}

function* fetchGatewaysSaga(action) {
  const agencies = yield select(getAgencies);
  const roles = yield select(getRoles);
  if (!agencies.length && isPermissionAccess(roles, ['agency'])) {
    yield put(fetchAgenciesSaga());
  }
  const token = yield select(getToken);
  yield put(fetchingGateway());
  const res = yield fetchGatewaysApi(token);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const gateways = data.gateways.map(gateway => ({
      ...gateway,
      enable_call_agent: _.get(gateway, 'gateway_config.enable_call_agent'),
      name: _.get(gateway, 'gateway_config.name', '--')
    }));
    const { total } = data.meta;
    yield put(fetchGateways(gateways, total));
  } else {
    yield put(fetchGateways([], 0));
    yield put(apiHandleError(res));
  }
}

export function* fetchAllGatewaysSaga(action) {
  const agencies = yield select(getAgencies);
  const roles = yield select(getRoles);
  if (!agencies.length && isPermissionAccess(roles, ['agency'])) {
    yield put(fetchAgenciesSaga());
  }
  yield put(fetchingGateway());
  const token = yield select(getToken);
  const res = yield fetchAllGatewaysApi(token);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const gateways = data.gateways.map(gateway => ({
      ...gateway,
      endDate: _.get(gateway, 'gateway_subscription.end', ''),
      startDate: _.get(gateway, 'gateway_subscription.start', ''),
      diffEnd: getDiffDay(_.get(gateway, 'gateway_subscription.end')),
      agencyName: _.get(gateway, 'agency.name'),
      enable_call_agent: _.get(gateway, 'gateway_config.enable_call_agent', -1),
      name: _.get(gateway, 'gateway_config.name', '--')
    }));
    const { total } = data.meta;
    yield put(fetchAllGateways(gateways, total));
  } else {
    yield put(fetchAllGateways([], 0));
    yield put(apiHandleError(res));
  }
}

function* editGatewaySaga(action) {
  const { gateway } = action.payload;
  const token = yield select(getToken);
  const res = yield updateGatewayApi(token, gateway);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Cập nhật thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield put(processedGateway());
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* addGatewaySaga(action) {
  const { gateway } = action.payload;
  const token = yield select(getToken);
  const res = yield createGatewayApi(token, gateway);
  if (_.get(res, 'data.status') === 'success') {
    yield put(processedGateway());
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* deleteGatewaySaga(action) {
  const { gatewayId } = action.payload;
  const token = yield select(getToken);
  const res = yield deleteGatewayApi(token, gatewayId);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: res.data.message || 'Xoá thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* revokeGatewaySaga(action) {
  const { gatewayId } = action.payload;
  const token = yield select(getToken);
  const res = yield revokeGatewaysApi(token, gatewayId);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: res.data.message || 'Thu hồi thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* sellGatewaySaga(action) {
  const { payload } = action;
  const token = yield select(getToken);
  const res = yield sellGatewayApi(token, payload);
  if (_.get(res, 'data.status') === 'success') {
    yield put(selledGateway());
    yield fetch();
  } else {
    const toast = {
      message: res.data.message || 'Xảy ra lỗi',
      action: 'Dismiss',
      type: constants.ERROR
    };
    yield put(showToast(toast));
  }
}

function* fetchGatewayTypeID(action) {
  const token = yield select(getToken);
  const gatewayTypes = yield fetchGatewayTypesApi(token, 'SGW');
  if (_.get(gatewayTypes, 'data.status') === 'success') {
    const { data } = gatewayTypes.data;
    const product_types = data.product_types;
    yield put(fetchGatewayTypes(product_types));
  } else {
    yield put(apiHandleError(gatewayTypes));
  }
}

function* extendTimeGateway(action) {
  const { gatewayId } = action.payload;
  const token = yield select(getToken);
  const res = yield extendTimeApi(token, gatewayId);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: res.data.message || 'Gia hạn thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
  } else {
    const toast = {
      message: res.data.message || 'Xảy ra lỗi',
      action: 'Dismiss',
      type: constants.ERROR
    };
    yield put(showToast(toast));
  }
}

function* enableCallAgentSaga(action) {
  yield put(enableCallAgentStart());
  const token = yield select(getToken);
  const { gatewayId, status } = action.payload;
  const res = yield enableAgencyPhoneApi(token, gatewayId, status);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: res.data.message || 'Chuyển đổi thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield put(enableCallAgentSuccess());
    yield fetch();
    yield put(
      fetchGatewaysControlSaga({
        product_type_id: -1,
        agency_id: -1,
        agency_childen_ids: []
      })
    );
  } else {
    const toast = {
      message: res.data.message || 'Xảy ra lỗi',
      action: 'Dismiss',
      type: constants.ERROR
    };
    yield put(showToast(toast));
    yield put(enableCallAgentError());
  }
}

function* activeOfficeGatewaySaga(action) {
  const token = yield select(getToken);
  const { agencyId, data } = action.payload;
  const res = yield activeOfficeGatewayApi(token, agencyId, data);
  if (_.get(res, 'data.ok') === true) {
    const toast = {
      message: 'Kích hoạt thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
  } else {
    const toast = {
      message: _.get(res, 'data.error', 'Xảy ra lỗi'),
      action: 'Dismiss',
      type: constants.ERROR
    };
    yield put(showToast(toast));
    yield fetch();
  }
}

function* updateInfoActiveOfficeGatewaySaga(action) {
  const token = yield select(getToken);
  const { agencyId, gatewayId, data } = action.payload;
  const res = yield updateInfoActiveOfficeGatewayApi(
    token,
    agencyId,
    gatewayId,
    data
  );
  if (_.get(res, 'data.ok') === true) {
    const toast = {
      message: 'Cập nhật thông tin hoạt thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
    yield put(
      fetchGatewaysControlSaga({
        product_type_id: -1,
        agency_id: -1,
        agency_childen_ids: []
      })
    );
  } else {
    const toast = {
      message: _.get(res, 'data.error', 'Xảy ra lỗi'),
      action: 'Dismiss',
      type: constants.ERROR
    };
    yield put(showToast(toast));
    yield fetch();
  }
}

export default function* agenciesSagas() {
  yield all([
    takeEvery(FETCH_GATEWAY_SAGA, fetchGatewaysSaga),
    takeEvery(EDIT_GATEWAY_SAGA, editGatewaySaga),
    takeEvery(ADD_GATEWAY_SAGA, addGatewaySaga),
    takeEvery(DELETE_GATEWAY_SAGA, deleteGatewaySaga),
    takeEvery(REVOKE_GATEWAY_SAGA, revokeGatewaySaga),
    takeEvery(SELL_GATEWAY_SAGA, sellGatewaySaga),
    takeEvery(FETCH_GATEWAY_TYPE_SAGA, fetchGatewayTypeID),
    takeEvery(FETCH_ALL_GATEWAY_SAGA, fetchAllGatewaysSaga),
    takeEvery(EXTEND_TIME_GATEWAY, extendTimeGateway),
    takeEvery(ENABLE_CALL_AGENT, enableCallAgentSaga),
    takeEvery(ACTIVE_OFFICE_GATEWAY, activeOfficeGatewaySaga),
    takeEvery(
      UPDATE_INFO_ACTIVE_OFFICE_GATEWAY,
      updateInfoActiveOfficeGatewaySaga
    )
  ]);
}
