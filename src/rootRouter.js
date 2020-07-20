import React from 'react';
import { connect } from 'react-redux';
import { NOT_FOUND } from 'redux-first-router';
import cx from 'classnames';
import _ from 'lodash';

import {
  routeType,
  routeState,
  ROUTE_HOME,
  ROUTE_ABOUT,
  ROUTE_LOGIN,
  ROUTE_SIGNUP,
  ROUTE_DASHBOARD,
  ROUTE_USERS,
  ROUTE_AGENCIES,
  ROUTE_GATEWAYS,
  ROUTE_NODES,
  ROUTE_CONTROL,
  ROUTE_APP_USER,
  ROUTE_PROFILE
} from './state/modules/routing';
import './pages/Nodes';
import universal from 'react-universal-component';

import './css/switcher.module.scss';

const routesMap = {
  [ROUTE_HOME]: 'Dashboard',
  [ROUTE_ABOUT]: 'About',
  [ROUTE_LOGIN]: 'Login',
  [ROUTE_SIGNUP]: 'SignUp',
  [ROUTE_DASHBOARD]: 'Dashboard',
  [NOT_FOUND]: 'NotFound',
  [ROUTE_USERS]: 'Users',
  [ROUTE_AGENCIES]: 'Agencies',
  [ROUTE_GATEWAYS]: 'Gateways',
  [ROUTE_NODES]: 'Nodes',
  [ROUTE_CONTROL]: 'Control',
  [ROUTE_APP_USER]: 'AppUser',
  [ROUTE_PROFILE]: 'Profile'
};

const mapStateToProps = state => {
  return {
    route: routeType(state),
    routeState: routeState(state)
  };
};

const UniversalComponent = universal(({ page }) => import(`./pages/${page}`), {
  minDelay: 500,

  loading: () => (
    <div className={cx('spinner')}>
      <div />
    </div>
  ),

  error: () => <div className={cx('notFound')}>PAGE NOT FOUND - 404</div>
});

export const getPermissionArr = per => {
  if (!per) {
    return [];
  }
  return per.split(', ');
};

const Container = ({
  route,
  roles,
  routeState,
  loginStatus,
  ...remainProps
}) => {
  const permission = getPermissionArr(_.get(roles, [0, 'permission']));
  const { permission: permissionAccessPage = [] } = routeState(route);
  const access = _.difference(permissionAccessPage, permission).length === 0;
  const Route =
    routesMap[route] !== 'NotFound'
      ? access
        ? routesMap[route]
        : 'NotPermission'
      : routesMap[NOT_FOUND];
  return (
    <UniversalComponent page={Route} routeState={routeState} {...remainProps} />
  );
};

const Routes = connect(mapStateToProps)(Container);
export { Routes as default };
