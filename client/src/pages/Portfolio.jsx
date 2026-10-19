import { useMemo } from 'react';
import AllocationChart from '../components/AllocationChart';
import HoldingsTable from '../components/HoldingsTable';
import { ChartSkeleton } from '../components/Skeletons';
import usePageTitle from '../hooks/usePageTitle';
import usePortfolio from '../hooks/usePortfolio';

export default function Portfolio() {
  usePageTitle('Portfolio');
  const { holdings, loading, error, refresh } = usePortfolio();

  const allocationData = useMemo(
    () =>
      holdings.map((h) => ({
        name: h.symbol,
        value: (h.shares ?? 0) * (h.currentPrice ?? 0),
      })),
    [holdings]
  );

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <button
          onClick={refresh}
          className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoldingsTable holdings={holdings} loading={loading} />
        {loading ? <ChartSkeleton height={280} /> : <AllocationChart data={allocationData} />}
      </div>
    </div>
  );
}
