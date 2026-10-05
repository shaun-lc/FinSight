export default function HoldingsTable({ holdings = [] }) {
  if (holdings.length === 0) {
    return <p className="text-sm text-gray-500">No holdings yet.</p>;
  }

  return (
    <table className="w-full text-sm bg-white rounded-lg shadow overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="px-4 py-2">Symbol</th>
          <th className="px-4 py-2">Shares</th>
          <th className="px-4 py-2">Avg. Cost</th>
          <th className="px-4 py-2">Current Price</th>
          <th className="px-4 py-2">Market Value</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((holding) => (
          <tr key={holding._id || holding.symbol} className="border-t">
            <td className="px-4 py-2 font-medium">{holding.symbol}</td>
            <td className="px-4 py-2">{holding.shares}</td>
            <td className="px-4 py-2">${Number(holding.avgCost ?? 0).toFixed(2)}</td>
            <td className="px-4 py-2">${Number(holding.currentPrice ?? 0).toFixed(2)}</td>
            <td className="px-4 py-2">
              ${(Number(holding.shares ?? 0) * Number(holding.currentPrice ?? 0)).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
