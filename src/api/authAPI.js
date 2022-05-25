import Api from './api';

const authAPI = {
  login(data) {
    return Api.post('/user/login', data);
  },
  register(data) {
    return Api.post('/user/register', data);
  },
  logout() {
    return true;
  }
};

export default authAPI;
