import baseApi from './baseApi';

export const fetchUsersApi = (token, limit = 10, page = 0, orderData = {}) => {
  const { key = 'name', direction = 'ASC' } = orderData;
  return baseApi(token)
    .get(
      `/users?limit=${limit}&page=${page}&sort[0][key]=${key}&sort[0][direction]=${direction}`,
      orderData
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const fetchAllUsersApi = token => {
  return baseApi(token)
    .get('/users')
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const fetchUserApi = (token, id) =>
  baseApi(token)
    .get(`/users/${id}`)
    .then(res => res)
    .catch(err => ({
      err: true,
      ...err
    }));

export const createUserApi = (token, user) => {
  const payload = {
    user: {
      ...user
    }
  };
  return baseApi(token)
    .post('/users', payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const updateUserApi = (token, user) => {
  const { id } = user;
  const payload = {
    user: {
      ...user
    }
  };
  return baseApi(token)
    .put(`/users/${id}`, payload)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const deleteUserApi = (token, userId) => {
  return baseApi(token)
    .delete(`/users/${userId}`)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const refreshUserToken = token =>
  // eslint-disable-next-line no-undef
  baseApi(token)
    .post('/login/refresh')
    .then(data => data)
    .catch(err => ({
      err: true,
      ...err
    }));

export const getCurrentUser = token =>
  baseApi(token)
    .get('users/current-user')
    .then(data => data)
    .catch(err => ({
      err: true,
      ...err
    }));

export const changePasswordApi = (token, user) => {
  return baseApi(token)
    .post('/users/change-password', {
      user
    })
    .then(response => response)
    .catch(error => ({
      ...error,
      error: true
    }));
};

export const appUserListApi = token => {
  return baseApi(token)
    .get('/users/app-users')
    .then(response => response)
    .catch(err => ({
      ...err,
      error: true
    }));
};
