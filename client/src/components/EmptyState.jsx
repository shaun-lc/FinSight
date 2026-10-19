import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, message, linkTo, linkLabel }) {
  return (
    <div className="text-gray-500 text-center py-12">
      {Icon && <Icon className="h-10 w-10 mx-auto mb-3 text-gray-400" />}
      <p>{message}</p>
      {linkTo && (
        <Link to={linkTo} className="inline-block mt-3 text-sm text-blue-500 hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
