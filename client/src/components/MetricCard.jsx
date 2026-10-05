export default function MetricCard({ label, value, change, suffix = '' }) {
  const isPositive = typeof change === 'number' && change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-2xl font-semibold">
        {value}
        {suffix}
      </span>
      {typeof change === 'number' && (
        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}
          {change}%
        </span>
      )}
    </div>
  );
}
