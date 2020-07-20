import { createSelector } from 'reselect';

const gatewayControl = state => state.control.gateways;
const processingControl = state => state.control.processing;
const fetched = state => state.control.fetched;
const targetGatewayId = state => state.control.targetGatewayId;
const total = state => state.control.total;
const active = state => state.control.active;
const alert = state => state.control.alert;
const sensorError = state => state.control.sensorError;
const disconnect = state => state.control.disconnect;

const controllingGateways = createSelector(
  [gatewayControl],
  gateways => {
    return Object.values(gateways.byId || {});
  }
);

const processingControlStatus = createSelector(
  [processingControl],
  status => status
);

const getTargetGatewayId = createSelector(
  [targetGatewayId],
  targetGatewayId => targetGatewayId
);

const getGwListLength = createSelector(
  [total, active, alert, sensorError, disconnect, fetched],
  (total, active, alert, sensorError, disconnect, fetched) => {
    if (!fetched) {
      return {
        total: '--',
        active: '--',
        alert: '--',
        sensorError: '--',
        disconnect: '--'
      };
    }
    return {
      total,
      active,
      alert,
      sensorError,
      disconnect
    };
  }
);

export {
  controllingGateways,
  processingControlStatus,
  getTargetGatewayId,
  getGwListLength
};
