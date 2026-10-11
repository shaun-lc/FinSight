export default function HoldingsTable({ holdings = [], loading = false }) {
  const formatDollars = (n) => `$${Number(n).toFixed(2)}`;
  const formatPercent = (n) => `${n >= 0 ? '+' : ''}${Number(n).toFixed(1)}%`;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return <p className="text-sm text-gray-500">No holdings yet.</p>;
  }

  return (
    <table className="w-full text-sm bg-white rounded-lg shadow overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="px-4 py-2">Ticker</th>
          <th className="px-4 py-2">Qty</th>
          <th className="px-4 py-2">Avg Cost</th>
          <th className="px-4 py-2">Current Price</th>
          <th className="px-4 py-2">P&amp;L ($)</th>
          <th className="px-4 py-2">P&amp;L (%)</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((h) => {
          const pnlColor = h.pnl >= 0 ? 'text-green-500' : 'text-red-500';
          return (
            <tr key={h._id || h.symbol} className="border-t">
              <td className="px-4 py-2 font-medium">{h.symbol}</td>
              <td className="px-4 py-2">{h.shares}</td>
              <td className="px-4 py-2">{formatDollars(h.avgCost)}</td>
              <td className="px-4 py-2">{formatDollars(h.currentPrice)}</td>
              <td className={`px-4 py-2 font-medium ${pnlColor}`}>
                {formatDollars(h.pnl)}
              </td>
              <td className={`px-4 py-2 font-medium ${pnlColor}`}>
                {formatPercent(h.pnlPercent)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}s