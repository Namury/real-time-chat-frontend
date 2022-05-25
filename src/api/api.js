import axios from 'axios';

const baseURL = "https://namury-rtc-backend.herokuapp.com";
console.log(baseURL)

const Api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default Api;
