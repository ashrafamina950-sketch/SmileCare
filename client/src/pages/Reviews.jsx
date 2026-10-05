import { useState } from 'react';
import api, { errMsg } from '../api/client.js';
import { Alert, PageHeader, Spinner, Stars, useFetch } from '../components/ui.jsx';

export default function Reviews() {
  const { data, loading, error } = useFetch('/reviews');
  const [form, setForm] = useState({ name: '', treatment: '', rating: 5, comment: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: '', msg: '' });
    try {
      const { data: res } = await api.post('/reviews/submit', { ...form, rating: Number(form.rating) });
      setStatus({ type: 'success', msg: res.message });
      setForm({ name: '', treatment: '', rating: 5, comment: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: errMsg(err) });
    } finally {
      setSending(false);
    }
  };

  const avg = data?.length ? (data.reduce((a, r) => a + r.rating, 0) / data.length).toFixed(1) : null;

  return (
    <>
      <PageHeader
        title="Patient Reviews"
        subtitle={avg ? `Rated ${avg}/5 by ${data.length} patients` : 'Hear from the people we have cared for.'}
      />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div className="grid content-start gap-5 sm:grid-cols-2 lg:col-span-2">
            {loading ? (
              <Spinner />
            ) : error ? (
              <Alert>{error}</Alert>
            ) : data.length === 0 ? (
              <p className="text-slate-500">No reviews yet. Be the first to share your experience!</p>
            ) : (
              data.map((r) => (
                <figure key={r._id} className="card">
                  <Stars value={r.rating} />
                  <blockquote className="mt-2 text-sm text-slate-600">“{r.comment}”</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-brand-900">
                    {r.name}
                    {r.treatment && <span className="block text-xs font-normal text-slate-500">{r.treatment}</span>}
                  </figcaption>
                </figure>
              ))
            )}
          </div>

          <form onSubmit={submit} className="card h-fit space-y-4">
            <h2 className="text-lg font-bold">Share your experience</h2>
            <div>
              <label className="label" htmlFor="r-name">Your name</label>
              <input id="r-name" className="input" required value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="label" htmlFor="r-treat">Treatment (optional)</label>
              <input id="r-treat" className="input" value={form.treatment} onChange={set('treatment')} />
            </div>
            <div>
              <label className="label" htmlFor="r-rate">Rating</label>
              <select id="r-rate" className="input" value={form.rating} onChange={set('rating')}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {'★'.repeat(n)} ({n})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="r-comment">Your review</label>
              <textarea
                id="r-comment"
                className="input min-h-28"
                required
                maxLength={600}
                value={form.comment}
                onChange={set('comment')}
              />
            </div>
            <Alert type={status.type}>{status.msg}</Alert>
            <button className="btn-primary w-full" disabled={sending}>
              {sending ? 'Submitting...' : 'Submit Review'}
            </button>
            <p className="text-xs text-slate-500">Reviews appear on the site after approval by our team.</p>
          </form>
        </div>
      </section>
    </>
  );
}
