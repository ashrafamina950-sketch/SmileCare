import { useEffect, useState } from 'react';
import api from '../api/client.js';

export function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill={light ? '#fff' : '#1d4ed8'} />
        <path
          d="M20 22c0-4 4-6 8-5 2 .6 3 .6 4 .6s2 0 4-.6c4-1 8 1 8 5 0 6-2 8-3 14-.6 4-1.2 11-4 11-2.5 0-2-8-5-8s-2.5 8-5 8c-2.8 0-3.4-7-4-11-1-6-3-8-3-14z"
          fill={light ? '#1d4ed8' : '#fff'}
        />
      </svg>
      <span className={`text-lg font-extrabold leading-none ${light ? 'text-white' : 'text-brand-700'}`}>
        SmileCare
        <span className="block text-sm font-bold">Dental</span>
      </span>
    </span>
  );
}

export function Stars({ value = 5, size = 'text-base' }) {
  return (
    <span className={`${size} tracking-wide text-amber-400`} aria-label={`${value} out of 5 stars`}>
      {'★'.repeat(value)}
      <span className="text-slate-300">{'★'.repeat(5 - value)}</span>
    </span>
  );
}

export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      {label}
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  const styles =
    type === 'error'
      ? 'bg-red-50 text-red-700 ring-red-200'
      : 'bg-green-50 text-green-700 ring-green-200';
  return <div className={`rounded-lg px-4 py-3 text-sm ring-1 ${styles}`}>{children}</div>;
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-gradient-to-b from-brand-50 to-white py-12 text-center">
      <div className="container-x">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-slate-600">{subtitle}</p>}
      </div>
    </div>
  );
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-2 max-w-2xl text-slate-600">{subtitle}</p>}
    </div>
  );
}

const ICONS = {
  shield: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.500-7-10V6l7-3zm-1 11l5-5-1.400-1.400L11 11.200 9.400 9.600 8 11l3 3z',
  sparkle: 'M12 2l1.800 5.200L19 9l-5.200 1.800L12 16l-1.800-5.200L5 9l5.200-1.800L12 2zm7 11l.9 2.600L22.500 16.500l-2.600.9L19 20l-.9-2.600-2.600-.9 2.600-.9L19 13z',
  braces: 'M3 8h18v3H3V8zm2 5h3v3H5v-3zm5.500 0h3v3h-3v-3zm5.500 0h3v3h-3v-3z',
  implant: 'M9 2h6v4l-1 2h-4L9 6V2zm1 8h4v2h-4v-2zm0 3h4v2h-4v-2zm0 3h4v2l-2 4-2-4v-2z',
  tooth: 'M7 3c-2 0-4 1.500-4 4 0 3 1.500 4 2 7 .5 3 1 7 3 7 1.700 0 1.500-5 4-5s2.300 5 4 5c2 0 2.500-4 3-7 .5-3 2-4 2-7 0-2.500-2-4-4-4-1.500 0-2.500.8-4 .8S8.500 3 7 3z',
};

export function ServiceIcon({ name = 'tooth', className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={ICONS[name] || ICONS.tooth} />
    </svg>
  );
}

/** Small fetch hook: returns { data, loading, error } */
export function useFetch(url, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    api
      .get(url)
      .then((r) => alive && setState({ data: r.data, loading: false, error: '' }))
      .catch((e) =>
        alive &&
        setState({ data: null, loading: false, error: e?.response?.data?.message || 'Could not load data' })
      );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);
  return state;
}
