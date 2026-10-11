export function calcDailyReturns(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

export function calcVolatility(dailyReturns) {
  if (dailyReturns.length < 2) return { daily: 0, annualised: 0 };
  const n = dailyReturns.length;
  const mean = dailyReturns.reduce((sum, r) => sum + r, 0) / n;
  const variance = dailyReturns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (n - 1);
  const daily = Math.sqrt(variance);
  const annualised = daily * Math.sqrt(252);
  return { daily, annualised };
}

export function calcSharpeRatio(dailyReturns, riskFreeRate = 0.05) {
  if (dailyReturns.length < 2) return 0;
  const mean = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
  const annualisedReturn = mean * 252;
  const { annualised: annualisedVol } = calcVolatility(dailyReturns);
  if (annualisedVol === 0) return 0;
  return (annualisedReturn - riskFreeRate) / annualisedVol;
}

export function calcVaR(dailyReturns, confidence = 0.95) {
  if (dailyReturns.length === 0) return { percent: 0, dollar: 0 };
  const sorted = [...dailyReturns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  const percent = sorted[Math.max(0, index)];
  return { percent };
}

export function calcHoldingRiskContributions(holdings, histories) {
  const contributions = holdings.map((h, i) => {
    const prices = histories[i].map((p) => p.close);
    const returns = calcDailyReturns(prices);
    const { daily: vol } = calcVolatility(returns);
    const weight = h.shares * (prices[prices.length - 1] || 0);
    return { ticker: h.symbol, raw: vol * weight };
  });

  const totalRaw = contributions.reduce((sum, c) => sum + c.raw, 0);

  return contributions.map((c) => ({
    ticker: c.ticker,
    contribution: totalRaw > 0 ? (c.raw / totalRaw) * 100 : 0,
  }));
}

export default {
  calcDailyReturns,
  calcVolatility,
  calcSharpeRatio,
  calcVaR,
  calcHoldingRiskContributions,
};