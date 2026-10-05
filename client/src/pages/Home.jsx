import { Link } from 'react-router-dom';
import { Alert, SectionTitle, ServiceIcon, Spinner, Stars, useFetch } from '../components/ui.jsx';

export default function Home() {
  const services = useFetch('/services');
  const doctors = useFetch('/doctors');
  const reviews = useFetch('/reviews');
  const doctor = doctors.data?.[0];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-brand-50/60">
        <div className="container-x grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Your Smile, Our Priority</h1>
            <p className="mt-4 max-w-md text-slate-600">
              Modern, comfortable dental care for you and your family. Expert treatments with gentle care to keep
              your smile healthy and confident.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/book" className="btn-primary">
                Book Your Appointment
              </Link>
              <Link to="/services" className="btn-outline">
                Explore Services
              </Link>
            </div>
            <dl className="mt-8 flex flex-wrap gap-6 text-sm">
              {[
                ['5000+', 'Happy Patients'],
                ['4.9/5', 'Patient Rating'],
                ['Certified', '& Safe Clinic'],
              ].map(([a, b]) => (
                <div key={a} className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    ✓
                  </span>
                  <div>
                    <dt className="font-bold text-brand-900">{a}</dt>
                    <dd className="text-xs text-slate-500">{b}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-card ring-1 ring-slate-100">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=80"
              alt="Friendly dentist in a modern clinic"
              className="h-72 w-full object-cover sm:h-96"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-brand-50/60">
        <div className="container-x">
          <SectionTitle title="Our Services" subtitle="A full range of dental care designed for your health and confidence" />
          {services.loading ? (
            <Spinner />
          ) : services.error ? (
            <Alert>{services.error}</Alert>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.data.slice(0, 4).map((s) => (
                <Link key={s._id} to={`/services/${s.slug}`} className="card text-center transition hover:-translate-y-1">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <h3 className="mt-3 text-base font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.shortDescription}</p>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Link to="/services" className="btn-outline">
              View all services
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the dentist */}
      {doctor && (
        <section className="section">
          <div className="container-x grid items-center gap-8 md:grid-cols-5">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="h-72 w-full rounded-2xl object-cover shadow-card md:col-span-2"
              loading="lazy"
            />
            <div className="md:col-span-3">
              <h2 className="text-2xl font-extrabold sm:text-3xl">Meet Our Dentist</h2>
              <h3 className="mt-3 text-xl font-bold">
                {doctor.name}, {doctor.title}
              </h3>
              <p className="text-sm font-semibold text-brand-600">{doctor.specialization}</p>
              <p className="mt-3 text-slate-600">{doctor.bio}</p>
              <Link to={`/doctors/${doctor.slug}`} className="btn-primary mt-5">
                View Full Profile →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="section bg-brand-50/60">
        <div className="container-x">
          <SectionTitle title="What Our Patients Say" />
          {reviews.loading ? (
            <Spinner />
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {(reviews.data || []).slice(0, 3).map((r) => (
                <figure key={r._id} className="card">
                  <Stars value={r.rating} />
                  <blockquote className="mt-2 text-sm text-slate-600">“{r.comment}”</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-brand-900">
                    {r.name}
                    {r.treatment && <span className="block text-xs font-normal text-slate-500">{r.treatment}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Link to="/reviews" className="btn-outline">
              Read all reviews
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 py-12 text-center text-white">
        <div className="container-x">
          <h2 className="text-2xl font-extrabold !text-white sm:text-3xl">Ready for a healthier smile?</h2>
          <p className="mx-auto mt-2 max-w-xl text-blue-100">
            Book online in under a minute. Emergency appointments are available with same-day slots.
          </p>
          <Link to="/book" className="btn mt-5 bg-white text-brand-700 hover:bg-brand-50">
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
