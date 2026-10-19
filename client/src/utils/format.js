// Shared display formatters. All numbers get thousands separators.

const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

export function formatNumber(n, maximumFractionDigits = 4) {
  if (!isNum(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits });
}

// $1,234.50 — pass { signed: true } for +$1,234.50 / -$1,234.50
export function formatDollars(n, { signed = false } = {}) {
  if (!isNum(n)) return '—';
  const abs = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const negative = n < 0 && Number(abs.replace(/,/g, '')) !== 0;
  if (negative) return `-$${abs}`;
  return signed ? `+$${abs}` : `$${abs}`;
}

// +1.2% / -3.4% (always signed, 1 decimal)
export function formatPercent(n) {
  if (!isNum(n)) return '—';
  const abs = Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${n < 0 && Number(abs.replace(/,/g, '')) !== 0 ? '-' : '+'}${abs}%`;
}
