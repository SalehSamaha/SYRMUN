import { Link } from 'react-router-dom';
import { EmptyState, FaqList, PageHero, Spinner } from '../components/ui.jsx';
import { useRows } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { usePageMeta } from '../lib/util.js';

export default function Faq() {
  const { data, loading } = useRows('faqs');
  const { t, tr } = useI18n();
  usePageMeta(t('common.faq'), t('faq.meta'));

  const cat = (f) => tr(f, 'category') || (f.category ? f.category : '') || t('faq.general');
  const categories = [...new Set(data.map(cat))];

  return (
    <>
      <PageHero eyebrow={t('common.faq')} title={t('faq.title')} intro={t('faq.intro')} />
      <section className="py-16">
        <div className="container-x max-w-3xl">
          {loading ? (
            <Spinner />
          ) : data.length === 0 ? (
            <EmptyState title={t('faq.empty.t')} text={t('faq.empty.d')} />
          ) : (
            <div className="space-y-10">
              {categories.map((c) => (
                <div key={c}>
                  <h2 className="mb-4 text-2xl font-bold text-navy-950">{c}</h2>
                  <FaqList items={data.filter((f) => cat(f) === c)} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-navy">
              {t('common.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
