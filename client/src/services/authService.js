import api from './api';

const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export default authService;
