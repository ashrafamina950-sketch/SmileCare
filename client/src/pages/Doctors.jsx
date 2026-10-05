import { Link, useParams } from 'react-router-dom';
import { Alert, PageHeader, Spinner, useFetch } from '../components/ui.jsx';

export function Doctors() {
  const { data, loading, error } = useFetch('/doctors');
  return (
    <>
      <PageHeader title="Meet Our Doctors" subtitle="Caring, experienced and committed to your oral health." />
      <section className="section">
        <div className="container-x">
          {loading ? (
            <Spinner />
          ) : error ? (
            <Alert>{error}</Alert>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((d) => (
                <article key={d._id} className="card overflow-hidden !p-0">
                  {d.photo ? (
                    <img src={d.photo} alt={d.name} className="h-64 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-brand-100 text-5xl">🦷</div>
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-bold">
                      {d.name}, {d.title}
                    </h2>
                    <p className="text-sm font-semibold text-brand-600">{d.specialization}</p>
                    <p className="mt-1 text-sm text-slate-500">{d.experience} years experience</p>
                    <div className="mt-4 flex gap-2">
                      <Link to={`/doctors/${d.slug}`} className="btn-outline flex-1">
                        Profile
                      </Link>
                      <Link to={`/book?doctor=${d._id}`} className="btn-primary flex-1">
                        Book
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function DoctorDetail() {
  const { slug } = useParams();
  const { data: d, loading, error } = useFetch(`/doctors/${slug}`);

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="container-x py-16">
        <Alert>{error}</Alert>
        <Link to="/doctors" className="btn-outline mt-4">
          ← Back to doctors
        </Link>
      </div>
    );

  return (
    <section className="section">
      <div className="container-x grid gap-8 md:grid-cols-3">
        {d.photo ? (
          <img src={d.photo} alt={d.name} className="h-80 w-full rounded-2xl object-cover shadow-card" />
        ) : (
          <div className="flex h-80 items-center justify-center rounded-2xl bg-brand-100 text-6xl">🦷</div>
        )}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-extrabold">
            {d.name}, {d.title}
          </h1>
          <p className="mt-1 font-semibold text-brand-600">{d.specialization}</p>
          <p className="mt-4 leading-relaxed text-slate-600">{d.bio}</p>
          <dl className="mt-6 grid max-w-md grid-cols-2 gap-4 text-sm">
            <div className="card !p-4">
              <dt className="text-slate-500">Experience</dt>
              <dd className="text-lg font-bold">{d.experience} years</dd>
            </div>
            <div className="card !p-4">
              <dt className="text-slate-500">Available</dt>
              <dd className="font-bold">{d.availableDays?.join(', ')}</dd>
            </div>
          </dl>
          <Link to={`/book?doctor=${d._id}`} className="btn-primary mt-6">
            Book with {d.name.split(' ').slice(0, 2).join(' ')}
          </Link>
        </div>
      </div>
    </section>
  );
}
