import { createReducer } from '../../reducers/helper';
export const namespace = 'notification';
export const SHOW_TOAST = `${namespace}/show toast`;
export const HIDE_TOAST = `${namespace}/hide toast`;
export const SHOW_LOADING = `${namespace}/show loading screen`;
export const HIDE_LOADING = `${namespace}/hide loading screen`;
export const SHOW_TOAST_WITH_ACTION = `${namespace}/show toast with action`;
export const HIDE_TOAST_WITH_ACTION = `${namespace}/hide toast with action`;
//for notification list
export const ADD_NOTIFICATION = `${namespace}/notification/ADD_NOTIFICATION`;
export const ADD_NOTIFICATION_SAGA = `${namespace}/notification/ADD_NOTIFICATION_SAGA`;
export const REMOVE_FROM_NEW = `${namespace}/notification/REMOVE_FROM_NEW`;
export const GET_NOTIFICATION_LIST = `${namespace}/GET_NOTIFICATION_LIST`;
export const GET_NOTIFICATION_LIST_SAGA = `${namespace}/GET_NOTIFICATION_LIST_SAGA`;
export const CLICK_NOTIFICATION_SAGA = `${namespace}/CLICK_NOTIFICATION_SAGA`;
export const SUBCRIBE_FCM_SAGA = `${namespace}/SUBCRIBE_FCM_SAGA`;
export const UNSUBCRIBE_FCM_SAGA = `${namespace}/UNSUBCRIBE_FCM_SAGA`;
export const READ_NOTIDICATION = `${namespace}/READ_NOTIDICATION`;
export const READ_NOTIDICATION_SAGA = `${namespace}/READ_NOTIDICATION_SAGA`;
export const READ_NOTIDICATION_ALL = `${namespace}/READ_NOTIDICATION_ALL`;
export const READ_NOTIDICATION_ALL_SAGA = `${namespace}/READ_NOTIDICATION_ALL_SAGA`;

//notification queue
export const ADD_NOTIFICATION_TO_QUEUE = `${namespace}/ADD_NOTIFICATION_TO_QUEUE`;
export const REMOVE_NOTIFICATION_FROM_QUEUE = `${namespace}/REMOVE_NOTIFICATION_FROM_QUEUE`;

const defaultState = {
  toast: {
    open: false,
    position: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    message: '',
    action: '',
    autoHideDuration: 6000,
    type: ''
  },
  loading: {
    open: false,
    message: '',
    action: ''
  },
  toastWithAction: {
    open: false,
    toastAction: ''
  },
  notification: {
    readed: 0,
    unreaded: 0,
    allId: [],
    byId: {}
  },
  notificationQueue: {
    length: 0,
    queue: []
  }
};

const notificationReducer = createReducer(defaultState, {
  [SHOW_TOAST]: (state, action) => {
    const { toast } = action.payload;
    return {
      ...state,
      toast: {
        ...state.toast,
        ...toast,
        open: true
      }
    };
  },
  [HIDE_TOAST]: state => {
    return {
      ...state,
      toast: {
        ...state.toast,
        open: false
      }
    };
  },
  [SHOW_LOADING]: (state, action) => {
    const { message } = action.payload;
    return {
      ...state,
      loading: {
        ...state.loading,
        message: message,
        open: true
      }
    };
  },
  [HIDE_LOADING]: (state, action) => {
    return {
      ...state,
      loading: {
        ...state.loading,
        open: false,
        message: ''
      }
    };
  },

  [SHOW_TOAST_WITH_ACTION]: (state, action) => {
    const { toastAction } = action.payload;
    return {
      ...state,
      toastWithAction: {
        open: true,
        toastAction
      }
    };
  },
  [HIDE_TOAST_WITH_ACTION]: (state, action) => {
    return {
      ...state,
      toastWithAction: {
        ...defaultState.toastWithAction
      }
    };
  },
  [GET_NOTIFICATION_LIST]: (state, action) => {
    const { notificationList, readed, unreaded } = action.payload;
    return {
      ...state,
      notification: {
        ...state.notification,
        readed,
        unreaded,
        allId: notificationList.map(item => item.id),
        byId: {
          ...notificationList.reduce(
            (accum, currentItem) => ({
              ...accum,
              [currentItem.id]: {
                ...currentItem
              }
            }),
            {}
          )
        }
      }
    };
  },
  [ADD_NOTIFICATION]: (state, action) => {
    const { notification } = action.payload;
    return {
      ...state,
      notification: {
        ...state.notification,
        unreaded: state.notification.unreaded + 1,
        allId: [...state.notification.allId, notification.id],
        byId: {
          ...state.notification.byId,
          [notification.id]: notification
        }
      }
    };
  },
  [ADD_NOTIFICATION_TO_QUEUE]: (state, action) => {
    const { notification } = action.payload;
    const notificationQueue = state.notificationQueue.queue || [];
    const newQueue = [...notificationQueue, notification];
    return {
      ...state,
      notificationQueue: {
        ...state.notificationQueue,
        length: newQueue.length,
        queue: [...newQueue]
      }
    };
  },
  [REMOVE_NOTIFICATION_FROM_QUEUE]: (state, action) => {
    const { notification } = action.payload;
    const notificationQueue = state.notificationQueue.queue || [];
    const newQueue = notificationQueue.filter(
      notifi => notifi.id !== notification.id
    );
    return {
      ...state,
      notificationQueue: {
        ...state.notificationQueue,
        length: newQueue.length,
        queue: [...newQueue]
      }
    };
  }
});

export const showToast = toast => ({
  type: SHOW_TOAST,
  payload: {
    toast
  }
});

export const hideToast = () => ({
  type: HIDE_TOAST
});

export const showLoading = message => ({
  type: SHOW_LOADING,
  payload: {
    message
  }
});

export const hideLoading = () => ({
  type: HIDE_LOADING
});

export const showToastWithAction = toastAction => ({
  type: SHOW_TOAST_WITH_ACTION,
  payload: {
    toastAction
  }
});

export const hideToastWithAction = () => ({
  type: HIDE_TOAST_WITH_ACTION
});

export const getNotificationList = (notificationList, readed, unreaded) => ({
  type: GET_NOTIFICATION_LIST,
  payload: {
    notificationList,
    readed,
    unreaded
  }
});

export const getNotificationListSaga = agencyId => ({
  type: GET_NOTIFICATION_LIST_SAGA,
  payload: {
    agencyId
  }
});

export const subCloudMessageSaga = (agencyId, token) => ({
  type: SUBCRIBE_FCM_SAGA,
  payload: {
    agencyId,
    token
  }
});

export const unsubCloudMessageSaga = (agencyId, token) => ({
  type: UNSUBCRIBE_FCM_SAGA,
  payload: {
    agencyId,
    token
  }
});

export const addNotification = notification => ({
  type: ADD_NOTIFICATION,
  payload: {
    notification
  }
});

export const addNotificationSaga = (agencyId, notification) => ({
  type: ADD_NOTIFICATION_SAGA,
  payload: {
    agencyId,
    notification
  }
});

export const clickNotifi = (agencyId, notificationId) => ({
  type: CLICK_NOTIFICATION_SAGA,
  payload: {
    agencyId,
    notificationId
  }
});

export const readNotification = (agencyId, timestamp) => ({
  type: READ_NOTIDICATION,
  payload: {
    agencyId,
    timestamp
  }
});

export const readNotificationSaga = (agencyId, timestamp) => ({
  type: READ_NOTIDICATION_SAGA,
  payload: {
    agencyId,
    timestamp
  }
});

export const readAllNotification = (agencyId, timestamp) => ({
  type: READ_NOTIDICATION_ALL,
  payload: {
    agencyId
  }
});

export const readAllNotificationSaga = (agencyId, timestamp) => ({
  type: READ_NOTIDICATION_ALL_SAGA,
  payload: {
    agencyId
  }
});

export const addNotificationToQueue = notification => ({
  type: ADD_NOTIFICATION_TO_QUEUE,
  payload: {
    notification
  }
});

export const removeNotificationFromQueue = notification => ({
  type: REMOVE_NOTIFICATION_FROM_QUEUE,
  payload: {
    notification
  }
});

export default notificationReducer;
