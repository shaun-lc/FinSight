import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PortfolioChart({ data = [] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No portfolio history available.</p>;
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDollars = (val) => `$${Number(val).toLocaleString()}`;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Portfolio Value</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#378ADD" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#378ADD" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatDollars}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            formatter={(val) => [formatDollars(val), 'Value']}
            labelFormatter={formatDate}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#378ADD"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}