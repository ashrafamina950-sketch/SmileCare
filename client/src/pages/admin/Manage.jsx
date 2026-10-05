import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../../api/client.js';
import { Alert, Spinner } from '../../components/ui.jsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Generic admin CRUD screen.
 * fields: [{ key, label, type: text|textarea|number|days|checkbox|select, options?, required? }]
 * columns: [{ key, label, render? }]
 */
function Manage({ title, endpoint, fields, columns, empty }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null); // null = closed
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(endpoint, { params: { all: 1 } });
      setItems(data);
      setError('');
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const open = (item) => setForm(item ? { ...item } : { ...empty });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { _id, createdAt, updatedAt, __v, slug, ...body } = form;
      if (_id) await api.put(`${endpoint}/${_id}`, body);
      else await api.post(endpoint, body);
      setForm(null);
      load();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm('Delete this item permanently?')) return;
    try {
      await api.delete(`${endpoint}/${item._id}`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <button className="btn-primary" onClick={() => open(null)}>
          + Add new
        </button>
      </div>
      {!form && <Alert>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="card text-sm text-slate-500">Nothing here yet.</div>
      ) : (
        <div className="card overflow-x-auto !p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="p-3">{c.label}</th>
                ))}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it._id}>
                  {columns.map((c) => (
                    <td key={c.key} className="p-3">{c.render ? c.render(it) : it[c.key]}</td>
                  ))}
                  <td className="p-3">
                    <div className="flex justify-end gap-1.5">
                      <button className="rounded bg-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-300" onClick={() => open(it)}>
                        Edit
                      </button>
                      <button className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700" onClick={() => remove(it)}>
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

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4" role="dialog" aria-modal="true">
          <form onSubmit={save} className="card my-8 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-bold">{form._id ? 'Edit' : 'Add'} {title.replace(/s$/, '')}</h2>
            {fields.map((f) => (
              <div key={f.key}>
                {f.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setField(f.key, e.target.checked)} />
                    {f.label}
                  </label>
                ) : f.type === 'days' ? (
                  <>
                    <span className="label">{f.label}</span>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((d) => {
                        const on = form[f.key]?.includes(d);
                        return (
                          <button
                            type="button"
                            key={d}
                            onClick={() => setField(f.key, on ? form[f.key].filter((x) => x !== d) : [...(form[f.key] || []), d])}
                            className={`rounded-lg border px-3 py-1.5 text-sm ${on ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'}`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <label className="label" htmlFor={`f-${f.key}`}>{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea id={`f-${f.key}`} className="input min-h-28" required={f.required} value={form[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)} />
                    ) : f.type === 'select' ? (
                      <select id={`f-${f.key}`} className="input" value={form[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)}>
                        {f.options.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`f-${f.key}`}
                        type={f.type === 'number' ? 'number' : 'text'}
                        className="input"
                        required={f.required}
                        value={form[f.key] ?? ''}
                        onChange={(e) => setField(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
            <Alert>{error}</Alert>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => { setForm(null); setError(''); }}>
                Cancel
              </button>
              <button className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const badge = (on, yes = 'Active', no = 'Hidden') => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${on ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
    {on ? yes : no}
  </span>
);

export function ManageDoctors() {
  return (
    <Manage
      title="Doctors"
      endpoint="/doctors"
      empty={{ name: '', title: 'DDS', specialization: '', experience: 0, bio: '', photo: '', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], active: true }}
      columns={[
        { key: 'name', label: 'Name', render: (d) => <b>{d.name}</b> },
        { key: 'specialization', label: 'Specialization' },
        { key: 'experience', label: 'Exp. (yrs)' },
        { key: 'active', label: 'Status', render: (d) => badge(d.active) },
      ]}
      fields={[
        { key: 'name', label: 'Full name', type: 'text', required: true },
        { key: 'title', label: 'Title (e.g. DDS)', type: 'text' },
        { key: 'specialization', label: 'Specialization', type: 'text' },
        { key: 'experience', label: 'Years of experience', type: 'number' },
        { key: 'photo', label: 'Photo URL', type: 'text' },
        { key: 'bio', label: 'Bio', type: 'textarea' },
        { key: 'availableDays', label: 'Available days', type: 'days' },
        { key: 'active', label: 'Show on website', type: 'checkbox' },
      ]}
    />
  );
}

export function ManageServices() {
  return (
    <Manage
      title="Services"
      endpoint="/services"
      empty={{ title: '', shortDescription: '', description: '', icon: 'tooth', price: '', duration: '', active: true }}
      columns={[
        { key: 'title', label: 'Title', render: (s) => <b>{s.title}</b> },
        { key: 'price', label: 'Price' },
        { key: 'duration', label: 'Duration' },
        { key: 'active', label: 'Status', render: (s) => badge(s.active) },
      ]}
      fields={[
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'shortDescription', label: 'Short description', type: 'text', required: true },
        { key: 'description', label: 'Full description', type: 'textarea' },
        { key: 'icon', label: 'Icon', type: 'select', options: ['tooth', 'shield', 'sparkle', 'braces', 'implant'] },
        { key: 'price', label: 'Price (text)', type: 'text' },
        { key: 'duration', label: 'Duration', type: 'text' },
        { key: 'active', label: 'Show on website', type: 'checkbox' },
      ]}
    />
  );
}

export function ManageReviews() {
  return (
    <Manage
      title="Reviews"
      endpoint="/reviews"
      empty={{ name: '', treatment: '', rating: 5, comment: '', approved: true }}
      columns={[
        { key: 'name', label: 'Patient', render: (r) => <b>{r.name}</b> },
        { key: 'rating', label: 'Rating', render: (r) => '★'.repeat(r.rating) },
        { key: 'comment', label: 'Comment', render: (r) => <span className="line-clamp-2 max-w-xs">{r.comment}</span> },
        { key: 'approved', label: 'Status', render: (r) => badge(r.approved, 'Approved', 'Pending') },
      ]}
      fields={[
        { key: 'name', label: 'Patient name', type: 'text', required: true },
        { key: 'treatment', label: 'Treatment', type: 'text' },
        { key: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
        { key: 'comment', label: 'Comment', type: 'textarea', required: true },
        { key: 'approved', label: 'Approved (visible on website)', type: 'checkbox' },
      ]}
    />
  );
}
