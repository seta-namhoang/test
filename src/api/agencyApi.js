import baseApi from './baseApi';

export const fetchAgenciesApi = token => {
  return baseApi(token)
    .get(
      '/agencies?sort[0][key]=created&sort[0][direction]=DESC&includes[]=agency_information'
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const fetchAgencyApi = (token, id) => {
  return baseApi(token)
    .get(`agencies/${id}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const createAgencyApi = (token, agency) => {
  const payload = {
    agency: {
      ...agency
    }
  };
  return baseApi(token)
    .post('/agencies', payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const updateAgencyApi = (token, agency) => {
  const { id } = agency;
  const payload = {
    agency: {
      ...agency
    }
  };
  return baseApi(token)
    .put(`/agencies/${id}`, payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const deleteAgencyApi = (token, agencyId) => {
  return baseApi(token)
    .delete(`/agencies/${agencyId}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const refreshAgencyToken = token =>
  // eslint-disable-next-line no-undef
  baseApi(token)
    .post('/login/refresh')
    .then(data => data)
    .catch(err => ({
      err: true,
      ...err
    }));

export const resetAgencyPassword = (token, agencyId, newPassword) =>
  // eslint-disable-next-line no-undef
  baseApi(token)
    .post(`/agencies/reset-password/${agencyId}`, {
      new_password: newPassword
    })
    .then(data => data)
    .catch(err => ({
      err: true,
      ...err
    }));

export const fetchChildenAgenciesApi = (token, agencyId) => {
  return baseApi(token)
    .get(`/agencies/${agencyId}/childrens`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};
