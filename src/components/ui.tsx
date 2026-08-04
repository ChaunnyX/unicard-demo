import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Gift, Gamepad2, Zap, Globe, ShieldCheck, Network, CreditCard, Send,
  Star, Copy, Check, X,
} from 'lucide-react'
import type { CategoryId } from '../data/products'
import { useStore } from '../lib/store'

/* ---------- иконки категорий ---------- */
export const CAT_ICON: Record<CategoryId, typeof Gift> = {
  gift: Gift, games: Gamepad2, topup: Zap, esim: Globe,
  vpn: ShieldCheck, proxy: Network, cards: CreditCard, transfers: Send,
}

export function CatIcon({ cat, className }: { cat: CategoryId; className?: string }) {
  const Icon = CAT_ICON[cat]
  return <Icon className={className} strokeWidth={1.8} />
}

/* ---------- scroll reveal ---------- */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect() } },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ---------- докручивающееся число ---------- */
export function CountUp({ value, duration = 900, className = '' }: { value: number; duration?: number; className?: string }) {
  const [shown, setShown] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const from = prev.current
    prev.current = value
    if (from === value) return
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration)
      const e = 1 - Math.pow(1 - k, 3)
      setShown(Math.round(from + (value - from) * e))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span className={`num ${className}`}>{shown.toLocaleString('ru-RU')}</span>
}

/* ---------- рейтинг ---------- */
export function Rating({ value, reviews, className = '' }: { value: number; reviews?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] ${className}`}>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="num font-semibold">{value.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-muted num">· {reviews.toLocaleString('ru-RU')}</span>}
    </span>
  )
}

/* ---------- типографская плитка бренда ---------- */
export function Tile({ from, to, mark, className = '', markClass = '' }: { from: string; to: string; mark: string; className?: string; markClass?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className={`font-display font-bold tracking-[0.08em] text-white/90 ${markClass}`}>{mark}</span>
      <span className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(120px 60px at 20% 0%, #fff, transparent 70%)' }} />
    </div>
  )
}

/* ---------- бейдж выдачи ---------- */
export function DeliveryBadge({ sec, className = '' }: { sec: number; className?: string }) {
  const label = sec <= 5 ? `~${sec} сек` : sec < 90 ? `до ${sec >= 60 ? 'минуты' : sec + ' сек'}` : `~${Math.round(sec / 60)} мин`
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-ok-tint px-2 py-0.5 font-mono text-[11px] font-medium text-ok ${className}`}>
      <Zap className="h-3 w-3" /> {label}
    </span>
  )
}

/* ---------- копирование ---------- */
export function CopyBtn({ text, className = '' }: { text: string; className?: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-volt hover:text-volt ${className}`}
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {})
        setOk(true)
        setTimeout(() => setOk(false), 1600)
      }}
    >
      {ok ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
      {ok ? 'Скопировано' : 'Копировать'}
    </button>
  )
}

/* ---------- модалка ---------- */
export function Modal({ open, onClose, children, width = 'max-w-md' }: { open: boolean; onClose: () => void; children: ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" onClick={onClose} style={{ animation: 'feed-in 200ms ease-out' }} />
      <div className={`panel relative w-full ${width} p-6`} style={{ animation: 'rise 260ms cubic-bezier(0.2,0,0,1)' }}>
        <button onClick={onClose} className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-muted transition-colors hover:bg-paper hover:text-ink">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  )
}

/* ---------- тосты ---------- */
export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map(t => (
        <div key={t.id} className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-lift" style={{ animation: 'rise 260ms cubic-bezier(0.2,0,0,1)' }}>
          {t.kind === 'ok' && <Check className="h-4 w-4 text-ok" />}
          {t.text}
        </div>
      ))}
    </div>
  )
}

/* ---------- заголовок секции ---------- */
export function SectionHead({ eyebrow, title, right, className = '' }: { eyebrow?: string; title: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={`mb-6 flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h2 className="font-display text-[26px] font-semibold leading-tight tracking-tight md:text-[32px]">{title}</h2>
      </div>
      {right}
    </div>
  )
}

/* ---------- псевдо-QR (демо) ---------- */
export function Qr({ seed, size = 148, className = '' }: { seed: string; size?: number; className?: string }) {
  const n = 21
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296 }
  const cells: boolean[] = []
  for (let i = 0; i < n * n; i++) cells.push(rnd() > 0.52)
  const finder = (x: number, y: number, cx: number, cy: number) =>
    (x >= cx && x < cx + 7 && y >= cy && y < cy + 7) &&
    (x === cx || x === cx + 6 || y === cy || y === cy + 6 || (x >= cx + 2 && x <= cx + 4 && y >= cy + 2 && y <= cy + 4))
  const inFinderZone = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8)
  return (
    <svg viewBox={`0 0 ${n} ${n}`} width={size} height={size} className={`rounded-lg bg-white p-1 ${className}`} shapeRendering="crispEdges">
      {Array.from({ length: n * n }, (_, i) => {
        const x = i % n, y = Math.floor(i / n)
        const isFinder = finder(x, y, 0, 0) || finder(x, y, n - 7, 0) || finder(x, y, 0, n - 7)
        const fill = isFinder || (!inFinderZone(x, y) && cells[i])
        return fill ? <rect key={i} x={x} y={y} width={1} height={1} fill="#0e1220" /> : null
      })}
    </svg>
  )
}

/* ---------- хлебные крошки ---------- */
export function Crumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
      <Link to="/" className="transition-colors hover:text-volt">Главная</Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-line">/</span>
          {c.to ? <Link to={c.to} className="transition-colors hover:text-volt">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}

/* ---------- marquee ---------- */
export function Marquee({ items, className = '', style }: { items: ReactNode[]; className?: string; style?: CSSProperties }) {
  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      <div className="marquee-track">
        {[0, 1].map(k => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((it, i) => <span key={i} className="flex items-center">{it}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}
