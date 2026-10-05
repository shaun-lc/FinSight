import api from './api';

const priceService = {
  async getQuote(symbol) {
    const res = await api.get(`/prices/${symbol}`);
    return res.data;
  },

  async getQuotes(symbols) {
    const res = await api.get('/prices', { params: { symbols: symbols.join(',') } });
    return res.data;
  },
};

export default priceService;
