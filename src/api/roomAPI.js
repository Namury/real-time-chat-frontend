import Api from './api';

const roomAPI = {
  create(data, token) {
    return Api.post('/chat/room/create', data, {headers: {'Authorization': 'Bearer ' + token}});
  },
  getAll(token) {
    return Api.get(`/chat/room/user`, {headers: {'Authorization': 'Bearer ' + token}});
  },
  getById(id, token) {
    return Api.get(`/chat/room/${id}`, {headers: {'Authorization': 'Bearer ' + token}});
  },
  update(id, data, token) {
    return Api.put(`/chat/room/edit/${id}`, data, {headers: {'Authorization': 'Bearer ' + token}});
  },
  delete(id, token) {
    return Api.delete(`/chat/room/delete/${id}`, {headers: {'Authorization': 'Bearer ' + token}});
  }
};

export default roomAPI;
