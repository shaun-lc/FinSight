import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  validateHoldingCreate,
  validateHoldingUpdate,
  validateObjectIdParam,
} from '../middleware/validate.js';
import Holding from '../models/Holding.js';

const router = express.Router();

router.use(authMiddleware);
router.param('id', validateObjectIdParam);

router.get('/', async (req, res) => {
  try {
    const holdings = await Holding.find({ user: req.userId }).sort({ symbol: 1 });
    res.json(holdings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch holdings', error: err.message });
  }
});

router.post('/', validateHoldingCreate, async (req, res) => {
  try {
    const { symbol, shares, avgCost, currentPrice, buyDate } = req.body;

    const holding = await Holding.create({
      user: req.userId,
      symbol,
      shares,
      avgCost,
      currentPrice: currentPrice ?? 0,
      buyDate,
    });
    res.status(201).json(holding);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create holding', error: err.message });
  }
});

router.put('/:id', validateHoldingUpdate, async (req, res) => {
  try {
    const { symbol, shares, avgCost, currentPrice, buyDate } = req.body;
    const updates = Object.fromEntries(
      Object.entries({ symbol, shares, avgCost, currentPrice, buyDate }).filter(
        ([, v]) => v !== undefined
      )
    );
    const holding = await Holding.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!holding) {
      return res.status(404).json({ message: 'Holding not found' });
    }
    res.json(holding);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update holding', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const holding = await Holding.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!holding) {
      return res.status(404).json({ message: 'Holding not found' });
    }
    res.json({ message: 'Holding deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete holding', error: err.message });
  }
});

export default router;
