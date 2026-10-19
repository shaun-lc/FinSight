import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateTickerParam } from '../middleware/validate.js';
import { getHistory, getQuote, PriceError } from '../services/priceService.js';

const router = express.Router();

router.use(authMiddleware);
router.param('ticker', validateTickerParam);

function handleError(res, err, fallbackMessage) {
  if (err instanceof PriceError) {
    return res.status(err.status).json({ message: err.message });
  }
  res.status(500).json({ message: fallbackMessage, error: err.message });
}

router.get('/quote/:ticker', async (req, res) => {
  try {
    res.json(await getQuote(req.params.ticker));
  } catch (err) {
    handleError(res, err, 'Failed to fetch quote');
  }
});

router.get('/history/:ticker', async (req, res) => {
  try {
    const { data, stale } = await getHistory(req.params.ticker);
    // Keep the body a plain array; flag staleness via header.
    if (stale) res.set('X-Cache-Stale', 'true');
    res.json(data);
  } catch (err) {
    handleError(res, err, 'Failed to fetch history');
  }
});

export default router;
