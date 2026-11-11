import { useEffect, useState } from 'react';
import { startOfDay } from '../lib/fees.js';
import { useI18n } from '../lib/i18n.jsx';

const pad = (n) => String(n).padStart(2, '0');

/** Counts down to the first day of the conference (00:00 Damascus time). */
export default function Countdown({ date }) {
  const { t } = useI18n();
  const target = startOfDay(date);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!target) {
    return (
      <p className="inline-block max-w-full rounded-full border border-white/20 px-4 py-2 text-xs sm:text-sm text-navy-100 text-center leading-relaxed">
        {t('countdown.soon')}
      </p>
    );
  }

  const diff = Math.max(0, target.getTime() - now);
  if (diff === 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const parts = [
    ['countdown.days', days],
    ['countdown.hours', pad(hours)],
    ['countdown.minutes', pad(minutes)],
    ['countdown.seconds', pad(seconds)],
  ];

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 md:gap-4 max-w-full" role="timer" aria-label={t('countdown.aria')}>
      {parts.map(([key, value]) => (
        <div
          key={key}
          className="flex-1 min-w-[3.75rem] max-w-[5.25rem] sm:max-w-none sm:min-w-[5.5rem] rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-2 sm:px-4 sm:py-3 text-center"
        >
          <div className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white tabular-nums">{value}</div>
          <div className="mt-1 text-[9px] uppercase tracking-widest text-sky-200/80 sm:text-xs truncate">{t(key)}</div>
        </div>
      ))}
    </div>
  );
}
