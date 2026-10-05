import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api/client.js';
import { Alert, PageHeader, useFetch } from '../components/ui.jsx';

const SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function Book() {
  const [params] = useSearchParams();
  const services = useFetch('/services');
  const doctors = useFetch('/doctors');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: params.get('service') || '',
    doctor: params.get('doctor') || '',
    date: '',
    time: '',
    notes: '',
  });
  const [taken, setTaken] = useState([]);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value, ...(k === 'doctor' || k === 'date' ? { time: '' } : {}) }));
  };

  useEffect(() => {
    if (!form.doctor || !form.date) return setTaken([]);
    api
      .get('/appointments/slots', { params: { doctor: form.doctor, date: form.date } })
      .then((r) => setTaken(r.data))
      .catch(() => setTaken([]));
  }, [form.doctor, form.date]);

  const doctor = useMemo(() => doctors.data?.find((d) => d._id === form.doctor), [doctors.data, form.doctor]);
  const dayWarning = useMemo(() => {
    if (!doctor || !form.date) return '';
    const day = new Date(`${form.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
    return doctor.availableDays?.includes(day) ? '' : `${doctor.name} is not available on ${day}. Available: ${doctor.availableDays.join(', ')}.`;
  }, [doctor, form.date]);

  const submit = async (e) => {
    e.preventDefault();
    if (dayWarning) return setStatus({ type: 'error', msg: dayWarning });
    if (!form.time) return setStatus({ type: 'error', msg: 'Please choose a time slot.' });
    setSending(true);
    setStatus({ type: '', msg: '' });
    try {
      await api.post('/appointments', form);
      setDone(true);
    } catch (err) {
      setStatus({ type: 'error', msg: errMsg(err) });
    } finally {
      setSending(false);
    }
  };

  if (done)
    return (
      <section className="section">
        <div className="container-x max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">✓</div>
          <h1 className="mt-4 text-2xl font-extrabold">Appointment request received</h1>
          <p className="mt-2 text-slate-600">
            Thank you, {form.name}. We will confirm your appointment for {form.date} at {form.time} shortly.
          </p>
          <Link to="/" className="btn-primary mt-6">
            Back to home
          </Link>
        </div>
      </section>
    );

  return (
    <>
      <PageHeader title="Book Your Appointment" subtitle="Choose a doctor, date and time. We will confirm shortly." />
      <section className="section !pt-8">
        <form onSubmit={submit} className="container-x card max-w-3xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="b-name">Full name</label>
              <input id="b-name" className="input" required value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="label" htmlFor="b-phone">Phone</label>
              <input id="b-phone" type="tel" className="input" required value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="b-email">Email</label>
            <input id="b-email" type="email" className="input" required value={form.email} onChange={set('email')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="b-service">Service</label>
              <select id="b-service" className="input" value={form.service} onChange={set('service')}>
                <option value="">General checkup</option>
                {services.data?.map((s) => (
                  <option key={s._id} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="b-doctor">Doctor</label>
              <select id="b-doctor" className="input" required value={form.doctor} onChange={set('doctor')}>
                <option value="">Select a doctor</option>
                {doctors.data?.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="b-date">Date</label>
            <input id="b-date" type="date" min={todayStr()} className="input" required value={form.date} onChange={set('date')} />
            {dayWarning && <p className="mt-1 text-sm text-amber-600">{dayWarning}</p>}
          </div>
          <div>
            <span className="label">Time</span>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
              {SLOTS.map((t) => {
                const disabled = taken.includes(t) || !form.doctor || !form.date;
                return (
                  <button
                    type="button"
                    key={t}
                    disabled={disabled}
                    onClick={() => setForm((f) => ({ ...f, time: t }))}
                    className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                      form.time === t
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-300 bg-white hover:border-brand-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:line-through'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {(!form.doctor || !form.date) && <p className="mt-1 text-xs text-slate-500">Select a doctor and date to see available slots.</p>}
          </div>
          <div>
            <label className="label" htmlFor="b-notes">Notes (optional)</label>
            <textarea id="b-notes" className="input min-h-24" value={form.notes} onChange={set('notes')} />
          </div>
          <Alert type={status.type}>{status.msg}</Alert>
          <button className="btn-primary w-full sm:w-auto" disabled={sending}>
            {sending ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </section>
    </>
  );
}
