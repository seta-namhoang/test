import axios from 'axios';

const baseApi = (token, agency_id) => {
  return axios.create({
    baseURL: `https://sys.vncss.net/vncss/api/v1/agencies/${agency_id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
};
export const subCloudMessApi = (token, agency_id, fcm_token) =>
  baseApi(token, agency_id)
    .post('/fcm/subscribe', {
      token: fcm_token
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
export const unSubCloudMessApi = (token, agency_id, fcm_token) =>
  baseApi(token, agency_id)
    .post('/fcm/unsubscribe', {
      token: fcm_token
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
export const getNotificationApi = (token, agency_id, fcm_token) =>
  baseApi(token, agency_id)
    .get('/notifications')
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const seenNotification = (token, agency_id, timestamp) =>
  baseApi(token, agency_id)
    .post(`/notifications/read`, {
      timestamp: timestamp,
      type: 'one'
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
export const seenAllNotification = (token, agency_id, timestamp) =>
  baseApi(token, agency_id)
    .post(`/notifications/read`, {
      type: 'all'
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const handleAlertApi = (token, agency_id, gatewayImei) =>
  baseApi(token, agency_id)
    .post(`/notifications/handle`, {
      gateway_serial: gatewayImei
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const getGatewayLogsApi = (token, agency_id, gatewayImei) =>
  baseApi(token, agency_id)
    .get('/gateway/actionlogs?gateway_serial=' + gatewayImei)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
