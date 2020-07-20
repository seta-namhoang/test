const axios = require('axios');

const authenBaseApi = () =>
  axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
    // ,withCredentials: true
  });

export default authenBaseApi;
