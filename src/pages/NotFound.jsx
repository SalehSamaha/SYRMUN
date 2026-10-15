import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/util.js';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <section className="hero-bg text-white">
      <div className="container-x py-28 text-center">
        <p className="eyebrow !text-gold-400">404</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-navy-100">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn-gold mt-8">
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
