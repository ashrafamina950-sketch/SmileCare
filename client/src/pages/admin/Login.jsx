import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { errMsg } from '../../api/client.js';
import { Alert, Logo } from '../../components/ui.jsx';

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-xl font-bold">Admin Login</h1>
        <div>
          <label className="label" htmlFor="a-email">Email</label>
          <input id="a-email" type="email" className="input" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="a-pass">Password</label>
          <input id="a-pass" type="password" className="input" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Alert>{error}</Alert>
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
