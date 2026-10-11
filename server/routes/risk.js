import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Holding from '../models/Holding.js';
import PriceCache from '../models/PriceCache.js';
import { getHistory } from '../services/priceService.js';
import {
  calcDailyReturns,
  calcHoldingRiskContributions,
  calcSharpeRatio,
  calcVaR,
  calcVolatility,
} from '../services/riskService.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/portfolio', async (req, res) => {
  try {
    const holdings = await Holding.find({ user: req.userId });

    if (holdings.length === 0) {
      return res.json({
        volatility: 0,
        volatilityAnnualised: 0,
        sharpeRatio: 0,
        var95: 0,
        var95Dollar: 0,
        totalValue: 0,
        dailyReturns: [],
        holdingRisks: [],
      });
    }

    const histories = await Promise.all(
      holdings.map(async (h) => {
        let docs = await PriceCache.find({ ticker: h.symbol, type: 'daily' })
          .sort({ date: 1 })
          .select('date close -_id')
          .lean();

        if (docs.length < 2) {
          await getHistory(h.symbol);
          docs = await PriceCache.find({ ticker: h.symbol, type: 'daily' })
            .sort({ date: 1 })
            .select('date close -_id')
            .lean();
        }

        return docs;
      })
    );

    const dateMap = {};
    holdings.forEach((h, i) => {
      histories[i].forEach((point) => {
        if (!dateMap[point.date]) dateMap[point.date] = 0;
        dateMap[point.date] += point.close * h.shares;
      });
    });

    const portfolioSeries = Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);

    const dailyReturns = calcDailyReturns(portfolioSeries);
    const { daily: vol, annualised: volAnnualised } = calcVolatility(dailyReturns);
    const sharpe = calcSharpeRatio(dailyReturns);
    const { percent: var95 } = calcVaR(dailyReturns, 0.95);
    const totalValue = portfolioSeries[portfolioSeries.length - 1] || 0;
    const var95Dollar = Math.abs(var95) * totalValue;
    const holdingRisks = calcHoldingRiskContributions(holdings, histories);

    res.json({
      volatility: vol,
      volatilityAnnualised: volAnnualised,
      sharpeRatio: sharpe,
      var95,
      var95Dollar,
      totalValue,
      dailyReturns,
      holdingRisks,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute risk metrics', error: err.message });
  }
});

export default router;