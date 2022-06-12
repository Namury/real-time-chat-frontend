import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const Api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default Api;
