import axios from 'axios';
import PriceCache from '../models/PriceCache.js';

const BASE_URL = 'https://www.alphavantage.co/query';
const CACHE_TTL_MS = 60 * 60 * 1000;
const MIN_HISTORY_DAYS = 90;

export class PriceError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const isFresh = (fetchedAt) => fetchedAt && Date.now() - new Date(fetchedAt).getTime() < CACHE_TTL_MS;

async function callAlphaVantage(params) {
  let data;
  try {
    const res = await axios.get(BASE_URL, {
      params: { ...params, apikey: process.env.ALPHA_VANTAGE_API_KEY },
      timeout: 10000,
    });
    data = res.data;
  } catch (err) {
    throw new PriceError(502, `Price provider unreachable: ${err.message}`);
  }
  // Alpha Vantage reports errors with HTTP 200 and a message key.
  if (data?.Note || data?.Information) {
    throw new PriceError(429, 'Price provider rate limit reached');
  }
  if (data?.['Error Message']) {
    throw new PriceError(404, 'Ticker not found');
  }
  return data;
}

const toQuoteDto = (doc) => ({
  ticker: doc.ticker,
  price: doc.price,
  tradingDay: doc.tradingDay,
  changePercent: doc.changePercent,
  fetchedAt: doc.fetchedAt,
});

export async function getQuote(ticker) {
  const cached = await PriceCache.findOne({ ticker, type: 'quote' }).lean();
  if (cached && isFresh(cached.fetchedAt)) return toQuoteDto(cached);

  try {
    const data = await callAlphaVantage({ function: 'GLOBAL_QUOTE', symbol: ticker });
    const q = data?.['Global Quote'];
    if (!q || Object.keys(q).length === 0) throw new PriceError(404, 'Ticker not found');

    const price = Number(q['05. price']);
    const changePercent = parseFloat(q['10. change percent']);
    const tradingDay = q['07. latest trading day'];
    if (!Number.isFinite(price) || !Number.isFinite(changePercent) || !tradingDay) {
      throw new PriceError(502, 'Unexpected response from price provider');
    }

    const doc = await PriceCache.findOneAndUpdate(
      { ticker, type: 'quote' },
      { $set: { price, tradingDay, changePercent, fetchedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return toQuoteDto(doc);
  } catch (err) {
    if (cached && (err.status === 429 || err.status === 502)) {
      return { ...toQuoteDto(cached), stale: true };
    }
    throw err;
  }
}

export async function getHistory(ticker) {
  const readCache = () =>
    PriceCache.find({ ticker, type: 'daily' }).sort({ date: 1 }).select('date close fetchedAt -_id').lean();
  const toDto = (docs) => docs.map(({ date, close }) => ({ date, close }));

  const cached = await readCache();
  if (cached.length >= MIN_HISTORY_DAYS) {
    const newestFetch = Math.max(...cached.map((d) => new Date(d.fetchedAt).getTime()));
    if (isFresh(newestFetch)) return { data: toDto(cached) };
  }

  try {
    const data = await callAlphaVantage({
      function: 'TIME_SERIES_DAILY',
      symbol: ticker,
      outputsize: 'compact',
    });
    const series = data?.['Time Series (Daily)'];
    if (!series || Object.keys(series).length === 0) throw new PriceError(404, 'Ticker not found');

    const fetchedAt = new Date();
    const ops = Object.entries(series)
      .map(([date, v]) => ({ date, close: Number(v['4. close']) }))
      .filter((d) => Number.isFinite(d.close))
      .map(({ date, close }) => ({
        updateOne: {
          filter: { ticker, type: 'daily', date },
          update: { $set: { close, fetchedAt } },
          upsert: true,
        },
      }));
    if (ops.length === 0) throw new PriceError(502, 'Unexpected response from price provider');

    await PriceCache.bulkWrite(ops, { ordered: false });
    return { data: toDto(await readCache()) };
  } catch (err) {
    if (cached.length > 0 && (err.status === 429 || err.status === 502)) {
      return { data: toDto(cached), stale: true };
    }
    throw err;
  }
}
