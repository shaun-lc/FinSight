import { formatDollars, formatNumber, formatPercent } from '../utils/format';
import { TableRowsSkeleton } from './Skeletons';

const COLUMNS = ['Ticker', 'Qty', 'Avg Cost', 'Current Price', 'P&L ($)', 'P&L (%)'];

export default function HoldingsTable({ holdings = [], loading = false }) {
  if (!loading && holdings.length === 0) {
    return <p className="text-sm text-gray-500">No holdings yet.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            {COLUMNS.map((c) => (
              <th key={c} className="px-4 py-2 whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableRowsSkeleton rows={4} cols={COLUMNS.length} />
          ) : (
            holdings.map((h) => {
              const pnlColor = h.pnl >= 0 ? 'text-green-500' : 'text-red-500';
              return (
                <tr key={h._id || h.symbol} className="border-t">
                  <td className="px-4 py-2 font-medium">{h.symbol}</td>
                  <td className="px-4 py-2">{formatNumber(h.shares)}</td>
                  <td className="px-4 py-2">{formatDollars(h.avgCost)}</td>
                  <td className="px-4 py-2">{formatDollars(h.currentPrice)}</td>
                  <td className={`px-4 py-2 font-medium ${pnlColor}`}>
                    {formatDollars(h.pnl, { signed: true })}
                  </td>
                  <td className={`px-4 py-2 font-medium ${pnlColor}`}>
                    {formatPercent(h.pnlPercent)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
