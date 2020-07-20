import baseApi from './baseApi';

export const fetchGatewaysApi = token => {
  return baseApi(token)
    .get(
      '/gateways?sort[0][key]=created&sort[0][direction]=DESC&includes[]=gateway_config'
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const fetchAllGatewaysApi = token => {
  return baseApi(token)
    .get(
      '/gateways?sort[0][key]=created&sort[0][direction]=DESC&custom_options[all]=1&includes[]=gateway_subscription&includes[]=agency&includes[]=gateway_config'
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const createGatewayApi = (token, gateway) => {
  const payload = {
    gateway: {
      ...gateway
    }
  };
  return baseApi(token)
    .post('/gateways', payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const updateGatewayApi = (token, gateway) => {
  const { id } = gateway;
  const payload = {
    gateway: {
      ...gateway
    }
  };
  return baseApi(token)
    .put(`/gateways/${id}`, payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const deleteGatewayApi = (token, gatewayId) => {
  return baseApi(token)
    .delete(`/gateways/${gatewayId}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const refreshGatewayToken = token =>
  // eslint-disable-next-line no-undef
  baseApi(token)
    .post('/login/refresh')
    .then(data => data)
    .catch(err => ({
      err: true,
      ...err
    }));

export const sellGatewayApi = (token, params) =>
  baseApi(token)
    .post('/gateways/sell', params)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const extendTimeApi = (token, gatewayId) =>
  baseApi(token)
    .get(`/gateways/extend/${gatewayId}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const enableAgencyPhoneApi = (token, gatewayId, status) =>
  baseApi(token)
    .post(`/gateways/enable-call-agent/${gatewayId}`, {
      enable_call_agent: status
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const revokeGatewaysApi = (token, gatewayId) =>
  baseApi(token)
    .get(`/gateways/revoke/${gatewayId}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const activeGatewayApi = (token, data) =>
  baseApi(token)
    .post('/gateways/active', {
      data: {
        ...data
      }
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const turnOffAlertApi = (token, gatewayId) =>
  baseApi(token)
    .get(`/gateways/turn-off-alert/${gatewayId}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const enableCallPremiumAgent = (
  token,
  gatewayId,
  enable_call_premium_agent
) =>
  baseApi(token)
    .post('/gateways/enable-call-premium-agent/' + gatewayId, {
      enable_call_premium_agent: enable_call_premium_agent
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));

export const updatePremiumAgentPhone = (token, gatewayId, phones) =>
  baseApi(token)
    .post('/gateways/update-premium-agent-phone/' + gatewayId, {
      premium_agent_phone: phones
    })
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
