import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { usePageMeta } from '../lib/util.js';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(t('nf.title'));
  return (
    <section className="hero-bg text-white">
      <div className="container-x py-28 text-center">
        <p className="eyebrow !text-gold-400">404</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{t('nf.title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-navy-100">{t('nf.text')}</p>
        <Link to="/" className="btn-gold mt-8">
          {t('nf.back')}
        </Link>
      </div>
    </section>
  );
}
