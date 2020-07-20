import baseApi from './baseApi';

export const fetchAccountApi = token => {
  return baseApi(token)
    .get('/account')
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const addAccountApi = (account, token) => {
  return baseApi(token)
    .post('/account', account)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const updateAccountApi = (account, token) => {
  const { id } = account;
  return baseApi(token)
    .put(`/account/${id}`, account)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};
