import { useMemo } from 'react';
import MetricCard from '../components/MetricCard';
import PortfolioChart from '../components/PortfolioChart';
import usePortfolio from '../hooks/usePortfolio';
import { sharpeRatio, volatility } from '../utils/riskCalculations';

export default function Dashboard() {
  const { holdings, loading, error } = usePortfolio();

  const totalValue = useMemo(
    () => holdings.reduce((sum, h) => sum + (h.shares ?? 0) * (h.currentPrice ?? 0), 0),
    [holdings]
  );

  const sampleReturns = [0.01, -0.015, 0.02, 0.005, -0.01];

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {loading && <p className="text-sm text-gray-500">Loading portfolio...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Portfolio Value" value={`$${totalValue.toFixed(2)}`} />
        <MetricCard label="Holdings" value={holdings.length} />
        <MetricCard label="Volatility" value={(volatility(sampleReturns) * 100).toFixed(2)} suffix="%" />
        <MetricCard label="Sharpe Ratio" value={sharpeRatio(sampleReturns).toFixed(2)} />
      </div>

      <PortfolioChart data={[]} />
    </div>
  );
}
