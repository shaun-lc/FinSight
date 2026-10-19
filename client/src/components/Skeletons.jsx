const Bar = ({ className = '' }) => <div className={`bg-gray-200 rounded ${className}`} />;

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 animate-pulse">
      <Bar className="h-3 w-1/3" />
      <Bar className="h-7 w-2/3" />
    </div>
  );
}

export function ChartSkeleton({ height = 250 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
      <Bar className="h-4 w-1/4 mb-3" />
      <div className="bg-gray-100 rounded" style={{ height }} />
    </div>
  );
}

// Renders <tr>s; place inside a <tbody>.
export function TableRowsSkeleton({ rows = 4, cols = 6 }) {
  return Array.from({ length: rows }, (_, r) => (
    <tr key={r} className="border-t animate-pulse">
      {Array.from({ length: cols }, (_, c) => (
        <td key={c} className="px-4 py-3">
          <Bar className="h-4 w-full" />
        </td>
      ))}
    </tr>
  ));
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 animate-pulse flex gap-4">
      <div className="flex-1 space-y-2">
        <Bar className="h-4 w-3/4" />
        <Bar className="h-3 w-1/3" />
        <Bar className="h-3 w-full" />
      </div>
      <Bar className="hidden sm:block w-20 h-20 flex-shrink-0" />
    </div>
  );
}
