import { createReducer } from '../../reducers/helper';

export const FETCH_REPORT = 'FETCH_REPORT';
export const FETCH_REPORT_SAGA = 'FETCH_REPORT_SAGA';
export const PROCESSED_REPORT = 'PROCESSED_REPORT';
export const PROCESSING_REPORT = 'PROCESSING_REPORT';
export const FETCHING_REPORT = 'FETCHING_REPORT';

const defaultState = {
  report: null,
  fetched: false,
  fetching: false,
  processing: false
};
const accountReducer = createReducer(defaultState, {
  [FETCH_REPORT]: (state, action) => ({
    ...state,
    fetched: true,
    fetching: false,
    report: action.payload.report
  }),
  [PROCESSING_REPORT]: (state, action) => ({
    ...state,
    processing: true
  }),
  [PROCESSED_REPORT]: (state, action) => ({
    ...state,
    processing: false
  }),
  [FETCHING_REPORT]: (state, action) => ({
    ...state,
    fetching: true
  })
});

export const fetchReport = report => ({
  type: FETCH_REPORT,
  payload: {
    report
  }
});

export const fetchReportSaga = () => ({
  type: FETCH_REPORT_SAGA,
  payload: {}
});

export const processingReport = () => ({
  type: PROCESSING_REPORT
});

export const processedReport = () => ({
  type: PROCESSED_REPORT
});

export const fetchingReport = () => ({
  type: FETCHING_REPORT
});

export default accountReducer;
