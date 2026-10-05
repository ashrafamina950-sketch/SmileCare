import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from './ui.jsx';

const links = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/doctors', 'Doctors'],
  ['/reviews', 'Reviews'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition hover:text-brand-600 ${isActive? 'text-brand-600' : 'text-slate-800'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" aria-label="SmileCare Dental home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/book" className="btn-primary hidden md:inline-flex">
          Book Appointment
        </Link>
        <button
          className="rounded-md p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((o) =>!o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {open? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="container-x flex flex-col gap-4 py-4">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
                {label}
              </NavLink>
            ))}
            <Link to="/book" className="btn-primary">
              Book Appointment
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto bg-brand-800 text-blue-100">
      <div className="container-x grid gap-8 py-10 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-sm text-blue-200">
            Committed to compassionate, modern dental care for all ages.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-base font-bold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {links.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-base font-bold text-white">Open Hours</h3>
          <ul className="space-y-1 text-sm">
            <li>Mon - Fri: 9:00am - 6:00pm</li>
            <li>Saturday: 9:00am - 4:00pm</li>
            <li>Sunday: Closed</li>
          </ul>
          <p className="mt-3 text-sm">123 Dental Avenue, Los Angeles, CA 90028</p>
          <p className="text-sm">(555) 210-6890 · info@smilecaredental.com</p>
        </div>
      </div>
      <div className="bg-brand-900 py-3 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} SmileCare Dental. All rights reserved.
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}