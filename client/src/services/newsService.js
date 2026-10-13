import api from './api';

const newsService = {
  async fetchNewsFeed() {
    const res = await api.get('/news/feed');
    return res.data;
  },

  async fetchTickerNews(ticker) {
    const res = await api.get(`/news/${ticker}`);
    return res.data;
  },
};

export default newsService;