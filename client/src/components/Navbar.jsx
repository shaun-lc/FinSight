import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/risk-analytics', label: 'Risk Analytics' },
  { to: '/news', label: 'News' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold">FinSight</span>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-slate-200 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-300">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-sm hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
