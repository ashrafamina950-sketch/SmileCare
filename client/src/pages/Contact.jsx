import { useState } from 'react';
import api, { errMsg } from '../api/client.js';
import { Alert, PageHeader } from '../components/ui.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: '', msg: '' });
    try {
      const { data } = await api.post('/messages', form);
      setStatus({ type: 'success', msg: data.message });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: errMsg(err) });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader title="Contact Us" subtitle="Questions? We would love to hear from you." />
      <section className="section">
        <div className="container-x grid gap-8 md:grid-cols-5">
          <div className="space-y-4 md:col-span-2">
            <div className="card">
              <h3 className="font-bold">Address</h3>
              <p className="mt-1 text-sm text-slate-600">123 Dental Avenue, Los Angeles, CA 90028</p>
            </div>
            <div className="card">
              <h3 className="font-bold">Phone & Email</h3>
              <p className="mt-1 text-sm text-slate-600">(555) 210-6890</p>
              <p className="text-sm text-slate-600">info@smilecaredental.com</p>
            </div>
            <div className="card">
              <h3 className="font-bold">Open Hours</h3>
              <p className="mt-1 text-sm text-slate-600">Mon - Fri: 9:00am - 6:00pm</p>
              <p className="text-sm text-slate-600">Saturday: 9:00am - 4:00pm</p>
              <p className="text-sm text-slate-600">Sunday: Closed</p>
              <p className="mt-2 text-xs text-brand-600">Emergency appointments available - same-day slots.</p>
            </div>
          </div>

          <form onSubmit={submit} className="card space-y-4 md:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="c-name">Name</label>
                <input id="c-name" className="input" required value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="label" htmlFor="c-email">Email</label>
                <input id="c-email" type="email" className="input" required value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="c-sub">Subject</label>
              <input id="c-sub" className="input" value={form.subject} onChange={set('subject')} />
            </div>
            <div>
              <label className="label" htmlFor="c-msg">Message</label>
              <textarea id="c-msg" className="input min-h-32" required value={form.message} onChange={set('message')} />
            </div>
            <Alert type={status.type}>{status.msg}</Alert>
            <button className="btn-primary" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
            <p className="text-xs text-slate-500">We care about your privacy. Your information is safe and secure.</p>
          </form>
        </div>
      </section>
    </>
  );
}
