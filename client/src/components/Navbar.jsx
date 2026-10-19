import {
  ChartBarIcon,
  HomeIcon,
  NewspaperIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const links = [
  { to: '/', label: 'Dashboard', icon: HomeIcon },
  { to: '/portfolio', label: 'Portfolio', icon: ChartBarIcon },
  { to: '/risk-analytics', label: 'Risk Analytics', icon: ShieldCheckIcon },
  { to: '/news', label: 'News', icon: NewspaperIcon },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-slate-900 text-white px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold">FinSight</span>
          <div className="hidden md:flex gap-4">
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
              <span className="hidden sm:inline text-sm text-slate-300">{user.name}</span>
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

      {/* Mobile: fixed bottom navigation, icons only */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900 border-t border-slate-700 flex justify-around">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            aria-label={label}
            title={label}
            className={({ isActive }) =>
              `flex-1 flex justify-center py-3 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Icon className="h-6 w-6" />
          </NavLink>
        ))}
      </nav>
    </>
  );
}
