import axios from 'axios';

// const token = localStorage.getItem('token');
const baseUrl = process.env.API_URL;

const baseApi = token =>
  axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${token}`
    }
    //,withCredentials: true
  });
export default baseApi;
export { baseUrl };
