import baseApi from './baseApi';

export const fetchNodesApi = token => {
  return baseApi(token)
    .get('/nodes?sort[0][key]=created&sort[0][direction]=DESC')
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const fetchAllNodesApi = token => {
  return baseApi(token)
    .get(
      '/nodes?sort[0][key]=created&sort[0][direction]=DESC&custom_options[all]=1&includes[]=agency'
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const createNodeApi = (token, node) => {
  const payload = {
    node: {
      ...node
    }
  };
  return baseApi(token)
    .post('/nodes', payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const updateNodeApi = (token, node) => {
  const { id } = node;
  const payload = {
    node: {
      ...node
    }
  };
  return baseApi(token)
    .put(`/nodes/${id}`, payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const deleteNodeApi = (token, nodeId) => {
  return baseApi(token)
    .delete(`/nodes/${nodeId}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const sellNodeApi = (token, params) =>
  baseApi(token)
    .post('/nodes/sell', params)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
export const revokeNodesApi = (token, nodeIds) =>
  baseApi(token)
    .get(`/nodes/revoke/${nodeIds}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
