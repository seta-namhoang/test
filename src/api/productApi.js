import baseApi from './baseApi';

export const fetchProductTypes = (token, params) => {
  return baseApi(token)
    .get(
      `/products/types?filter_groups[0][filters][0][key]=code&filter_groups[0][filters][0][value]=${params}&filter_groups[0][filters][0][operator]=ct`
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const fetchGatewayTypesApi = token =>
  baseApi(token)
    .get(
      `/products/types?filter_groups[0][or]=true&filter_groups[0][filters][0][key]=code&filter_groups[0][filters][0][value]=SGW&filter_groups[0][filters][0][operator]=ct&filter_groups[0][filters][1][key]=code&filter_groups[0][filters][1][value]=SGPS&filter_groups[0][filters][1][operator]=ct`
    )
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
