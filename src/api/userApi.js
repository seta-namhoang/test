import baseApi from './authenBaseApi';

export const loginApi = user => {
  return baseApi()
    .post('/login', {
      ...user
    })
    .then(response => response)
    .catch(error => {
      return {
        ...error,
        err: true
      };
    });
};

export const signupApi = user => {
  return baseApi()
    .post('/signup', {
      user
    })
    .then(response => response)
    .catch(error => ({
      ...error,
      error: true
    }));
};
