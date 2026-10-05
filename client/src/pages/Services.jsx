import { Link, useParams } from 'react-router-dom';
import { Alert, PageHeader, ServiceIcon, Spinner, useFetch } from '../components/ui.jsx';

export function Services() {
  const { data, loading, error } = useFetch('/services');
  return (
    <>
      <PageHeader title="Our Services" subtitle="A full range of dental care designed for your health and confidence." />
      <section className="section">
        <div className="container-x">
          {loading ? (
            <Spinner />
          ) : error ? (
            <Alert>{error}</Alert>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((s) => (
                <article key={s._id} className="card flex flex-col">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <ServiceIcon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="mt-3 text-lg font-bold">{s.title}</h2>
                  <p className="mt-1 flex-1 text-sm text-slate-600">{s.shortDescription}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-600">{s.price}</span>
                    <Link to={`/services/${s.slug}`} className="text-sm font-semibold text-brand-700 hover:underline">
                      Learn more →
                    </Link>
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

export function ServiceDetail() {
  const { slug } = useParams();
  const { data: s, loading, error } = useFetch(`/services/${slug}`);

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="container-x py-16">
        <Alert>{error}</Alert>
        <Link to="/services" className="btn-outline mt-4">
          ← Back to services
        </Link>
      </div>
    );

  return (
    <>
      <PageHeader title={s.title} subtitle={s.shortDescription} />
      <section className="section">
        <div className="container-x grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold">About this treatment</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">{s.description}</p>
          </div>
          <aside className="card h-fit">
            <h3 className="text-lg font-bold">Treatment info</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Price</dt>
                <dd className="font-semibold">{s.price || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Duration</dt>
                <dd className="font-semibold">{s.duration || '—'}</dd>
              </div>
            </dl>
            <Link to={`/book?service=${encodeURIComponent(s.title)}`} className="btn-primary mt-5 w-full">
              Book this treatment
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
