import PriceCache from '../models/PriceCache.js';

const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Fetches a quote for a symbol. Uses the Alpha Vantage API when ALPHA_VANTAGE_API_KEY
 * is configured, falling back to a cached/mock price otherwise.
 */
export async function getQuote(symbol) {
  const upperSymbol = symbol.toUpperCase();
  const cached = await PriceCache.findOne({ symbol: upperSymbol });

  if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
    return { symbol: upperSymbol, price: cached.price, source: 'cache' };
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  let price = cached?.price ?? 0;

  if (apiKey) {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${upperSymbol}&apikey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const quoted = Number(data?.['Global Quote']?.['05. price']);
      if (!Number.isNaN(quoted) && quoted > 0) {
        price = quoted;
      }
    } catch (err) {
      console.error(`Failed to fetch quote for ${upperSymbol}:`, err.message);
    }
  } else {
    // No API key configured: return a deterministic placeholder price.
    price = price || 100;
  }

  await PriceCache.findOneAndUpdate(
    { symbol: upperSymbol },
    { symbol: upperSymbol, price, fetchedAt: new Date() },
    { upsert: true }
  );

  return { symbol: upperSymbol, price, source: apiKey ? 'alpha_vantage' : 'placeholder' };
}

export async function getQuotes(symbols = []) {
  return Promise.all(symbols.map((symbol) => getQuote(symbol)));
}

export default { getQuote, getQuotes };
