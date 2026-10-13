import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Holding from '../models/Holding.js';
import { fetchCompanyNews } from '../services/newsService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/feed', async (req, res) => {
  try {
    const holdings = await Holding.find({ user: req.userId });

    if (holdings.length === 0) {
      return res.json([]);
    }

    const tickers = [...new Set(holdings.map((h) => h.symbol))];

    const allArticles = await Promise.all(
      tickers.map(async (ticker) => {
        const articles = await fetchCompanyNews(ticker);
        return articles.map((a) => ({ ...a, ticker }));
      })
    );

    const merged = allArticles
      .flat()
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, 20);

    res.json(merged);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news feed', error: err.message });
  }
});

router.get('/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const articles = await fetchCompanyNews(ticker);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news', error: err.message });
  }
});

export default router;