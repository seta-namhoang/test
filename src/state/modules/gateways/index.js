import { createReducer } from '../../reducers/helper';

export const FETCH_GATEWAY = 'FETCH_GATEWAY';
export const FETCH_GATEWAY_SAGA = 'FETCH_GATEWAY_SAGA';
export const FETCH_ALL_GATEWAY = 'FETCH_ALL_GATEWAY';
export const FETCH_ALL_GATEWAY_SAGA = 'FETCH_ALL_GATEWAY_SAGA';
export const EDIT_GATEWAY = 'EDIT_GATEWAY';
export const EDIT_GATEWAY_SAGA = 'EDIT_GATEWAY_SAGA';
export const ADD_GATEWAY = 'ADD_GATEWAY';
export const ADD_GATEWAY_SAGA = 'ADD_GATEWAY_SAGA';
export const DELETE_GATEWAY_SAGA = 'DELETE_GATEWAY_SAGA';
export const DELETE_GATEWAY = 'DELETE_GATEWAY';
export const REVOKE_GATEWAY_SAGA = 'REVOKE_GATEWAY_SAGA';
export const REVOKE_GATEWAY = 'REVOKE_GATEWAY';
export const PROCESSED_GATEWAY = 'PROCESSED_GATEWAY';
export const PROCESSING_GATEWAY = 'PROCESSING_GATEWAY';
export const FETCHING_GATEWAY = 'FETCHING_GATEWAY';
export const SELLED_GATEWAY = 'SELLED_GATEWAY';
export const SELLING_GATEWAY = 'SELLING_GATEWAY';
export const SELL_GATEWAY_SAGA = 'SELL_GATEWAY_SAGA';
export const EXTEND_TIME_GATEWAY = 'EXTEND_TIME_GATEWAY';
export const ENABLE_CALL_AGENT = 'ENABLE_CALL_AGENT';
export const ENABLE_CALL_AGENT_START = 'ENABLE_CALL_AGENT_START';
export const ENABLE_CALL_AGENT_SUCCESS = 'ENABLE_CALL_AGENT_SUCCESS';
export const ENABLE_CALL_AGENT_ERROR = 'ENABLE_CALL_AGENT_ERROR';
export const ACTIVE_OFFICE_GATEWAY = 'ACTIVE_OFFICE_GATEWAY';
export const UPDATE_INFO_ACTIVE_OFFICE_GATEWAY =
  'UPDATE_INFO_ACTIVE_OFFICE_GATEWAY';

const defaultState = {
  gateways: [],
  allGateways: [],
  seeAll: false,
  fetched: false,
  fetching: false,
  processing: false,
  selling: false,
  updating: false,
  total: 0
};
const gatewayReducer = createReducer(defaultState, {
  [FETCH_GATEWAY]: (state, action) => ({
    ...state,
    fetched: true,
    fetching: false,
    seeAll: false,
    gateways: action.payload.gateways,
    total: action.payload.total
  }),
  [PROCESSING_GATEWAY]: (state, action) => ({
    ...state,
    processing: true
  }),
  [PROCESSED_GATEWAY]: (state, action) => ({
    ...state,
    processing: false
  }),
  [FETCHING_GATEWAY]: (state, action) => ({
    ...state,
    fetching: true
  }),
  [SELLED_GATEWAY]: (state, action) => ({
    ...state,
    selling: false
  }),
  [SELLING_GATEWAY]: (state, action) => ({
    ...state,
    selling: true
  }),
  [FETCH_ALL_GATEWAY]: (state, action) => ({
    ...state,
    seeAll: true,
    fetched: true,
    fetching: false,
    allGateways: action.payload.gateways,
    total: action.payload.total
  }),
  [ENABLE_CALL_AGENT_START]: (state, action) => ({
    ...state,
    updating: true,
    fetching: true
  }),
  [ENABLE_CALL_AGENT_SUCCESS]: (state, action) => ({
    ...state,
    updating: false,
    fetching: false
  }),
  [ENABLE_CALL_AGENT_ERROR]: (state, action) => ({
    ...state,
    updating: false,
    fetching: false
  })
});

export const fetchGateways = (gateways, total) => ({
  type: FETCH_GATEWAY,
  payload: {
    gateways,
    total
  }
});

export const fetchGatewaysSaga = (limit, offset, orderData) => ({
  type: FETCH_GATEWAY_SAGA,
  payload: {
    limit,
    offset,
    orderData
  }
});

export const fetchAllGateways = (gateways, total) => ({
  type: FETCH_ALL_GATEWAY,
  payload: {
    gateways,
    total
  }
});

export const fetchAllGatewaysSaga = () => ({
  type: FETCH_ALL_GATEWAY_SAGA
});

export const editGateway = gateway => ({
  type: EDIT_GATEWAY,
  payload: {
    gateway
  }
});

export const editGatewaySaga = gateway => ({
  type: EDIT_GATEWAY_SAGA,
  payload: {
    gateway
  }
});

export const addGateway = gateway => ({
  type: ADD_GATEWAY,
  payload: {
    gateway
  }
});

export const addGatewaySaga = gateway => ({
  type: ADD_GATEWAY_SAGA,
  payload: {
    gateway
  }
});

export const deleteGatewaySaga = gatewayId => ({
  type: DELETE_GATEWAY_SAGA,
  payload: {
    gatewayId
  }
});

export const revokeGatewaySaga = gatewayId => ({
  type: REVOKE_GATEWAY_SAGA,
  payload: {
    gatewayId
  }
});

export const processingGateway = () => ({
  type: PROCESSING_GATEWAY
});

export const processedGateway = () => ({
  type: PROCESSED_GATEWAY
});

export const sellingGateway = () => ({
  type: SELLING_GATEWAY
});

export const selledGateway = () => ({
  type: SELLED_GATEWAY
});

export const sellGatewaySaga = payload => ({
  type: SELL_GATEWAY_SAGA,
  payload
});

export const fetchingGateway = () => ({
  type: FETCHING_GATEWAY
});

export const extendTimeGatewaySaga = (gatewayId, time) => ({
  type: EXTEND_TIME_GATEWAY,
  payload: {
    gatewayId,
    time
  }
});

export const enableCallAgent = (gatewayId, status) => ({
  type: ENABLE_CALL_AGENT,
  payload: {
    gatewayId,
    status
  }
});

export const enableCallAgentStart = () => ({
  type: ENABLE_CALL_AGENT_START
});

export const enableCallAgentSuccess = () => ({
  type: ENABLE_CALL_AGENT_SUCCESS
});

export const enableCallAgentError = () => ({
  type: ENABLE_CALL_AGENT_ERROR
});

export const activeOfficeGatewayAction = (agencyId, data) => ({
  type: ACTIVE_OFFICE_GATEWAY,
  payload: {
    data,
    agencyId
  }
});

export const updateInfoActiveOfficeGateway = (agencyId, gatewayId, data) => ({
  type: UPDATE_INFO_ACTIVE_OFFICE_GATEWAY,
  payload: {
    data,
    agencyId,
    gatewayId
  }
});

export default gatewayReducer;
