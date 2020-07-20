import { fork, all, takeEvery, put } from 'redux-saga/effects';

import { routes } from './routerSagas';
import auth from '../modules/auth/sagas';
import users from '../modules/users/sagas';
import agencies from '../modules/agencies/sagas';
import gateways from '../modules/gateways/sagas';
import nodes from '../modules/nodes/sagas';
import report from '../modules/report/sagas';
import homeSaga from './homeSagas';
import controlSaga from '../modules/control/sagas';
import notificationSagas from '../modules/notification/sagas';
import { BOOT } from './actions';
import { fetchAllGatewaysSaga } from '../modules/gateways/sagas';
import { fetchGatewayTypesSaga } from '../modules/gateways/sagas';
import { fetchAllNodeTypesSaga } from '../modules/nodes/sagas';
function* booting() {
  yield takeEvery(BOOT, function*() {
    yield all([
      fork(fetchAllGatewaysSaga),
      fork(fetchAllNodeTypesSaga),
      fork(fetchGatewayTypesSaga)
    ]);
  });
}
export function* sagas() {
  yield all([
    yield fork(homeSaga),
    yield fork(routes),
    yield fork(auth),
    yield fork(users),
    yield fork(agencies),
    yield fork(gateways),
    yield fork(nodes),
    yield fork(controlSaga),
    yield fork(notificationSagas),
    yield fork(booting),
    yield fork(report)
  ]);
}
