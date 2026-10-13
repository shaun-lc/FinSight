import axios from 'axios';
import PriceCache from '../models/PriceCache.js';

const FINNHUB_URL = 'https://finnhub.io/api/v1/company-news';
const CACHE_TTL_MS = 60 * 60 * 1000;

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export async function fetchCompanyNews(ticker) {
  const cached = await PriceCache.findOne({ ticker, type: 'news' }).lean();

  if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MS) {
    return cached.articles;
  }

  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 30);

  let articles = [];
  try {
    const res = await axios.get(FINNHUB_URL, {
      params: {
        symbol: ticker,
        from: formatDate(from),
        to: formatDate(now),
        token: process.env.FINNHUB_API_KEY,
      },
      timeout: 10000,
    });
    articles = res.data;
  } catch {
    if (cached) return cached.articles;
    return [];
  }

  const top10 = articles.slice(0, 10).map((a) => ({
    headline: a.headline,
    summary: a.summary,
    url: a.url,
    source: a.source,
    datetime: a.datetime,
    image: a.image,
  }));

  await PriceCache.findOneAndUpdate(
    { ticker, type: 'news' },
    { $set: { articles: top10, fetchedAt: new Date() } },
    { upsert: true }
  );

  return top10;
}

export default { fetchCompanyNews };