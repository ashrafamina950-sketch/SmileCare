import { Link } from 'react-router-dom';
import { Alert, Spinner, useFetch } from '../../components/ui.jsx';
import { StatusBadge } from './Appointments.jsx';

export default function Dashboard() {
  const { data, loading, error } = useFetch('/appointments/stats');
  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;

  const cards = [
    ['Today’s appointments', data.today],
    ['Pending approval', data.pending],
    ['Approved', data.approved],
    ['Total appointments', data.total],
    ['Unique patients', data.patients],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="card">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-700">{value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Latest requests</h2>
          <Link to="/admin/appointments" className="text-sm font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        {data.recent.length === 0 ? (
          <p className="text-sm text-slate-500">No appointments yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.recent.map((a) => (
              <li key={a._id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-slate-500">
                    {new Date(a.date).toLocaleDateString()} · {a.time} · {a.doctor?.name || 'Any doctor'}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
