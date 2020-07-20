import { createSelector } from 'reselect';

export const seeAll = state => state.gateways.seeAll;
export const gateways = state => state.gateways.gateways;
export const allGateways = state => state.gateways.allGateways;
export const updatingStatus = state => state.gateways.updating;
export const gatewaySelector = state => state.gateways;

export const getGateways = createSelector(
  [seeAll, gateways, allGateways],
  (seeAll, gateways, allGateways) => {
    return seeAll ? allGateways : gateways;
  }
);
export const totals = createSelector(
  [seeAll, gateways, allGateways],
  (seeAll, gateways = [], allGateways = []) => {
    return seeAll ? allGateways.length : gateways.length;
  }
);
