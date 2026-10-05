import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../../api/client.js';
import { Alert, Spinner } from '../../components/ui.jsx';

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/messages');
      setItems(data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (m) => {
    await api.put(`/messages/${m._id}`, { read: !m.read }).catch((e) => setError(errMsg(e)));
    load();
  };

  const remove = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    await api.delete(`/messages/${m._id}`).catch((e) => setError(errMsg(e)));
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Messages</h1>
      <Alert>{error}</Alert>
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="card text-sm text-slate-500">No messages yet.</div>
      ) : (
        items.map((m) => (
          <article key={m._id} className={`card ${m.read ? 'opacity-75' : 'ring-brand-200'}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-bold">
                  {m.subject || '(no subject)'} {!m.read && <span className="ml-1 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">New</span>}
                </h2>
                <p className="text-sm text-slate-500">
                  {m.name} ·{' '}
                  <a className="text-brand-600 hover:underline" href={`mailto:${m.email}`}>{m.email}</a> ·{' '}
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button className="rounded bg-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-300" onClick={() => toggle(m)}>
                  Mark {m.read ? 'unread' : 'read'}
                </button>
                <button className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700" onClick={() => remove(m)}>
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{m.message}</p>
          </article>
        ))
      )}
    </div>
  );
}
