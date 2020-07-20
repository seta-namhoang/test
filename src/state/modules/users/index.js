import { createReducer } from '../../reducers/helper';

export const FETCH_USER = 'FETCH_USER';
export const FETCHING_USER = 'FETCHING_USER';
export const FETCH_USER_SAGA = 'FETCH_USER_SAGA';
export const EDIT_USER = 'EDIT_USER';
export const EDIT_USER_SAGA = 'EDIT_USER_SAGA';
export const ADD_USER = 'ADD_USER';
export const ADD_USER_SAGA = 'ADD_USER_SAGA';
export const DELETE_USER_SAGA = 'DELETE_USER_SAGA';
export const DELETE_USER = 'DELETE_USER';
export const PROCESSING_USER = 'PROCESSING_USER';
export const PROCESSED_USER = 'PROCESSED_USER';
export const CHANGE_PASSWORD_SAGA = 'CHANGE_PASSWORD_SAGA';
export const FETCH_APP_USER = 'FETCH_APP_USER';
export const FETCH_APP_USER_SAGA = 'FETCH_APP_USER_SAGA';
export const FETCHING_APP_USER = 'FETCHING_APP_USER';

const defaultState = {
  users: [],
  appUsers: [],
  totalAppUser: 0,
  fetchedAppUser: false,
  fetchingAppUser: false,
  total: 0,
  fetched: false,
  fetching: false,
  processing: false,
  fromUserWidget: false
};
const accountReducer = createReducer(defaultState, {
  [FETCH_USER]: (state, action) => ({
    ...state,
    fetched: true,
    fetching: false,
    users: action.payload.users,
    total: action.payload.total
  }),
  [FETCHING_USER]: (state, action) => ({
    ...state,
    fetching: true,
    fetched: false
  }),
  [PROCESSING_USER]: (state, action) => ({
    ...state,
    processing: true,
    fromUserWidget:
      action.payload && action.payload.fromUserWidget ? true : false
  }),
  [PROCESSED_USER]: (state, action) => ({
    ...state,
    processing: false,
    fromUserWidget:
      action.payload && action.payload.fromUserWidget ? true : false
  }),
  [FETCH_APP_USER]: (state, action) => ({
    ...state,
    fetchedAppUser: true,
    fetchingAppUser: false,
    appUsers: action.payload.users,
    totalAppUser: action.payload.total
  }),
  [FETCHING_APP_USER]: (state, action) => ({
    ...state,
    fetchingAppUser: true,
    fetchedAppUser: false
  })
});

export const fetchUser = (users, total) => ({
  type: FETCH_USER,
  payload: {
    users,
    total
  }
});

export const fetchUserSaga = (limit, offset, orderData) => ({
  type: FETCH_USER_SAGA,
  payload: {
    limit,
    offset,
    orderData
  }
});

export const editUser = user => ({
  type: EDIT_USER,
  payload: {
    user
  }
});

export const editUserSaga = (user, fromUserWidget) => ({
  type: EDIT_USER_SAGA,
  payload: {
    user,
    fromUserWidget
  }
});

export const addUser = user => ({
  type: ADD_USER,
  payload: {
    user
  }
});

export const addUserSaga = user => ({
  type: ADD_USER_SAGA,
  payload: {
    user
  }
});

export const deleteUserSage = userId => ({
  type: DELETE_USER_SAGA,
  payload: {
    userId
  }
});

export const processingUser = fromUserWidget => ({
  type: PROCESSING_USER,
  payload: {
    fromUserWidget
  }
});

export const processedUser = () => ({
  type: PROCESSED_USER
});

export const fetchingUser = () => ({
  type: FETCHING_USER
});

export const fetchingAppUser = () => ({
  type: FETCHING_APP_USER
});

export const changePasswordSaga = payload => ({
  type: CHANGE_PASSWORD_SAGA,
  payload
});

export const fetchAppUser = (users, total) => ({
  type: FETCH_APP_USER,
  payload: {
    users,
    total
  }
});

export const fetchAppUserSaga = () => ({
  type: FETCH_APP_USER_SAGA
});

export default accountReducer;
