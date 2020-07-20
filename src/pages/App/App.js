/* eslint-disable no-console */
import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';

import Routes from '../../rootRouter';
import Appbar from '../../components/AppBar';
import Drawer from '../../components/Drawer';
import Footer from '../../components/Footer';
import ToastNotification from '../../containers/ToastNotification';
import LoadingScreen from '../../containers/Loading';
import AccountDetails from '../../containers/AccountDetails';
import QueueAlertDialog from '../../containers/GatewayAlert';
import {
  routeState,
  routeType,
  routePayload
} from '../../state/modules/routing/index';
import { getRoles } from '../../state/modules/auth/index';
import { checkLogin, showDetails } from '../../state/modules/auth/index';
import { logoutSaga } from '../../state/modules/auth/index';
import { getNotification } from '../../state/modules/notification/selector';
import { turnOffAlert } from '../../state/modules/control';
import {
  getNotificationListSaga,
  subCloudMessageSaga,
  unsubCloudMessageSaga,
  addNotificationSaga,
  readNotificationSaga,
  readAllNotificationSaga,
  showToast as showToastAction
} from '../../state/modules/notification/index';
import { boot } from '../../state/sagas/actions';
import {
  ROUTE_CONTROL,
  ROUTE_PROFILE
} from '../../state/modules/routing/index';
import { messaging } from '../../firebase';
import {
  unRegisterServiceWorker,
  registerServiceWorker
} from '../../serviceWorker';
import { setTargetGateway } from '../../state/modules/control/index';
import { addNotificationToQueue as addNotificationToQueueAction } from '../../state/modules/notification/index';
import { guid } from '../../helper/util';
import useStyles from './styles';

function App({
  loginStatus,
  user,
  checkLogin,
  logout,
  redirect,
  notifications,
  roles,
  route,
  routePayload,
  getRouteState,
  showDetails,
  data,
  getNotificationList,
  subCloudMessage,
  unsubCloudMessage,
  addNotification,
  readedNotification,
  unreadedNotification,
  readNotification,
  readAllNotification,
  setTargetGatewayId,
  addNotificationToQueue,
  bootApp,
  turnOffAlert
}) {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState(null);
  useEffect(() => {
    checkLogin();
    return () => {
      return;
    };
  }, []);
  useEffect(() => {
    grantNotificationPermission();
  }, []);
  useEffect(() => {
    if (!_.isNil(user.id)) {
      bootApp();
      const agencyId = _.get(user, 'agency_id');
      getNotificationList(agencyId);
      getTokenWithReload().then(data => {
        if (data.token !== '' && !_.isNil(data.token)) {
          setToken(data.token);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', ({ data }) => {
      const messageBody = _.get(data, 'firebase-messaging-msg-data', {});
      const notificationCM = _.get(messageBody, 'notification', {});
      const gatewaySerial = _.get(messageBody, 'data.gateway_serial', '');
      const toastType = _.get(messageBody, 'data.type', 'success');
      const timestamp = _.get(messageBody, 'data.timestamp');
      const agencyId = _.get(user, 'agency_id', 1);
      const onclick = e => {
        setTargetGatewayId(gatewaySerial);
        e.preventDefault();
        redirect(ROUTE_CONTROL);
      };
      const remove = key => () => {
        closeSnackbar(key);
        readNotification(agencyId, timestamp);
      };
      const action = key => (
        <>
          <Button style={{ color: 'white' }} onClick={onclick}>
            Chi tiết
          </Button>
          <Button style={{ color: 'white' }} onClick={remove(key)}>
            Xoá
          </Button>
        </>
      );
      if (toastType === 'success') {
        enqueueSnackbar(notificationCM.body, {
          variant: toastType,
          autoHideDuration: 10000,
          action,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        });
      } else {
        addNotificationToQueue({
          id: guid(),
          messageBody,
          notificationText: notificationCM.body,
          timestamp,
          gatewaySerial
        });
      }
      addNotification(agencyId, messageBody);
    });
  }, []);

  useEffect(() => {
    const agencyId = _.get(user, 'agency_id');
    const userId = _.get(user, 'id');
    if (token !== null && !_.isNil(userId)) {
      const effect = async () => {
        await registerServiceWorker();
        await subCloudMessage(agencyId, token);
      };
      effect();
    }
  }, [token, user]);

  const { usingAppbar = false } = getRouteState(route);
  const getTokenWithReload = () => {
    return getTokenFCM().then(data => {
      if (data.error) {
        return getTokenWithReload();
      }
      return data;
    });
  };
  const getTokenFCM = () => {
    return messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then(token => ({
        error: false,
        token
      }))
      .catch(err => ({
        token: '',
        error: true,
        ...err
      }));
  };
  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }
  const onLogout = () => {
    const agencyId = _.get(user, 'agency_id');
    unsubCloudMessage(agencyId, token);
    unRegisterServiceWorker();
    logout(true);
  };
  const onEditProfile = () => {
    redirect(ROUTE_PROFILE);
  };

  const grantNotificationPermission = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      return;
    }
    if (Notification.permission === 'denied') {
      enqueueSnackbar(
        'Không thể kích hoạt thông báo. Vui lòng bật thông báo trong phần cài đặt',
        {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        }
      );
      return;
    }
    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(result => {
        if (result === 'granted') {
          new Notification('Welcome to CMS VNCSS');
        }
      });
    }
  };

  const onClickNotification = notification => {
    const agencyId = _.get(user, 'agency_id');
    const timestamp = _.get(notification, 'timestamp');
    const gatewayId = _.get(notification, 'data.gateway_serial');
    const type = _.get(notification, 'type', '');
    if (!notification.seen) {
      readNotification(agencyId, timestamp);
    }
    if (type === 'warning') {
      setTargetGatewayId(gatewayId);
      redirect(ROUTE_CONTROL, gatewayId);
    }
  };

  const readAll = () => {
    const agencyId = _.get(user, 'agency_id');
    if (unreadedNotification > 0) {
      readAllNotification(agencyId);
    }
  };

  const redirectWrapper = route => {
    setTargetGatewayId(null);
    redirect(route);
  };

  if (!usingAppbar) {
    return (
      <div>
        <ToastNotification />
        <LoadingScreen />
        <Routes />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <ToastNotification />
      <LoadingScreen />
      <AccountDetails />
      <QueueAlertDialog turnOffAlert={turnOffAlert} user={user} />
      <CssBaseline />
      <Appbar
        open={open}
        handleDrawerClose={handleDrawerClose}
        handleDrawerOpen={handleDrawerOpen}
        redirect={redirect}
        onEditProfile={onEditProfile}
        onLogout={onLogout}
        user={user}
        profileMenu
        enableNotify
        notifications={notifications}
        readedNotification={readedNotification}
        unreadedNotification={unreadedNotification}
        onOpen={_.noop}
        onClose={_.noop}
        onClickNotification={onClickNotification}
        readAll={readAll}
        currentRoute={route}
      />
      <Drawer
        open={open}
        handleDrawerClose={handleDrawerClose}
        redirect={redirectWrapper}
        roles={roles}
        currentRoute={route}
      />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.contentWaper}>
          {loginStatus && (
            <Routes
              redirect={redirect}
              roles={roles}
              loginStatus={loginStatus}
              routePayload={routePayload}
            />
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}

const AppWrapper = connect(
  state => ({
    loginStatus: state.auth.loginStatus,
    user: state.auth.user,
    getRouteState: routeState(state),
    route: routeType(state),
    routePayload: routePayload(state),
    roles: getRoles(state),
    notifications: getNotification(state),
    readedNotification: state.notification.notification.readed,
    unreadedNotification: state.notification.notification.unreaded
  }),
  dispatch => ({
    redirect: (route, data) =>
      dispatch({
        type: route,
        payload: {
          gatewayId: data
        }
      }),
    checkLogin: compose(
      dispatch,
      checkLogin
    ),
    logout: compose(
      dispatch,
      logoutSaga
    ),
    showDetails: compose(
      dispatch,
      showDetails
    ),
    getNotificationList: compose(
      dispatch,
      getNotificationListSaga
    ),
    subCloudMessage: compose(
      dispatch,
      subCloudMessageSaga
    ),
    unsubCloudMessage: compose(
      dispatch,
      unsubCloudMessageSaga
    ),
    addNotification: compose(
      dispatch,
      addNotificationSaga
    ),
    readNotification: compose(
      dispatch,
      readNotificationSaga
    ),
    readAllNotification: compose(
      dispatch,
      readAllNotificationSaga
    ),
    showToast: compose(
      dispatch,
      showToastAction
    ),
    setTargetGatewayId: compose(
      dispatch,
      setTargetGateway
    ),
    addNotificationToQueue: compose(
      dispatch,
      addNotificationToQueueAction
    ),
    bootApp: compose(
      dispatch,
      boot
    ),
    turnOffAlert: compose(
      dispatch,
      turnOffAlert
    )
  })
)(App);

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={7}>
      <AppWrapper />
    </SnackbarProvider>
  );
}
