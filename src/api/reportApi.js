import baseApi from './baseApi';

export const fetchReportApi = token => {
  return baseApi(token)
    .get('/report')
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};
