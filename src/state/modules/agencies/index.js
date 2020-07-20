import { createReducer } from '../../reducers/helper';

export const FETCH_AGENCY = 'FETCH_AGENCY';
export const FETCH_AGENCY_SAGA = 'FETCH_AGENCY_SAGA';
export const EDIT_AGENCY = 'EDIT_AGENCY';
export const EDIT_AGENCY_SAGA = 'EDIT_AGENCY_SAGA';
export const ADD_AGENCY = 'ADD_AGENCY';
export const ADD_AGENCY_SAGA = 'ADD_AGENCY_SAGA';
export const DELETE_AGENCY_SAGA = 'DELETE_AGENCY_SAGA';
export const DELETE_AGENCY = 'DELETE_AGENCY';
export const PROCESSED_AGENCY = 'PROCESSED_AGENCY';
export const PROCESSING_AGENCY = 'PROCESSING_AGENCY';
export const FETCHING_AGENCY = 'FETCHING_AGENCY';
export const RESET_PASSWORD = 'RESET_PASSWORD';

const defaultState = {
  agencies: [],
  fetched: false,
  fetching: false,
  processing: false,
  fromUserWidget: false,
  total: 0
};
const accountReducer = createReducer(defaultState, {
  [FETCH_AGENCY]: (state, action) => ({
    ...state,
    fetched: true,
    fetching: false,
    agencies: action.payload.agencies,
    total: action.payload.total
  }),
  [PROCESSING_AGENCY]: (state, action) => ({
    ...state,
    processing: true,
    fromUserWidget:
      action.payload && action.payload.fromUserWidget
        ? action.payload.fromUserWidget
        : false
  }),
  [PROCESSED_AGENCY]: (state, action) => ({
    ...state,
    processing: false,
    fromUserWidget: false
  }),
  [FETCHING_AGENCY]: (state, action) => ({
    ...state,
    fetching: true
  })
});

export const fetchAgency = (agencies, total) => ({
  type: FETCH_AGENCY,
  payload: {
    agencies,
    total
  }
});

export const fetchAgenciesSaga = (limit, offset, orderData) => ({
  type: FETCH_AGENCY_SAGA,
  payload: {
    limit,
    offset,
    orderData
  }
});

export const editAgency = agency => ({
  type: EDIT_AGENCY,
  payload: {
    agency
  }
});

export const editAgencySaga = (agency, fromUserWidget) => ({
  type: EDIT_AGENCY_SAGA,
  payload: {
    agency,
    fromUserWidget
  }
});

export const addAgency = agency => ({
  type: ADD_AGENCY,
  payload: {
    agency
  }
});

export const addAgencySaga = agency => ({
  type: ADD_AGENCY_SAGA,
  payload: {
    agency
  }
});

export const deleteAgencySaga = agencyId => ({
  type: DELETE_AGENCY_SAGA,
  payload: {
    agencyId
  }
});

export const processingAgency = fromUserWidget => ({
  type: PROCESSING_AGENCY,
  payload: {
    fromUserWidget
  }
});

export const processedAgency = fromUserWidget => ({
  type: PROCESSED_AGENCY,
  payload: {
    fromUserWidget
  }
});

export const fetchingAgency = () => ({
  type: FETCHING_AGENCY
});

export const resetPassword = (agencyId, newPassword) => ({
  type: RESET_PASSWORD,
  payload: {
    agencyId,
    newPassword
  }
});

export const getAgencies = state => state.agencies.agencies;

export default accountReducer;
