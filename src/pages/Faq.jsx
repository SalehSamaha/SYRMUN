import { Link } from 'react-router-dom';
import { EmptyState, FaqList, PageHero, Spinner } from '../components/ui.jsx';
import { useRows } from '../lib/content.jsx';
import { usePageMeta } from '../lib/util.js';

export default function Faq() {
  const { data, loading } = useRows('faqs');
  usePageMeta('FAQ', 'Frequently asked questions about registering for and attending SYRMUN 2027.');

  const categories = [...new Set(data.map((f) => f.category || 'General'))];

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        intro="Registration, fees, committees, preparation and more. Can’t find your answer? Get in touch."
      />
      <section className="py-16">
        <div className="container-x max-w-3xl">
          {loading ? (
            <Spinner />
          ) : data.length === 0 ? (
            <EmptyState title="No questions yet" text="Please contact us if you have a question." />
          ) : (
            <div className="space-y-10">
              {categories.map((cat) => (
                <div key={cat}>
                  <h2 className="mb-4 text-2xl font-bold text-navy-950">{cat}</h2>
                  <FaqList items={data.filter((f) => (f.category || 'General') === cat)} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-navy">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
