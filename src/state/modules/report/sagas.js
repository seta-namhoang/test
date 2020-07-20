import { all, put, takeEvery, select } from 'redux-saga/effects';
import _ from 'lodash';
import { FETCH_REPORT_SAGA } from './index';
import { fetchReportApi } from '../../../api/reportApi';
import { constants } from '../../../containers/ToastNotification';
import { showToast } from '../notification/index';
import { getToken } from '../auth/index';
import { fetchReport, processingReport, fetchingReport } from './index';
import { apiHandleError } from '../../sagas/homeSagas';

function* fetchReportSaga(action) {
  yield put(fetchingReport());
  const token = yield select(getToken);
  const res = yield fetchReportApi(token);
  if (_.get(res, 'data.status') === 'success') {
    const { data } = res.data;
    yield put(fetchReport(data.report));
  } else {
    yield put(fetchReport([], 0));
    yield put(apiHandleError(res));
  }
}
export default function* reportSagas() {
  yield all([takeEvery(FETCH_REPORT_SAGA, fetchReportSaga)]);
}
