import { useEffect, useMemo, useState } from 'react';
import AllocationChart from '../components/AllocationChart';
import MetricCard from '../components/MetricCard';
import PortfolioChart from '../components/PortfolioChart';
import usePortfolio from '../hooks/usePortfolio';
import priceService from '../services/priceService';

export default function Dashboard() {
  const { holdings, loading, error, totals } = usePortfolio();
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (holdings.length === 0) return;

    let cancelled = false;
    setHistoryLoading(true);

    async function fetchHistory() {
      try {
        const histories = await Promise.all(
          holdings.map((h) =>
            priceService.fetchHistory(h.symbol).catch(() => [])
          )
        );

        const dateMap = {};

        holdings.forEach((h, i) => {
          histories[i].forEach((point) => {
            if (!dateMap[point.date]) dateMap[point.date] = 0;
            dateMap[point.date] += point.close * h.shares;
          });
        });

        const sorted = Object.entries(dateMap)
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => a.date.localeCompare(b.date));

        if (!cancelled) {
          setHistoryData(sorted);
        }
      } catch {
        // history is non-critical, fail silently
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    fetchHistory();

    return () => { cancelled = true; };
  }, [holdings]);

  const allocationData = useMemo(
    () => holdings.map((h) => ({ name: h.symbol, value: h.currentPrice * h.shares })),
    [holdings]
  );

  const formatDollars = (n) => `$${Math.abs(n).toFixed(2)}`;
  const formatPercent = (n) => `${n >= 0 ? '+' : '-'}${Math.abs(n).toFixed(1)}%`;
  const sign = (n) => (n >= 0 ? '+$' : '-$');

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {loading && <p className="text-sm text-gray-500">Loading portfolio...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Value" value={formatDollars(totals.totalValue)} />
        <MetricCard
          label="Today's P&L"
          value={`${sign(totals.dayChange)}${Math.abs(totals.dayChange).toFixed(2)}`}
          color={totals.dayChange >= 0 ? 'green' : 'red'}
        />
        <MetricCard
          label="Total Return"
          value={formatPercent(totals.totalGainPercent)}
          color={totals.totalGainPercent >= 0 ? 'green' : 'red'}
        />
        <MetricCard label="Holdings" value={holdings.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <PortfolioChart data={historyData} />
        </div>
        <div className="lg:col-span-2">
          <AllocationChart data={allocationData} />
        </div>
      </div>
    </div>
  );
}