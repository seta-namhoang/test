import baseApi from './baseApi';
export const fetchGatewaysControllerApi = (token, params) => {
  const { product_type_id, agency_id, agency_childen_ids } = params;
  let url;
  if (product_type_id !== -1 && agency_id !== -1) {
    url = `/gateways?includes[]=nodes&includes[]=gateway_config&includes[]=gateway_subscription&custom_options[control]=1&filter_groups[0][filters][0][key]=product_type_id&filter_groups[0][filters][0][value]=${product_type_id}&filter_groups[0][filters][0][operator]=eq& filter_groups[0][filters][1][key]=agency_id&`;
    agency_childen_ids.forEach((id, index) => {
      url += `filter_groups[0][filters][1][value][${index}]=${id}&`;
    });
    url = url + `filter_groups[0][filters][1][operator]=in`;
  } else if (product_type_id !== -1) {
    url = `/gateways?includes[]=nodes&includes[]=gateway_config&includes[]=gateway_subscription&custom_options[control]=1&filter_groups[0][filters][0][key]=product_type_id&filter_groups[0][filters][0][value]=${product_type_id}&filter_groups[0][filters][0][operator]=eq`;
  } else if (agency_id !== -1) {
    url = `/gateways?includes[]=nodes&includes[]=gateway_config&includes[]=gateway_subscription&custom_options[control]=1&filter_groups[0][filters][0][key]=agency_id&`;
    agency_childen_ids.forEach((id, index) => {
      url += `filter_groups[0][filters][0][value][${index}]=${id}&`;
    });
    url = url + `filter_groups[0][filters][0][operator]=in`;
  } else {
    url = `/gateways?includes[]=nodes&includes[]=gateway_config&includes[]=gateway_subscription&custom_options[control]=1`;
  }
  return baseApi(token)
    .get(url)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};

export const fetchGatewayControllerApi = (token, gatewayId) => {
  const url = `/gateways/${gatewayId}?includes[]=nodes&includes[]=gateway_config&includes[]=gateway_subscription&custom_options[control]=1`;
  return baseApi(token)
    .get(url)
    .then(res => res)
    .catch(err => ({
      ...err,
      err: true
    }));
};
