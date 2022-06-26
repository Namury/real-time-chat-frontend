import Api from './api';

const authAPI = {
  login(data) {
    return Api.post('/user/login', data);
  },
  register(data) {
    return Api.post('/user/register', data);
  },
  verify(token) {
    return Api.get(`/user/verify`, {headers: {'Authorization': 'Bearer ' + token}});
  },
  logout() {
    return true;
  }
};

export default authAPI;
