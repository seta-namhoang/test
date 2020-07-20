import { select, spawn, take } from 'redux-saga/effects';

import { routeType } from '../modules/routing';

// Route Sagas
// import { loadHome } from './homeSagas';

const routesMap = {};

export function* routes() {
  const initialRoute = yield select(routeType);
  if (routesMap[initialRoute]) {
    yield spawn(routesMap[initialRoute]);
  }
  while (true) {
    const { type } = yield take(Object.keys(routesMap));
    yield spawn(routesMap[type]);
  }
}
