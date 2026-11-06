import { useI18n } from '../lib/i18n.jsx';
import { initials, safeUrl } from '../lib/util.js';

export default function BoardCard({ member }) {
  const { t, tr } = useI18n();
  const photo = safeUrl(member.photo_url);
  const name = tr(member, 'name');
  const bio = tr(member, 'bio');
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm shadow-soft transition hover:border-sky-400/40 hover:bg-[#021742]/50 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#02143b]/40">
        {photo ? (
          <img
            src={photo}
            alt={t('board.photoAlt', { name })}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[#02143b]/40">
            <span className="latin-serif font-serif text-6xl font-bold text-sky-300/80" dir="ltr">
              {initials(member.name)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-sky-400 via-sky-200 to-white" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-sky-300">{tr(member, 'position')}</p>
        {bio && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-200">{bio}</p>}
      </div>
    </article>
  );
}

