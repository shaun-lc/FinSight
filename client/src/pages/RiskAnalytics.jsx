import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import EmptyState from '../components/EmptyState';
import MetricCard from '../components/MetricCard';
import { ChartSkeleton, MetricCardSkeleton } from '../components/Skeletons';
import { useToast } from '../context/ToastContext';
import usePageTitle from '../hooks/usePageTitle';
import riskService from '../services/riskService';
import { reportError } from '../utils/errors';
import { formatDollars, formatPercent } from '../utils/format';

export default function RiskAnalytics() {
  usePageTitle('Risk Analytics');
  const { showToast } = useToast();
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stressDrop, setStressDrop] = useState(10);

  useEffect(() => {
    async function load() {
      try {
        const data = await riskService.fetchPortfolioRisk();
        setRisk(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load risk data');
        reportError(showToast, err, 'Failed to load risk data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const volLabel = (v) => {
    if (v < 0.15) return { text: 'Low risk', color: 'green' };
    if (v < 0.25) return { text: 'Moderate risk', color: 'yellow' };
    return { text: 'High risk', color: 'red' };
  };

  const sharpeLabel = (s) => {
    if (s > 1) return { text: 'Good risk-adjusted return', color: 'green' };
    if (s >= 0.5) return { text: 'Fair risk-adjusted return', color: 'yellow' };
    return { text: 'Poor risk-adjusted return', color: 'red' };
  };

  const histogramData = useMemo(() => {
    if (!risk || risk.dailyReturns.length === 0) return [];

    const returns = risk.dailyReturns;
    const min = Math.min(...returns);
    const max = Math.max(...returns);
    const binCount = 12;
    const binWidth = (max - min) / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      rangeStart: min + i * binWidth,
      rangeEnd: min + (i + 1) * binWidth,
      count: 0,
    }));

    returns.forEach((r) => {
      const idx = Math.min(Math.floor((r - min) / binWidth), binCount - 1);
      bins[idx].count++;
    });

    return bins.map((b) => ({
      label: formatPercent(b.rangeStart * 100),
      count: b.count,
      rangeStart: b.rangeStart,
    }));
  }, [risk]);

  const sortedRisks = useMemo(() => {
    if (!risk) return [];
    return [...risk.holdingRisks].sort((a, b) => b.contribution - a.contribution);
  }, [risk]);

  const riskBarColor = (contribution) => {
    if (contribution > 40) return '#E24B4A';
    if (contribution >= 15) return '#EF9F27';
    return '#378ADD';
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Risk Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <MetricCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }
  if (error) return <div className="p-4 md:p-6 text-sm text-red-600">{error}</div>;
  if (!risk) return null;

  if (risk.holdingRisks.length < 2) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold">Risk Analytics</h1>
        <EmptyState
          icon={ShieldExclamationIcon}
          message="Add at least 2 holdings to see risk metrics"
          linkTo="/portfolio"
          linkLabel="Go to Portfolio"
        />
      </div>
    );
  }

  const vol = volLabel(risk.volatilityAnnualised);
  const sharpe = sharpeLabel(risk.sharpeRatio);
  const estimatedLoss = risk.totalValue * (stressDrop / 100);
  const portfolioAfter = risk.totalValue - estimatedLoss;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Risk Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <MetricCard
            label="Annualised Volatility"
            value={`${(risk.volatilityAnnualised * 100).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`}
            color={vol.color === 'yellow' ? undefined : vol.color}
          />
          <p className={`text-xs mt-1 ml-1 ${
            vol.color === 'green' ? 'text-green-500' :
            vol.color === 'yellow' ? 'text-amber-500' : 'text-red-500'
          }`}>{vol.text}</p>
        </div>
        <div>
          <MetricCard
            label="Sharpe Ratio"
            value={risk.sharpeRatio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            color={sharpe.color === 'yellow' ? undefined : sharpe.color}
          />
          <p className={`text-xs mt-1 ml-1 ${
            sharpe.color === 'green' ? 'text-green-500' :
            sharpe.color === 'yellow' ? 'text-amber-500' : 'text-red-500'
          }`}>{sharpe.text}</p>
        </div>
        <div>
          <MetricCard
            label="VaR 95%"
            value={formatDollars(-risk.var95Dollar)}
            color="red"
          />
          <p className="text-xs mt-1 ml-1 text-red-500">Max daily loss (95% conf.)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Return Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={histogramData}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip formatter={(val) => [`${val} days`, 'Count']} />
              <ReferenceLine
                x={histogramData.find((b) => b.rangeStart <= risk.var95)?.label}
                stroke="#E24B4A"
                strokeDasharray="4 4"
                label={{ value: 'VaR', position: 'top', fill: '#E24B4A', fontSize: 11 }}
              />
              <Bar dataKey="count">
                {histogramData.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={entry.rangeStart <= risk.var95 ? '#B4B2A9' : '#378ADD'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Risk by Holding</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sortedRisks} layout="vertical">
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`}
              />
              <YAxis
                type="category"
                dataKey="ticker"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip formatter={(val) => [`${val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`, 'Contribution']} />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                {sortedRisks.map((entry) => (
                  <Cell key={entry.ticker} fill={riskBarColor(entry.contribution)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Stress Test</h3>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Market Drop</span>
              <span className="font-medium">{stressDrop}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={stressDrop}
              onChange={(e) => setStressDrop(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Estimated Loss</span>
              <p className="text-2xl font-semibold text-red-500">
                {formatDollars(-estimatedLoss)}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Portfolio After</span>
              <p className="text-2xl font-semibold text-gray-900">
                {formatDollars(portfolioAfter)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}