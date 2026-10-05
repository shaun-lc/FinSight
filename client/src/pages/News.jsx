import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import api from '../services/api';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/news');
        if (isMounted) setArticles(res.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load news');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Market News</h1>

      {loading && <p className="text-sm text-gray-500">Loading news...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <NewsCard key={article.url || article.title} {...article} />
        ))}
      </div>
    </div>
  );
}
