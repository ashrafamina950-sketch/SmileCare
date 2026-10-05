import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../../api/client.js';
import { Alert, Spinner } from '../../components/ui.jsx';

const COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${COLORS[status]}`}>{status}</span>
);

const toInputDate = (d) => new Date(d).toISOString().slice(0, 10);

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // reschedule modal

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments', { params: filter ? { status: filter } : {} });
      setItems(data);
      setError('');
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (id, body) => {
    try {
      await api.put(`/appointments/${id}`, body);
      setEditing(null);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Appointments</h1>
        <select className="input !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {Object.keys(COLORS).map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>
      <Alert>{error}</Alert>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="card text-sm text-slate-500">No appointments found.</div>
      ) : (
        <div className="card overflow-x-auto !p-0">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Patient</th>
                <th className="p-3">Date & time</th>
                <th className="p-3">Doctor / Service</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((a) => (
                <tr key={a._id} className="align-top">
                  <td className="p-3">
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-slate-500">{a.phone}</p>
                    <p className="text-slate-500">{a.email}</p>
                  </td>
                  <td className="p-3">
                    {new Date(a.date).toLocaleDateString()}
                    <br />
                    {a.time}
                  </td>
                  <td className="p-3">
                    {a.doctor?.name || '—'}
                    <br />
                    <span className="text-slate-500">{a.service || 'General checkup'}</span>
                    {a.notes && <p className="mt-1 max-w-xs text-xs italic text-slate-500">“{a.notes}”</p>}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {a.status === 'pending' && (
                        <button className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700" onClick={() => update(a._id, { status: 'approved' })}>
                          Approve
                        </button>
                      )}
                      {a.status === 'approved' && (
                        <button className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700" onClick={() => update(a._id, { status: 'completed' })}>
                          Complete
                        </button>
                      )}
                      {['pending', 'approved'].includes(a.status) && (
                        <>
                          <button className="rounded bg-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-300" onClick={() => setEditing({ id: a._id, date: toInputDate(a.date), time: a.time })}>
                            Reschedule
                          </button>
                          <button className="rounded bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-600" onClick={() => update(a._id, { status: 'cancelled' })}>
                            Cancel
                          </button>
                        </>
                      )}
                      <button className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700" onClick={() => remove(a._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="card w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold">Reschedule</h2>
            <div>
              <label className="label" htmlFor="rs-date">Date</label>
              <input id="rs-date" type="date" className="input" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="rs-time">Time</label>
              <input id="rs-time" type="time" className="input" value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setEditing(null)}>Close</button>
              <button className="btn-primary" onClick={() => update(editing.id, { date: editing.date, time: editing.time, status: 'approved' })}>
                Save & approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
