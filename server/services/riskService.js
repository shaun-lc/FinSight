/**
 * Placeholder risk analytics functions mirroring the client-side utilities,
 * used for server-computed risk metrics when needed.
 */

export function volatility(returns = []) {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance);
}

export function sharpeRatio(returns = [], riskFreeRate = 0) {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const vol = volatility(returns);
  if (vol === 0) return 0;
  return (mean - riskFreeRate) / vol;
}

export function valueAtRisk(returns = [], confidenceLevel = 0.95) {
  if (returns.length === 0) return 0;
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel) * sorted.length);
  return sorted[Math.max(0, index)];
}

export function stressTest(portfolioValue = 0, shockPercent = -0.2) {
  return portfolioValue * (1 + shockPercent);
}

export default { volatility, sharpeRatio, valueAtRisk, stressTest };
