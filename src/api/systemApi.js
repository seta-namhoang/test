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

export const activeOfficeGatewayApi = (token, agency_id, data) =>
  baseApi(token, agency_id)
    .post(`/gateways`, data)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
export const updateInfoActiveOfficeGatewayApi = (
  token,
  agency_id,
  gateway_id,
  data
) =>
  baseApi(token, agency_id)
    .put(`/gateways/${gateway_id}`, data)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const activePVNNodeApi = (token, agency_id, gateway_id, data) =>
  baseApi(token, agency_id)
    .post(`/gateways/${gateway_id}/nodes`, data)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const deactivePVNNodeApi = (token, agency_id, gateway_id, data) =>
  baseApi(token, agency_id)
    .delete(
      `/gateways/${gateway_id}/nodes/${data.node_id}?user_id=${data.user_id}`
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const pingNodeApi = (token, data) =>
  baseApi(token, data.agency_id)
    .post(`/gateways/${data.gateway_id}/nodes/${data.node_id}/pings`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
