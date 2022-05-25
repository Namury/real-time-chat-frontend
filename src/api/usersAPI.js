import Api from './api';

const usersAPI = {
  createUser(data) {
    return Api.post('/users', data);
  },
  getUsers(options) {
    return Api.get(`/users?limit=${options.limit}&page=${options.page}`);
  },
  getUserById(id) {
    return Api.get(`/users/${id}`);
  },
  updateUser(id, data) {
    return Api.put(`/users/${id}`, data);
  },
  deleteUserById(id) {
    return Api.delete(`/users/${id}`);
  },
  getProfile() {
    return Api.get('/profile');
  },
  updateProfile(data) {
    return Api.put('/profile/edit', data);
  }
};

export default usersAPI;
