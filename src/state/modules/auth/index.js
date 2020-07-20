import { createReducer } from '../../reducers/helper';

export const LOGIN_SAGA = 'login saga';
export const SIGNUP_SAGA = 'signup saga';
export const LOADING_LOGIN = 'loading login';
export const LOADED_LOGIN = 'loaded login';
export const LOGIN_ERROR = 'login error';
export const LOADING_SIGNUP = 'loading signup';
export const LOADED_SIGNUP = 'loaded signup';
export const SIGNUP_ERROR = 'signup error';
export const CHECK_LOGIN = 'check login';
export const LOGOUT = 'log out';
export const LOGOUT_SAGA = 'log out saga';
export const SHOW_DETAILS = 'SHOW_DETAILS';
export const HIDE_DETAILS = 'HIDE_DETAILS';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_SAGA = 'UPDATE_USER_SAGA';
export const UPDATE_AGENCY = 'UPDATE_AGENCY';
export const UPDATE_AGENCY_SAGA = 'UPDATE_AGENCY_SAGA';

const defaultState = {
  loading: false,
  loaded: false,
  loginStatus: false,
  user: {},
  access_token: null,
  OAuthErrorCode: null,
  OAuthErrorDescription: null,
  refresh_token: null,
  showDetails: false,
  roles: [],
  agency: {}
};

const authReducer = createReducer(defaultState, {
  [LOADING_LOGIN]: (state, action) => ({
    ...state,
    loading: true
  }),
  [LOADED_LOGIN]: (state, action) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      loginStatus: true,
      access_token: action.payload.access_token,
      refresh_token: action.payload.refresh_token,
      user: action.payload.user,
      roles: action.payload.roles,
      agency: action.payload.agency
    };
  },
  [LOGIN_ERROR]: (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    OAuthErrorDescription: action.payload.OAuthErrorDescription
  }),
  [LOGOUT]: () => ({
    ...defaultState
  }),
  [SHOW_DETAILS]: (state, action) => ({
    ...state,
    showDetails: true
  }),
  [HIDE_DETAILS]: (state, action) => ({
    ...state,
    showDetails: false
  }),
  [UPDATE_USER]: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      user
    };
  },
  [UPDATE_AGENCY]: (state, action) => {
    const { agency } = action.payload;
    return {
      ...state,
      agency
    };
  }
});

export const loginSaga = payload => ({
  type: LOGIN_SAGA,
  payload
});

export const loadingLogin = () => ({
  type: LOADING_LOGIN
});

export const loadedLogin = payload => ({
  type: LOADED_LOGIN,
  payload
});

export const errorLogin = payload => ({
  type: LOGIN_ERROR,
  payload
});

export const checkLogin = () => ({
  type: CHECK_LOGIN
});

export const logout = () => ({
  type: LOGOUT
});

export const logoutSaga = fromApp => ({
  type: LOGOUT_SAGA,
  payload: {
    fromApp
  }
});

export const getToken = state => state.auth.access_token;

export const getRoles = state => state.auth.roles;

export const getRefreshToken = state => state.auth.refresh_token;

export const showDetails = () => ({
  type: SHOW_DETAILS
});

export const hideDetails = () => ({
  type: HIDE_DETAILS
});

export const updateInfoUser = user => ({
  type: UPDATE_USER,
  payload: {
    user
  }
});

export const updateInfoAgency = agency => ({
  type: UPDATE_AGENCY,
  payload: {
    agency
  }
});

export const updateInfoUserSaga = userId => ({
  type: UPDATE_USER_SAGA,
  payload: {
    userId
  }
});

export const updateInfoAgencySaga = agencyId => ({
  type: UPDATE_AGENCY_SAGA,
  payload: {
    agencyId
  }
});

export default authReducer;
