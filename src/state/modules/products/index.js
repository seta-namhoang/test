import { createReducer } from '../../reducers/helper';

export const FETCH_GATEWAY_TYPE = 'FETCH_GATEWAY_TYPE';
export const FETCH_GATEWAY_TYPE_SAGA = 'FETCH_GATEWAY_TYPE_SAGA';
export const FETCH_NODE_TYPE = 'FETCH_NODE_TYPE';
export const FETCH_NODE_TYPE_SAGA = 'FETCH_NODE_TYPE_SAGA';

const defaultState = {
  products: [],
  gatewayTypes: {},
  nodeTypes: {},
  fetched: false,
  fetching: false,
  processing: false,
  total: 0
};
const productReducer = createReducer(defaultState, {
  [FETCH_GATEWAY_TYPE]: (state, action) => {
    const { gatewayTypes } = action.payload;
    return {
      ...state,
      fetched: true,
      fetching: false,
      gatewayTypes: {
        allId: gatewayTypes.map(item => item.id),
        byId: gatewayTypes.reduce((accum, currentItem, currentIndex) => {
          const currentId = currentItem.id;
          return {
            ...accum,
            [currentId]: currentItem
          };
        }, {})
      },
      total: action.payload.total
    };
  },
  [FETCH_NODE_TYPE]: (state, action) => {
    const { nodeTypes } = action.payload;
    return {
      ...state,
      fetched: true,
      fetching: false,
      nodeTypes: {
        allId: nodeTypes.map(item => item.id),
        byId: nodeTypes.reduce((accum, currentItem, currentIndex) => {
          const currentId = currentItem.id;
          return {
            ...accum,
            [currentId]: currentItem
          };
        }, {})
      },
      total: action.payload.total
    };
  }
});

export const fetchGatewayTypes = (gatewayTypes, total) => ({
  type: FETCH_GATEWAY_TYPE,
  payload: {
    gatewayTypes,
    total
  }
});

export const fetchGatewayTypesSaga = () => ({
  type: FETCH_GATEWAY_TYPE_SAGA
});

export const fetchNodesTypes = (nodeTypes, total) => ({
  type: FETCH_NODE_TYPE,
  payload: {
    nodeTypes,
    total
  }
});

export const fetchNodesTypesSaga = () => ({
  type: FETCH_NODE_TYPE_SAGA
});

export default productReducer;
