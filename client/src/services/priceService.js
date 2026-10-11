import api from './api';

const priceService = {
  async fetchQuote(ticker) {
    const res = await api.get(`/prices/quote/${ticker}`);
    return res.data;
  },

  async fetchHistory(ticker) {
    const res = await api.get(`/prices/history/${ticker}`);
    return res.data;
  },
};

export default priceService;