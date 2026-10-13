import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../services/newsService';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await newsService.fetchNewsFeed();
        if (!cancelled) setArticles(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load news');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const tickers = useMemo(
    () => [...new Set(articles.map((a) => a.ticker))],
    [articles]
  );

  const filtered = filter === 'All'
    ? articles
    : articles.filter((a) => a.ticker === filter);

  const timeAgo = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Market News</h1>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
            <div className="w-20 h-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Market News</h1>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Market News</h1>
        <p className="text-sm text-gray-500">
          Add some holdings to see relevant news.{' '}
          <Link to="/portfolio" className="text-blue-500 hover:underline">
            Go to Portfolio
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Market News</h1>

      <div className="flex flex-wrap gap-2">
        {['All', ...tickers].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === t
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((article) => (
          <a
            key={article.url || article.headline}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow flex gap-4"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{article.headline}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  {article.source} · {timeAgo(article.datetime)}
                </span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {article.ticker}
                </span>
              </div>
              {article.summary && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{article.summary}</p>
              )}
            </div>
            {article.image && (
              <img
                src={article.image}
                alt=""
                className="w-20 h-20 rounded object-cover flex-shrink-0"
              />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}