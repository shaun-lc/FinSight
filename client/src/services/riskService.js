import api from './api';

const riskService = {
  async fetchPortfolioRisk() {
    const res = await api.get('/risk/portfolio');
    return res.data;
  },
};

export default riskService;