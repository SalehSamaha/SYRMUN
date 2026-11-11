import { useI18n } from '../lib/i18n.jsx';
import { initials, safeUrl } from '../lib/util.js';

export default function BoardCard({ member }) {
  const { t, tr } = useI18n();
  const photo = safeUrl(member.photo_url);
  const name = tr(member, 'name');
  const bio = tr(member, 'bio');
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#021742]/35 backdrop-blur-sm shadow-soft transition hover:border-sky-400/40 hover:bg-[#021742]/50 hover:-translate-y-1 flex flex-row sm:flex-col items-center sm:items-stretch p-3.5 sm:p-0 gap-3.5 sm:gap-0">
      <div className="relative shrink-0 w-24 h-24 sm:w-full sm:h-auto sm:aspect-[4/5] overflow-hidden rounded-xl sm:rounded-none bg-[#02143b]/40">
        {photo ? (
          <img
            src={photo}
            alt={t('board.photoAlt', { name })}
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[#02143b]/40">
            <span className="latin-serif font-serif text-2xl sm:text-6xl font-bold text-sky-300/80" dir="ltr">
              {initials(member.name)}
            </span>
          </div>
        )}
        <div className="hidden sm:block absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-sky-400 via-sky-200 to-white" />
      </div>
      <div className="p-0 sm:p-5 flex-1 min-w-0">
        <h3 className="text-base sm:text-xl font-bold text-white truncate sm:whitespace-normal">{name}</h3>
        <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-sky-300">{tr(member, 'position')}</p>
        {bio && <p className="mt-1.5 sm:mt-3 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-navy-200 line-clamp-2 sm:line-clamp-none">{bio}</p>}
      </div>
    </article>
  );
}

