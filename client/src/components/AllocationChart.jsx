import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#85B7EB', '#5DCAA5', '#F0997B', '#AFA9EC', '#ED93B1', '#97C459'];

export default function AllocationChart({ data = [] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No allocation data available.</p>;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {payload.map((entry) => {
          const pct = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
          return (
            <span key={entry.value} className="flex items-center gap-1 text-xs text-gray-600">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.value} {pct}%
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Allocation</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `$${Number(val).toFixed(2)}`} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}