import { createSelector } from 'reselect';

const gatewayTypes = state => state.products.gatewayTypes;

export const gatewayTypesSelector = createSelector(
  [gatewayTypes],
  gatewayTypes => {
    return Object.values(gatewayTypes.byId || {});
  }
);

const nodeTypes = state => state.products.nodeTypes;

export const nodeTypesSelector = createSelector(
  [nodeTypes],
  nodeTypes => {
    return Object.values(nodeTypes.byId || {});
  }
);
