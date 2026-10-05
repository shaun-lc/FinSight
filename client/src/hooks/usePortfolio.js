import { useCallback, useEffect, useState } from 'react';
import holdingsService from '../services/holdingsService';

export function usePortfolio() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoldings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await holdingsService.getHoldings();
      setHoldings(data);
    } catch (err) {
      setError(err.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  return { holdings, loading, error, refresh: fetchHoldings };
}

export default usePortfolio;
