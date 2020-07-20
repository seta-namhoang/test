import { createReducer } from '../../reducers/helper';

export const FETCH_NODE = 'FETCH_NODE';
export const FETCH_NODE_SAGA = 'FETCH_NODE_SAGA';
export const FETCH_ALL_NODE = 'FETCH_ALL_NODE';
export const FETCH_ALL_NODE_SAGA = 'FETCH_ALL_NODE_SAGA';
export const EDIT_NODE = 'EDIT_NODE';
export const EDIT_NODE_SAGA = 'EDIT_NODE_SAGA';
export const ADD_NODE = 'ADD_NODE';
export const ADD_NODE_SAGA = 'ADD_NODE_SAGA';
export const DELETE_NODE_SAGA = 'DELETE_NODE_SAGA';
export const DELETE_NODE = 'DELETE_NODE';
export const REVOKE_NODE_SAGA = 'REVOKE_NODE_SAGA';
export const REVOKE_NODE = 'REVOKE_NODE';
export const PROCESSED_NODE = 'PROCESSED_NODE';
export const PROCESSING_NODE = 'PROCESSING_NODE';
export const FETCHING_NODE = 'FETCHING_NODE';
export const SELLED_NODE = 'SELLED_NODE';
export const SELLING_NODE = 'SELLING_NODE';
export const SELL_NODE_SAGA = 'SELL_NODE_SAGA';
export const ACTIVE_PVN_NODE = 'ACTIVE_PVN_NODE';
export const DEACTIVE_PVN_NODE = 'DEACTIVE_PVN_NODE';

const defaultState = {
  nodes: [],
  allNodes: [],
  seeAll: false,
  fetched: false,
  fetching: false,
  processing: false,
  selling: false,
  total: 0
};
const nodesReducer = createReducer(defaultState, {
  [FETCH_NODE]: (state, action) => ({
    ...state,
    fetched: true,
    fetching: false,
    seeAll: false,
    nodes: action.payload.nodes,
    total: action.payload.total
  }),
  [PROCESSING_NODE]: (state, action) => ({
    ...state,
    processing: true
  }),
  [PROCESSED_NODE]: (state, action) => ({
    ...state,
    processing: false
  }),
  [FETCHING_NODE]: (state, action) => ({
    ...state,
    fetching: true
  }),
  [SELLED_NODE]: (state, action) => ({
    ...state,
    selling: false
  }),
  [SELLING_NODE]: (state, action) => ({
    ...state,
    selling: true
  }),
  [FETCH_ALL_NODE]: (state, action) => ({
    ...state,
    fetched: true,
    fetching: false,
    seeAll: true,
    allNodes: action.payload.nodes,
    total: action.payload.total
  })
});

export const fetchNodes = (nodes, total) => ({
  type: FETCH_NODE,
  payload: {
    nodes,
    total
  }
});

export const fetchNodeSaga = (limit, offset, orderData) => ({
  type: FETCH_NODE_SAGA,
  payload: {
    limit,
    offset,
    orderData
  }
});

export const fetchAllNodes = (nodes, total) => ({
  type: FETCH_ALL_NODE,
  payload: {
    nodes,
    total
  }
});

export const fetchAllNodesSaga = () => ({
  type: FETCH_ALL_NODE_SAGA
});

export const editNode = node => ({
  type: EDIT_NODE,
  payload: {
    node
  }
});

export const editNodeSaga = (node, fromControl = false, gatewayId) => ({
  type: EDIT_NODE_SAGA,
  payload: {
    node,
    fromControl,
    gatewayId
  }
});

export const addNode = node => ({
  type: ADD_NODE,
  payload: {
    node
  }
});

export const addNodeSaga = node => ({
  type: ADD_NODE_SAGA,
  payload: {
    node
  }
});

export const deleteNodeSaga = nodeId => ({
  type: DELETE_NODE_SAGA,
  payload: {
    nodeId
  }
});

export const revokeNodeSaga = gatewayId => ({
  type: REVOKE_NODE_SAGA,
  payload: {
    gatewayId
  }
});

export const processingNode = () => ({
  type: PROCESSING_NODE
});

export const processedNode = () => ({
  type: PROCESSED_NODE
});

export const fetchingNode = () => ({
  type: FETCHING_NODE
});

export const sellingNode = () => ({
  type: SELLING_NODE
});

export const selledNode = () => ({
  type: SELLED_NODE
});

export const sellNodeSaga = payload => ({
  type: SELL_NODE_SAGA,
  payload
});

export const activePVNNode = (agencyId, gatewayId, data) => ({
  type: ACTIVE_PVN_NODE,
  payload: {
    gatewayId: gatewayId,
    agencyId: agencyId,
    data
  }
});

export const deactivePVNNode = (agencyId, gatewayId, data) => ({
  type: DEACTIVE_PVN_NODE,
  payload: {
    gatewayId: gatewayId,
    agencyId: agencyId,
    data
  }
});

export default nodesReducer;
