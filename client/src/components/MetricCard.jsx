export default function MetricCard({ label, value, color }) {
  const valueColor =
    color === 'green' ? 'text-green-500' :
    color === 'red' ? 'text-red-500' :
    'text-gray-900';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-1">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className={`text-2xl font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}