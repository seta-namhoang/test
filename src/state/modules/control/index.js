import { createReducer } from '../../reducers/helper';
import _ from 'lodash';

export const gwStatus = {
  1: 'Hoạt động',
  2: 'Cảnh báo',
  3: 'Lỗi cảm biến',
  4: 'Mất kết nối'
};
export const FETCH_GATEWAYS_CONTROL = 'FETCH_GATEWAYS_CONTROL';
export const FETCH_GATEWAYS_CONTROL_SAGA = 'FETCH_GATEWAYS_CONTROL_SAGA';
export const FETCH_GATEWAY_CONTROL = 'FETCH_GATEWAY_CONTROL';
export const FETCH_GATEWAY_CONTROL_SAGA = 'FETCH_GATEWAY_CONTROL_SAGA';
export const GATEWAYS_CONTROL_PROCESSING = 'GATEWAYS_CONTROL_PROCESSING';
export const GATEWAYS_CONTROL_PROCESSED = 'GATEWAYS_CONTROL_PROCESSED';
export const TARGET_GATEWAY_ID = 'TARGET_GATEWAY_ID';
export const TURN_OFF_ALERT = 'TURN_OFF_ALERT';
export const ENABLE_CALL_PREMIUM_AGENT = 'enable-call-premium-agent';
export const UPDATE_PREMIUM_AGENT_PHONE = 'update-premium-agent-phone';
export const GET_GATEWAY_LOGS = 'GET_GATEWAY_LOGS';
export const GET_GATEWAY_LOGS_SUCCESS = 'GET_GATEWAY_LOGS_SUCCESS';
export const PING_NODE = 'PING_NODE';

const defaultState = {
  gateways: [],
  processing: false,
  fetched: false,
  fetching: false,
  total: 0,
  active: 0,
  alert: 0,
  sensorError: 0,
  disconnect: 0,
  targetGatewayId: null
};
const gatewayControlReducer = createReducer(defaultState, {
  [FETCH_GATEWAYS_CONTROL]: (state, action) => {
    const { gateways } = action.payload;
    return {
      ...state,
      fetched: true,
      fetching: false,
      gateways: {
        ...state.gateways,
        allId: gateways.map(item => item.id),
        byId: gateways.reduce((accum, currentItem, currentIndex) => {
          const currentId = currentItem.id;
          return {
            ...accum,
            [currentId]: currentItem
          };
        }, {})
      },
      total: action.payload.total,
      active: action.payload.active,
      alert: action.payload.alert,
      sensorError: action.payload.sensorError,
      disconnect: action.payload.disconnect,
      targetGatewayId: null
    };
  },
  [FETCH_GATEWAY_CONTROL]: (state, action) => {
    const { gateway } = action.payload;
    return {
      ...state,
      fetched: true,
      fetching: false,
      gateways: {
        allId: _.includes(state.gateways.allI, gateway.id)
          ? state.gateways.allId
          : [...state.gateways.allId, gateway.id],
        byId: {
          ...state.gateways.byId,
          [gateway.id]: {
            ...gateway
          }
        }
      },
      total: action.payload.total
    };
  },
  [GATEWAYS_CONTROL_PROCESSING]: (state, action) => ({
    ...state,
    processing: true
  }),
  [GATEWAYS_CONTROL_PROCESSED]: (state, action) => ({
    ...state,
    processing: false
  }),
  [TARGET_GATEWAY_ID]: (state, action) => ({
    ...state,
    targetGatewayId: action.payload.gatewayId ? action.payload.gatewayId : null
  }),
  [GET_GATEWAY_LOGS_SUCCESS]: (state, action) => {
    const { gatewayId, logs } = action.payload;
    let gateway = state.gateways.byId[gatewayId];
    gateway['logs'] = logs;
    return {
      ...state,
      byId: {
        ...state.gateways.byId,
        [gatewayId]: {
          ...gateway
        }
      }
    };
  }
});

export const fetchGatewaysControl = (
  gateways,
  total,
  activeLength,
  alertLength,
  nodeErrorLength,
  disconnectLength
) => ({
  type: FETCH_GATEWAYS_CONTROL,
  payload: {
    gateways,
    total,
    active: activeLength,
    alert: alertLength,
    sensorError: nodeErrorLength,
    disconnect: disconnectLength
  }
});

export const fetchGatewaysControlSaga = params => ({
  type: FETCH_GATEWAYS_CONTROL_SAGA,
  payload: {
    ...params
  }
});

export const fetchGatewayControl = gateway => ({
  type: FETCH_GATEWAY_CONTROL,
  payload: {
    gateway
  }
});

export const fetchGatewayControlSaga = gatewayId => ({
  type: FETCH_GATEWAY_CONTROL_SAGA,
  payload: {
    gatewayId
  }
});

export const processingGatewayControl = () => ({
  type: GATEWAYS_CONTROL_PROCESSING
});

export const processedGatewayControl = () => ({
  type: GATEWAYS_CONTROL_PROCESSED
});

export const setTargetGateway = id => ({
  type: TARGET_GATEWAY_ID,
  payload: {
    gatewayId: id
  }
});

export const turnOffAlert = (gatewayImei, agencyId) => ({
  type: TURN_OFF_ALERT,
  payload: {
    gatewayImei: gatewayImei,
    agencyId: agencyId
  }
});

export const enableCallPremiumAgent = (
  gatewayId,
  enable_call_premium_agent
) => ({
  type: ENABLE_CALL_PREMIUM_AGENT,
  payload: {
    gatewayId: gatewayId,
    enable_call_premium_agent: enable_call_premium_agent
  }
});

export const updatePremiumAgentPhone = (gatewayId, phones) => ({
  type: UPDATE_PREMIUM_AGENT_PHONE,
  payload: {
    gatewayId: gatewayId,
    phones: phones
  }
});

export const getGatewayLogs = (gatewayId, gatewayImei, agencyId) => ({
  type: GET_GATEWAY_LOGS,
  payload: {
    gatewayImei: gatewayImei,
    gatewayId: gatewayId,
    agencyId: agencyId
  }
});
export const getGatewaySuccess = (gatewayId, logs) => ({
  type: GET_GATEWAY_LOGS_SUCCESS,
  payload: {
    gatewayId: gatewayId,
    logs: logs
  }
});
export const pingNode = data => ({
  type: PING_NODE,
  payload: data
});

export default gatewayControlReducer;
