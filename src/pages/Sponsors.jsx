import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero } from '../components/ui.jsx';
import { useRows, useSettings } from '../lib/content.jsx';
import { safeUrl, usePageMeta } from '../lib/util.js';

function LogoCard({ item }) {
  const logo = safeUrl(item.logo_url);
  const href = safeUrl(item.website_url);
  const inner = (
    <div className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-3 rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-soft transition hover:border-gold-500">
      {logo ? (
        <img src={logo} alt={item.name} loading="lazy" className="max-h-20 w-auto max-w-full object-contain" />
      ) : (
        <span className="font-serif text-xl font-bold text-navy-900">{item.name}</span>
      )}
      {logo && <span className="text-sm font-semibold text-navy-700">{item.name}</span>}
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} (opens in a new tab)`}>
      {inner}
    </a>
  ) : (
    inner
  );
}

function Group({ title, items }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-12">
      <Reveal>
        <h2 className="text-2xl font-bold text-navy-950">{title}</h2>
        <div className="mt-3 h-1 w-10 rounded bg-gold-500" />
      </Reveal>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <Reveal key={s.id}>
            <LogoCard item={s} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Sponsors() {
  const { settings } = useSettings();
  const { data } = useRows('sponsors');
  usePageMeta('Sponsors & partners', 'The sponsors and partner institutions supporting SYRMUN 2027.');

  const sponsors = data.filter((d) => d.kind === 'sponsor');
  const partners = data.filter((d) => d.kind === 'partner');

  return (
    <>
      <PageHero
        eyebrow="Sponsors & partners"
        title="The organisations supporting SYRMUN"
        intro="SYRMUN is a first-year conference. Sponsors and partner institutions help us keep it affordable and make it possible for more students to take part."
      />
      <section className="py-16">
        <div className="container-x">
          {data.length === 0 ? (
            <EmptyState title="Partners to be announced" text="We will list our sponsors and partner institutions here as partnerships are confirmed." />
          ) : (
            <>
              <Group title="Sponsors" items={sponsors} />
              <Group title="Partner institutions" items={partners} />
            </>
          )}

          <Reveal className="mt-16">
            <div className="hero-bg rounded-3xl px-6 py-12 text-center text-white sm:px-12">
              <h2 className="text-3xl font-bold">Would your organisation like to support SYRMUN?</h2>
              <p className="mx-auto mt-3 max-w-xl text-navy-100">
                We would be glad to talk about sponsorship, partnerships with schools and institutions, or other ways to help.
              </p>
              <div className="mt-6">
                {settings.contact_email ? (
                  <a href={`mailto:${settings.contact_email}?subject=SYRMUN%20partnership`} className="btn-gold">
                    Email {settings.contact_email}
                  </a>
                ) : (
                  <Link to="/contact" className="btn-gold">
                    Get in touch
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
