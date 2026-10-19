import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import useAuth from '../hooks/useAuth';

export default function Login() {
  usePageTitle('Log in');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-bold text-center">Log in to FinSight</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-slate-900 text-white rounded py-2 text-sm hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
