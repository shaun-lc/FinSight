export default function NewsCard({ title, source, publishedAt, summary, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">
        {source} {publishedAt ? `· ${new Date(publishedAt).toLocaleDateString()}` : ''}
      </p>
      {summary && <p className="text-sm text-gray-700 mt-2">{summary}</p>}
    </a>
  );
}
