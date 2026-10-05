import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getQuote, getQuotes } from '../services/priceService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const symbols = (req.query.symbols || '').split(',').filter(Boolean);
    if (symbols.length === 0) {
      return res.status(400).json({ message: 'symbols query parameter is required' });
    }
    const quotes = await getQuotes(symbols);
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch prices', error: err.message });
  }
});

router.get('/:symbol', async (req, res) => {
  try {
    const quote = await getQuote(req.params.symbol);
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch price', error: err.message });
  }
});

export default router;
