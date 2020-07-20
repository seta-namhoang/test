import { combineReducers } from 'redux';

import { reducer as location } from './modules/routing';
import { reducer as formReducer } from 'redux-form';
import testReducer from './modules/testing'; //test
import auth from './modules/auth/index';
import notificationReducer from './modules/notification/index';
import account from './modules/users/index';
import agencies from './modules/agencies/index';
import gateways from './modules/gateways/index';
import products from './modules/products/index';
import nodes from './modules/nodes/index';
import control from './modules/control/index';
import report from './modules/report/index';
export const reducers = combineReducers({
  location,
  form: formReducer,
  auth,
  notification: notificationReducer,
  users: account,
  test: testReducer,
  agencies,
  gateways,
  products,
  nodes,
  control,
  report
});
