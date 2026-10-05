import { Link } from 'react-router-dom';
import { PageHeader, SectionTitle } from '../components/ui.jsx';

const values = [
  ['Gentle Care', 'Pain-free techniques and a calm environment so every visit feels comfortable.'],
  ['Modern Technology', 'Digital X-rays, 3D scans and advanced sterilisation for accurate, safe treatment.'],
  ['Honest Advice', 'Clear treatment plans and transparent pricing before any work begins.'],
  ['Family Friendly', 'From children to grandparents, we care for every member of your family.'],
];

export default function About() {
  return (
    <>
      <PageHeader title="About SmileCare Dental" subtitle="Compassionate, modern dental care for all ages." />
      <section className="section">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=80"
            alt="Modern dental treatment room"
            className="h-72 w-full rounded-2xl object-cover shadow-card"
            loading="lazy"
          />
          <div>
            <h2 className="text-2xl font-extrabold">Our story</h2>
            <p className="mt-3 text-slate-600">
              SmileCare Dental was founded with one goal: to make quality dental care something people look forward
              to, not fear. Over the years we have welcomed more than 5,000 patients and built a clinic where
              friendly faces, honest advice and modern technology come together.
            </p>
            <p className="mt-3 text-slate-600">
              Our team is certified, our clinic follows strict hygiene standards, and we are always here when you
              need us, including same-day emergency appointments.
            </p>
            <Link to="/book" className="btn-primary mt-5">
              Book a visit
            </Link>
          </div>
        </div>
      </section>
      <section className="section bg-brand-50/60">
        <div className="container-x">
          <SectionTitle title="What we stand for" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([t, d]) => (
              <div key={t} className="card">
                <h3 className="text-base font-bold">{t}</h3>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
