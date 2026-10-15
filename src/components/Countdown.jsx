import { useEffect, useState } from 'react';
import { startOfDay } from '../lib/fees.js';

const pad = (n) => String(n).padStart(2, '0');

/** Counts down to the first day of the conference (00:00 Damascus time). */
export default function Countdown({ date }) {
  const target = startOfDay(date);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!target) {
    return (
      <p className="inline-block rounded-full border border-white/20 px-5 py-2 text-sm text-navy-100">
        Countdown starts once the conference dates are confirmed
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
    ['Days', days],
    ['Hours', pad(hours)],
    ['Minutes', pad(minutes)],
    ['Seconds', pad(seconds)],
  ];

  return (
    <div className="flex gap-3 sm:gap-4" role="timer" aria-label="Time until the conference">
      {parts.map(([label, value]) => (
        <div
          key={label}
          className="min-w-[4.25rem] rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-center backdrop-blur sm:min-w-[5.5rem] sm:px-4"
        >
          <div className="font-serif text-2xl font-bold text-gold-300 sm:text-4xl">{value}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-navy-200 sm:text-xs">{label}</div>
        </div>
      ))}
    </div>
  );
}
