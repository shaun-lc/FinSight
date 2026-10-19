import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import useAuth from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import News from './pages/News';
import Portfolio from './pages/Portfolio';
import Register from './pages/Register';
import RiskAnalytics from './pages/RiskAnalytics';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { token } = useAuth();

  return (
    <div className={`min-h-screen bg-gray-50 ${token ? 'pb-16 md:pb-0' : ''}`}>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/risk-analytics"
          element={
            <ProtectedRoute>
              <RiskAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
