import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { reportError } from '../utils/errors';
import holdingsService from '../services/holdingsService';
import priceService from '../services/priceService';

export function usePortfolio() {
  const { showToast } = useToast();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await holdingsService.getHoldings();

      const quotes = await Promise.all(
        data.map((h) => priceService.fetchQuote(h.symbol).catch(() => null))
      );

      const merged = data.map((h, i) => {
        const quote = quotes[i];
        const currentPrice = quote?.price ?? h.currentPrice ?? 0;
        const changePercent = quote?.changePercent ?? 0;
        const pnl = (currentPrice - h.avgCost) * h.shares;
        const pnlPercent = h.avgCost > 0 ? ((currentPrice - h.avgCost) / h.avgCost) * 100 : 0;
        return { ...h, currentPrice, changePercent, pnl, pnlPercent };
      });

      setHoldings(merged);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load portfolio');
      reportError(showToast, err, 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const totals = useMemo(() => {
    const totalValue = holdings.reduce((sum, h) => sum + h.currentPrice * h.shares, 0);
    const totalCost = holdings.reduce((sum, h) => sum + h.avgCost * h.shares, 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    const dayChange = holdings.reduce((sum, h) => {
      const prevPrice = h.currentPrice / (1 + h.changePercent / 100);
      return sum + (h.currentPrice - prevPrice) * h.shares;
    }, 0);
    return { totalValue, totalCost, totalGain, totalGainPercent, dayChange };
  }, [holdings]);

  return { holdings, loading, error, totals, refresh: fetchPortfolio };
}

export default usePortfolio;