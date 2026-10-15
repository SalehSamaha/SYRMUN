import { initials, safeUrl } from '../lib/util.js';

export default function BoardCard({ member }) {
  const photo = safeUrl(member.photo_url);
  return (
    <article className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-navy-900">
        {photo ? (
          <img
            src={photo}
            alt={`Portrait of ${member.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="hero-bg grid h-full w-full place-items-center">
            <span className="font-serif text-6xl font-bold text-gold-400">{initials(member.name)}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-500" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-navy-950">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-gold-700">{member.position}</p>
        {member.bio && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-700">{member.bio}</p>}
      </div>
    </article>
  );
}
