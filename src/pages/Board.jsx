import BoardCard from '../components/BoardCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero, Spinner } from '../components/ui.jsx';
import { useRows } from '../lib/content.jsx';
import { usePageMeta } from '../lib/util.js';

export default function Board() {
  const { data, loading } = useRows('board_members');
  usePageMeta('Executive Board', 'Meet the Executive Board organising SYRMUN 2027.');

  return (
    <>
      <PageHero
        eyebrow="Executive Board"
        title="The people behind SYRMUN"
        intro="The Executive Board plans the conference, chairs the committees and makes sure every delegate has a great experience."
      />
      <section className="py-16">
        <div className="container-x">
          {loading ? (
            <Spinner />
          ) : data.length === 0 ? (
            <EmptyState title="Executive Board to be announced" text="We will introduce the team here soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((m, i) => (
                <Reveal key={m.id} delay={(i % 3) * 80}>
                  <BoardCard member={m} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
