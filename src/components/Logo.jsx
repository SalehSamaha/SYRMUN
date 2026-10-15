export default function Logo({ size = 40, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
      <img src="/logo.svg" alt="" width={size} height={size} className="shrink-0" />
      <span className="leading-none">
        <span className="latin-serif block font-serif text-xl font-bold tracking-wide keep-latin">SYRMUN</span>
        <span className="keep-latin mt-1 block text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-400">2027</span>
      </span>
    </span>
  );
}
