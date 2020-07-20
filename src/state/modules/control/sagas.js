import { all, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import {
  FETCH_GATEWAYS_CONTROL_SAGA,
  FETCH_GATEWAY_CONTROL_SAGA,
  gwStatus,
  TURN_OFF_ALERT,
  ENABLE_CALL_PREMIUM_AGENT,
  UPDATE_PREMIUM_AGENT_PHONE,
  GET_GATEWAY_LOGS,
  PING_NODE
} from './index';
import {
  fetchGatewaysControl,
  fetchGatewayControl,
  processedGatewayControl,
  fetchGatewaysControlSaga,
  getGatewaySuccess
} from './index';
import {
  fetchGatewaysControllerApi,
  fetchGatewayControllerApi
} from '../../../api/controlApi';
import {
  enableCallPremiumAgent,
  updatePremiumAgentPhone
} from '../../../api/gatewayApi';
import { pingNodeApi } from '../../../api/systemApi';
import {
  handleAlertApi,
  getGatewayLogsApi
} from '../../../api/notificationApi';
import { getToken } from '../auth/index';
import { apiHandleError } from '../../sagas/homeSagas';
import { constants } from '../../../containers/ToastNotification';
import { showToast } from '../notification/index';

function getGWStatus(item) {
  const state = JSON.parse(_.get(item, 'state', '{}')) || {};
  const now = new moment(Date.now());
  if (!state.timestamp) {
    return 4;
  }
  const before = new moment(new Date(state.timestamp * 1000));
  const duration = moment.duration(now.diff(before));
  const durationInMinutes = duration.as('minutes');
  const nodes = _.get(item, 'nodes', []).map(node => {
    const nodeState = JSON.parse(_.get(node, 'state', '{}')) || {};
    const beforeInNode = new moment(new Date(nodeState.timestamp * 1000));
    const durationInNode = moment.duration(now.diff(beforeInNode));
    const durationNodeInMinutes = durationInNode.as('minutes');
    return {
      ...node,
      nodeStatus:
        !nodeState.timestamp || durationNodeInMinutes > 130 || !nodeState.status
          ? 'Mất kết nối'
          : 'Hoạt động'
    };
  });
  const disconnectNodes = nodes.filter(
    node => node.nodeStatus === 'Mất kết nối'
  );
  if (durationInMinutes > 10) {
    // for gateway status
    return 4;
  }
  if (item.alert === 1) {
    // for alert gateway
    return 2;
  }
  if (disconnectNodes.length > 0) {
    // for disconnect node
    return 3;
  }
  return 1;
}

function* getGatewaysControlSaga(action) {
  const token = yield select(getToken);
  const { product_type_id, agency_id, agency_childen_ids } = action.payload;
  const res = yield fetchGatewaysControllerApi(token, {
    product_type_id,
    agency_id,
    agency_childen_ids
  });
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const gateways = data.gateways || [];
    const gatewaysProcess = gateways.map(item => {
      const status = getGWStatus(item);
      return {
        ...item,
        gatewayStatus: gwStatus[status],
        gatewayStatusId: status
      };
    });
    const { total } = data.meta;
    const activeLength = gatewaysProcess.filter(gw => gw.gatewayStatusId === 1)
      .length;
    const alertLength = gatewaysProcess.filter(gw => gw.gatewayStatusId === 2)
      .length;
    const nodeErrorLength = gatewaysProcess.filter(
      gw => gw.gatewayStatusId === 3
    ).length;
    const disconnectLength = gatewaysProcess.filter(
      gw => gw.gatewayStatusId === 4
    ).length;
    yield put(
      fetchGatewaysControl(
        gatewaysProcess,
        total,
        activeLength,
        alertLength,
        nodeErrorLength,
        disconnectLength
      )
    );
  } else {
    yield put(fetchGatewaysControl([], 0));
    yield put(apiHandleError(res));
  }
}

function* getGatewayControlSaga(action) {
  const token = yield select(getToken);
  const { gatewayId } = action.payload;
  const res = yield fetchGatewayControllerApi(token, gatewayId);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const gateway = data.gateway || [];
    yield put(fetchGatewayControl(gateway));
  } else {
    yield put(fetchGatewayControl([], 0));
    yield put(apiHandleError(res));
  }
  yield put(processedGatewayControl());
}

function* turnOffAlertSaga(action) {
  const token = yield select(getToken);
  const { gatewayImei, agencyId } = action.payload;
  const res = yield handleAlertApi(token, agencyId, gatewayImei);
  if (_.get(res, 'data.ok')) {
    yield put(
      fetchGatewaysControlSaga({
        product_type_id: -1,
        agency_id: -1,
        agency_childen_ids: []
      })
    );
  } else {
    yield put(apiHandleError(res));
  }
}

function* enableCallPremiumAgentSaga(action) {
  const token = yield select(getToken);
  const { gatewayId, enable_call_premium_agent } = action.payload;
  const res = yield enableCallPremiumAgent(
    token,
    gatewayId,
    enable_call_premium_agent
  );
  if (_.get(res, 'data.status') === 'success') {
    yield put(
      fetchGatewaysControlSaga({
        product_type_id: -1,
        agency_id: -1,
        agency_childen_ids: []
      })
    );
  } else {
    yield put(apiHandleError(res));
  }
}

function* updatePremiumAgentPhoneSaga(action) {
  const token = yield select(getToken);
  const { gatewayId, phones } = action.payload;
  const res = yield updatePremiumAgentPhone(token, gatewayId, phones);
  if (_.get(res, 'data.status') === 'success') {
    yield put(
      fetchGatewaysControlSaga({
        product_type_id: -1,
        agency_id: -1,
        agency_childen_ids: []
      })
    );
  } else {
    yield put(apiHandleError(res));
  }
}

function* getGatewayLogsSaga(action) {
  const token = yield select(getToken);
  const { agencyId, gatewayImei, gatewayId } = action.payload;
  const res = yield getGatewayLogsApi(token, agencyId, gatewayImei);
  if (_.get(res, 'data.ok') === true) {
    const logs = _.get(res, 'data.data', []);
    yield put(getGatewaySuccess(gatewayId, logs));
  } else {
    yield put(apiHandleError(res));
  }
}

function* pingNodeSaga(action) {
  const token = yield select(getToken);
  const { agencyId, gatewayId, nodeId } = action.payload;
  const res = yield pingNodeApi(token, {
    agency_id: agencyId,
    gateway_id: gatewayId,
    node_id: nodeId
  });
  if (_.get(res, 'data.ok') === true) {
    const toast = {
      message: 'Ping thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
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
  }
}

export default function* controlSaga() {
  yield all([
    takeEvery(FETCH_GATEWAYS_CONTROL_SAGA, getGatewaysControlSaga),
    takeEvery(FETCH_GATEWAY_CONTROL_SAGA, getGatewayControlSaga),
    takeEvery(TURN_OFF_ALERT, turnOffAlertSaga),
    takeEvery(ENABLE_CALL_PREMIUM_AGENT, enableCallPremiumAgentSaga),
    takeEvery(UPDATE_PREMIUM_AGENT_PHONE, updatePremiumAgentPhoneSaga),
    takeEvery(GET_GATEWAY_LOGS, getGatewayLogsSaga),
    takeEvery(PING_NODE, pingNodeSaga)
  ]);
}
