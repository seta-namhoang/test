import { createAction } from 'redux-actions';

import * as types from './index';

// ROUTING
export const routeHome = createAction(types.ROUTE_HOME);
export const routeAbout = createAction(types.ROUTE_ABOUT);
export const routeLogin = createAction(types.ROUTE_LOGIN);
export const routeSignup = createAction(types.ROUTE_SIGNUP);
