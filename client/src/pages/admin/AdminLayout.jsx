import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Logo, Spinner } from '../../components/ui.jsx';

const nav = [
  ['/admin', 'Dashboard', true],
  ['/admin/appointments', 'Appointments'],
  ['/admin/doctors', 'Doctors'],
  ['/admin/services', 'Services'],
  ['/admin/reviews', 'Reviews'],
  ['/admin/messages', 'Messages'],
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <Spinner />;
  if (!admin) return <Navigate to="/admin/login" replace />;

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-white text-brand-700' : 'text-blue-100 hover:bg-white/10'
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 transform bg-brand-800 p-4 transition md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/admin" className="mb-6 block">
          <Logo light />
        </Link>
        <nav className="space-y-1" onClick={() => setOpen(false)}>
          {nav.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-4 bottom-4 space-y-2 text-sm">
          <Link to="/" target="_blank" className="block text-blue-200 hover:text-white">
            View website ↗
          </Link>
          <button onClick={logout} className="w-full rounded-lg bg-white/10 px-3 py-2 text-left font-semibold text-white hover:bg-white/20">
            Log out
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <button className="rounded-md p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-auto text-sm text-slate-600">
            Signed in as <b>{admin.email}</b>
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
