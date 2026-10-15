import BoardCard from '../components/BoardCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { EmptyState, PageHero, Spinner } from '../components/ui.jsx';
import { useRows } from '../lib/content.jsx';
import { useI18n } from '../lib/i18n.jsx';
import { usePageMeta } from '../lib/util.js';

export default function Board() {
  const { data, loading } = useRows('board_members');
  const { t } = useI18n();
  usePageMeta(t('common.execBoard'), t('boardpage.meta'));

  return (
    <>
      <PageHero eyebrow={t('common.execBoard')} title={t('boardpage.title')} intro={t('boardpage.intro')} />
      <section className="py-16">
        <div className="container-x">
          {loading ? (
            <Spinner />
          ) : data.length === 0 ? (
            <EmptyState title={t('board.empty.t')} text={t('board.empty.d')} />
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
