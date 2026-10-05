import api from './api';

const holdingsService = {
  async getHoldings() {
    const res = await api.get('/holdings');
    return res.data;
  },

  async addHolding(holding) {
    const res = await api.post('/holdings', holding);
    return res.data;
  },

  async updateHolding(id, updates) {
    const res = await api.put(`/holdings/${id}`, updates);
    return res.data;
  },

  async deleteHolding(id) {
    const res = await api.delete(`/holdings/${id}`);
    return res.data;
  },
};

export default holdingsService;
