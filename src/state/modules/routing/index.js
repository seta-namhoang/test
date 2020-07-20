import { connectRoutes } from 'redux-first-router';
// import createHistory from 'history/createBrowserHistory';
// import { apiMiddleware } from 'redux-api-middleware';
import { redirect } from 'redux-first-router';
// import createSagaMiddleware from 'redux-saga';
import queryString from 'query-string';
import { find } from 'lodash';

import {
  ROUTE_HOME_ID,
  ROUTE_ABOUT_ID,
  ROUTE_LOGIN_ID,
  ROUTE_SIGNUP_ID,
  ROUTE_DASHBOARD_ID,
  ROUTE_USERS_ID,
  ROUTE_AGENCIES_ID,
  ROUTE_GATEWAYS_ID,
  ROUTE_NODES_ID,
  ROUTE_CONTROL_ID,
  ROUTE_APP_USER_ID,
  ROUTE_PROFILE_ID
} from './constant';
// ROUTES
export const ROUTE_HOME = 'route/ROUTE_HOME';
export const ROUTE_ABOUT = 'route/ROUTE_ABOUT';
export const ROUTE_LOGIN = 'route/ROUTE_LOGIN';
export const ROUTE_PAYLOAD = 'route/ROUTE_PAYLOAD';
export const ROUTE_SIGNUP = 'route/ROUTE_SIGNUP';
export const ROUTE_DASHBOARD = 'route/ROUTE_DASHBOARD';
export const ROUTE_USERS = 'route/ROUTE_USERS';
export const ROUTE_AGENCIES = 'route/ROUTE_AGENCIES';
export const ROUTE_GATEWAYS = 'route/ROUTE_GATEWAYS';
export const ROUTE_NODES = 'route/ROUTE_NODES';
export const ROUTE_CONTROL = 'route/ROUTE_CONTROL';
export const ROUTE_APP_USER = 'route/ROUTE_APP_USER';
export const ROUTE_PROFILE = 'route/ROUTE_PROFILE';

// selector
export const routeType = state => state.location.type;
export const routePayload = state => state.location.payload;
export const routeState = state => type => state.location.routesMap[type] || {};
//routes map
export const routesMap = {
  [ROUTE_HOME]: {
    id: ROUTE_HOME_ID,
    path: '/',
    component: 'Dashboard',
    usingAppbar: true,
    permission: []
  },
  [ROUTE_DASHBOARD]: {
    id: ROUTE_DASHBOARD_ID,
    path: '/dashboard',
    component: 'Dashboard',
    usingAppbar: true,
    permission: []
  },
  [ROUTE_USERS]: {
    id: ROUTE_USERS_ID,
    path: '/users',
    component: 'Users',
    usingAppbar: true,
    permission: ['user']
  },
  [ROUTE_ABOUT]: {
    id: ROUTE_ABOUT_ID,
    path: '/about',
    component: 'Home',
    usingAppbar: true,
    permission: []
  },
  [ROUTE_LOGIN]: {
    id: ROUTE_LOGIN_ID,
    path: '/login',
    component: 'Auth',
    usingAppbar: false,
    requiresAuth: false,
    permission: []
  },
  [ROUTE_SIGNUP]: {
    id: ROUTE_SIGNUP_ID,
    path: '/signup',
    component: 'Signup',
    requiresAuth: false,
    usingAppbar: false,
    permission: []
  },
  [ROUTE_AGENCIES]: {
    id: ROUTE_AGENCIES_ID,
    path: '/agencies',
    component: 'Agencies',
    usingAppbar: true,
    permission: ['agency']
  },
  [ROUTE_GATEWAYS]: {
    id: ROUTE_GATEWAYS_ID,
    path: '/gateways',
    component: 'Gateways',
    usingAppbar: true,
    permission: ['product']
  },
  [ROUTE_NODES]: {
    id: ROUTE_NODES_ID,
    path: '/nodes',
    component: 'Nodes',
    usingAppbar: true,
    permission: ['product']
  },
  [ROUTE_CONTROL]: {
    id: ROUTE_CONTROL_ID,
    path: '/control',
    component: 'Control',
    usingAppbar: true,
    permission: []
  },
  [ROUTE_APP_USER]: {
    id: ROUTE_APP_USER_ID,
    path: '/app-user',
    component: 'AppUser',
    usingAppbar: true,
    permission: ['user_app']
  },
  [ROUTE_PROFILE]: {
    id: ROUTE_PROFILE_ID,
    path: '/profile',
    component: 'Profile',
    usingAppbar: true,
    permission: []
  }
};

export const routeLogin = () => ({
  type: ROUTE_LOGIN
});

const { reducer, middleware, enhancer } = connectRoutes(routesMap, {
  querySerializer: queryString,
  initialDispatch: false,
  onBeforeChange: (dispatch, getState, { action }) => {
    const routeDefinition = routesMap[action.type];

    if (routeDefinition && routeDefinition.redirects) {
      const matchedRedirect = find(
        routeDefinition.redirects,
        ({ test }) => !!test(getState, action)
      );

      matchedRedirect && dispatch(redirect(matchedRedirect.to));
    }
  }
});

export { reducer, middleware, enhancer };
