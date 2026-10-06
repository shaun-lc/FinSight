import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getHistory, getQuote, PriceError } from '../services/priceService.js';

const router = express.Router();

router.use(authMiddleware);

const TICKER_PATTERN = /^[A-Z.-]{1,10}$/;

function parseTicker(req, res, next) {
  const ticker = req.params.ticker.toUpperCase();
  if (!TICKER_PATTERN.test(ticker)) {
    return res.status(400).json({ message: 'Invalid ticker' });
  }
  req.ticker = ticker;
  next();
}

function handleError(res, err, fallbackMessage) {
  if (err instanceof PriceError) {
    return res.status(err.status).json({ message: err.message });
  }
  res.status(500).json({ message: fallbackMessage, error: err.message });
}

router.get('/quote/:ticker', parseTicker, async (req, res) => {
  try {
    res.json(await getQuote(req.ticker));
  } catch (err) {
    handleError(res, err, 'Failed to fetch quote');
  }
});

router.get('/history/:ticker', parseTicker, async (req, res) => {
  try {
    const { data, stale } = await getHistory(req.ticker);
    // Keep the body a plain array; flag staleness via header.
    if (stale) res.set('X-Cache-Stale', 'true');
    res.json(data);
  } catch (err) {
    handleError(res, err, 'Failed to fetch history');
  }
});

export default router;
