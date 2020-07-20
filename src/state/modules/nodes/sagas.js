import { all, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import {
  FETCH_NODE_SAGA,
  EDIT_NODE_SAGA,
  ADD_NODE_SAGA,
  DELETE_NODE_SAGA,
  SELL_NODE_SAGA,
  FETCH_ALL_NODE_SAGA,
  REVOKE_NODE_SAGA,
  ACTIVE_PVN_NODE,
  DEACTIVE_PVN_NODE
} from './index';
import { FETCH_NODE_TYPE_SAGA } from '../products';
import {
  fetchNodesApi,
  fetchAllNodesApi,
  updateNodeApi,
  createNodeApi,
  deleteNodeApi,
  sellNodeApi,
  revokeNodesApi
} from '../../../api/nodeApi';
import { constants } from '../../../containers/ToastNotification';
import { showToast } from '../notification/index';
import { getToken } from '../auth/index';
import {
  fetchNodes,
  processedNode,
  fetchingNode,
  selledNode,
  fetchAllNodes
} from './index';
import { fetchAgenciesSaga, getAgencies } from '../agencies/index';
import { fetchProductTypes } from '../../../api/productApi';
import { fetchNodesTypes } from '../products/index';
import { getRoles } from '../auth/index';
import { apiHandleError } from '../../sagas/homeSagas';
import { isPermissionAccess } from '../../../helper/permission';
import {
  fetchGatewayControlSaga,
  processingGatewayControl
} from '../control/index';
import { seeAll } from './selector';
import { fetchGatewaysControlSaga } from '../control';
import { activePVNNodeApi, deactivePVNNodeApi } from '../../../api/systemApi';
function* fetch() {
  const seeAllStatus = yield select(seeAll);
  if (seeAllStatus) {
    yield fetchAllNodesSaga();
  } else {
    yield fetchNodesSaga();
  }
}

export function* fetchAllNodeTypesSaga() {
  const token = yield select(getToken);
  const nodeTypes = yield fetchProductTypes(token, 'SN');
  if (nodeTypes.data && nodeTypes.data.status === 'success') {
    const { data } = nodeTypes.data;
    const product_types = data.product_types;
    yield put(fetchNodesTypes(product_types));
  } else {
    yield put(apiHandleError(nodeTypes));
  }
}

function* fetchNodesSaga(action) {
  const roles = yield select(getRoles);
  const agencies = yield select(getAgencies);
  if (!agencies.length && isPermissionAccess(roles, ['agency'])) {
    yield put(fetchAgenciesSaga());
  }
  const token = yield select(getToken);
  yield put(fetchingNode());
  const res = yield fetchNodesApi(token);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const nodes = data.nodes;
    const { total } = data.meta;
    yield put(fetchNodes(nodes, total));
  } else {
    yield put(fetchNodes([], 0));
    yield put(apiHandleError(res));
  }
}

function* fetchAllNodesSaga(action) {
  const roles = yield select(getRoles);
  const agencies = yield select(getAgencies);
  if (!agencies.length && isPermissionAccess(roles, ['agency'])) {
    yield put(fetchAgenciesSaga());
  }
  const token = yield select(getToken);
  yield put(fetchingNode());
  const res = yield fetchAllNodesApi(token);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    const nodes = data.nodes.map(node => ({
      ...node,
      agencyName: _.get(node, 'agency.name')
    }));
    const { total } = data.meta;
    yield put(fetchAllNodes(nodes, total));
  } else {
    yield put(fetchAllNodes([], 0));
    yield put(apiHandleError(res));
  }
}

function* editNodeSaga(action) {
  const { node, fromControl, gatewayId } = action.payload;
  const token = yield select(getToken);
  if (fromControl) {
    yield put(processingGatewayControl());
  }
  const res = yield updateNodeApi(token, node);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Cập nhật thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield put(processedNode());
    if (!fromControl) {
      yield fetch();
    } else {
      yield put(fetchGatewayControlSaga(gatewayId));
    }
  } else {
    yield put(apiHandleError(res));
  }
}

function* addNodeSaga(action) {
  const { node } = action.payload;
  const token = yield select(getToken);
  const res = yield createNodeApi(token, node);
  if (_.get(res, 'data.status') === 'success') {
    yield put(processedNode());
    const toast = {
      message: 'Thêm thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* deleteNodeSaga(action) {
  const { nodeId } = action.payload;
  const token = yield select(getToken);
  const res = yield deleteNodeApi(token, nodeId);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Xoá thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* revokeNodeSaga(action) {
  const { nodeId } = action.payload;
  const token = yield select(getToken);
  const res = yield revokeNodesApi(token, nodeId);
  if (_.get(res, 'data.status') === 'success') {
    const toast = {
      message: 'Xoá thành công',
      action: 'Dismiss',
      type: constants.SUCCESS
    };
    yield put(showToast(toast));
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* sellNodeSaga(action) {
  const { payload } = action;
  const token = yield select(getToken);
  const res = yield sellNodeApi(token, payload);
  if (_.get(res, 'data.status') === 'success') {
    yield put(selledNode());
    yield fetch();
  } else {
    yield put(apiHandleError(res));
  }
}

function* fetchNodeTypeId(action) {
  const token = yield select(getToken);
  const nodeTypes = yield fetchProductTypes(token, 'SN');
  if (nodeTypes.data && nodeTypes.data.status === 'success') {
    const { data } = nodeTypes.data;
    const product_types = data.product_types;
    yield put(fetchNodesTypes(product_types));
  } else {
    yield put(apiHandleError(nodeTypes));
  }
}

function* activePVNNodeSaga(action) {
  const token = yield select(getToken);
  const { agencyId, gatewayId, data } = action.payload;
  const res = yield activePVNNodeApi(token, agencyId, gatewayId, data);
  if (_.get(res, 'data.ok') === true) {
    const toast = {
      message: 'Kích hoạt thành công',
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
    yield put(
      fetchGatewaysControlSaga({
        product_type_id: -1,
        agency_id: -1,
        agency_childen_ids: []
      })
    );
  }
}

function* deactivePVNNodeSaga(action) {
  const token = yield select(getToken);
  const { agencyId, gatewayId, data } = action.payload;
  const res = yield deactivePVNNodeApi(token, agencyId, gatewayId, data);
  if (_.get(res, 'data.ok') === true) {
    const toast = {
      message: 'Gỡ cảm biến hoạt thành công',
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
    yield put(
      fetchGatewaysControlSaga({
        product_type_id: -1,
        agency_id: -1,
        agency_childen_ids: []
      })
    );
  }
}

export default function* agenciesSagas() {
  yield all([
    takeEvery(FETCH_NODE_SAGA, fetchNodesSaga),
    takeEvery(EDIT_NODE_SAGA, editNodeSaga),
    takeEvery(ADD_NODE_SAGA, addNodeSaga),
    takeEvery(REVOKE_NODE_SAGA, revokeNodeSaga),
    takeEvery(DELETE_NODE_SAGA, deleteNodeSaga),
    takeEvery(SELL_NODE_SAGA, sellNodeSaga),
    takeEvery(FETCH_NODE_TYPE_SAGA, fetchNodeTypeId),
    takeEvery(FETCH_ALL_NODE_SAGA, fetchAllNodesSaga),
    takeEvery(ACTIVE_PVN_NODE, activePVNNodeSaga),
    takeEvery(DEACTIVE_PVN_NODE, deactivePVNNodeSaga)
  ]);
}
