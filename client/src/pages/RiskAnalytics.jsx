import { useMemo } from 'react';
import MetricCard from '../components/MetricCard';
import StressTestSlider from '../components/StressTestSlider';
import usePortfolio from '../hooks/usePortfolio';
import { sharpeRatio, valueAtRisk, volatility } from '../utils/riskCalculations';

const sampleReturns = [0.012, -0.018, 0.021, 0.004, -0.009, 0.015, -0.022];

export default function RiskAnalytics() {
  const { holdings } = usePortfolio();

  const totalValue = useMemo(
    () => holdings.reduce((sum, h) => sum + (h.shares ?? 0) * (h.currentPrice ?? 0), 0),
    [holdings]
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Risk Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Volatility" value={(volatility(sampleReturns) * 100).toFixed(2)} suffix="%" />
        <MetricCard label="Sharpe Ratio" value={sharpeRatio(sampleReturns).toFixed(2)} />
        <MetricCard
          label="Value at Risk (95%)"
          value={(valueAtRisk(sampleReturns, 0.95) * 100).toFixed(2)}
          suffix="%"
        />
      </div>

      <StressTestSlider portfolioValue={totalValue} />
    </div>
  );
}
