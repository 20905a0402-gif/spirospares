'use client'

export default function ScrollButton() {
  const handleScroll = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={handleScroll}
      className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full border border-[#0f172a]/15 bg-white/65 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 transition-all hover:bg-white/80 hover:scale-105 md:inline-flex"
      aria-label="Scroll down"
    >
      <span>Scroll</span>
      <span className="hero-scroll-mouse">
        <span className="hero-scroll-wheel" />
      </span>
    </button>
  )
}
