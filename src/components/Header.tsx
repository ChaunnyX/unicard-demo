import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Zap, Wallet, ChevronRight, User, Copy, Check } from 'lucide-react'
import { CATEGORIES, PRODUCTS, minPrice } from '../data/products'
import { rub } from '../lib/format'
import { useStore } from '../lib/store'
import { CatIcon, CountUp, Marquee } from './ui'

function Ticker() {
  const [copied, setCopied] = useState(false)
  const items = [
    <button
      key="promo"
      onClick={() => { navigator.clipboard?.writeText('WELCOME10').catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
      className="mx-6 inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/95"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      Промокод WELCOME10 — скидка 10% на первый заказ
    </button>,
    <span key="a" className="mx-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">Выдача за секунды после оплаты</span>,
    <span key="b" className="mx-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">Если поставщик не ответил — деньги вернутся на баланс сами</span>,
    <span key="c" className="mx-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">Оплата: карты · СБП · криптовалюта</span>,
  ]
  return <Marquee items={items} className="grad-volt py-1.5" />
}

function SearchBox({ className = '', autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const boxRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (s.length < 2) return []
    return PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(s) ||
      (p.subtitle ?? '').toLowerCase().includes(s) ||
      p.cat.includes(s),
    ).slice(0, 7)
  }, [q])

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) setOpen(false) }
    window.addEventListener('mousedown', h)
    return () => window.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
      <input
        className="input pl-11"
        placeholder="Игра, gift-карта, страна eSIM…"
        value={q}
        autoFocus={autoFocus}
        onChange={e => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="panel absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden p-1.5" style={{ animation: 'feed-in 160ms ease-out' }}>
          {results.map(p => (
            <button
              key={p.id}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-paper"
              onClick={() => { setOpen(false); setQ(''); nav(`/p/${p.id}`) }}
            >
              {p.flag
                ? <img src={p.flag} alt="" className="h-6 w-8 rounded object-cover" />
                : <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt-tint text-volt"><CatIcon cat={p.cat} className="h-4 w-4" /></span>}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{p.title}</span>
                <span className="block truncate text-[12px] text-muted">{p.subtitle}</span>
              </span>
              <span className="num text-[13px] font-semibold">от {rub(minPrice(p))}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const { user, balance, setAuthOpen } = useStore()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <Ticker />
      <div className={`border-b bg-surface/85 backdrop-blur-md transition-shadow ${scrolled ? 'border-line shadow-soft' : 'border-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-5 md:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grad-volt flex h-9 w-9 items-center justify-center rounded-xl shadow-volt">
              <Zap className="h-5 w-5 text-white" fill="currentColor" strokeWidth={0} />
            </span>
            <span className="font-display text-[20px] font-bold tracking-tight">Unicard</span>
          </Link>

          <SearchBox className="hidden flex-1 md:block" />

          {user ? (
            <Link to="/account" className="group flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-4 pr-1.5 transition-colors hover:border-volt">
              <Wallet className="h-4 w-4 text-volt" />
              <span className="num text-[15px] font-bold"><CountUp value={balance} /> ₽</span>
              <span className="grad-volt flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white">
                {user.name[0]}
              </span>
            </Link>
          ) : (
            <button onClick={() => setAuthOpen(true)} className="btn-primary shrink-0 px-5 py-2.5 text-[14px]">
              <User className="h-4 w-4" /> Войти
            </button>
          )}
        </div>

        {/* поиск на мобиле */}
        <div className="px-4 pb-3 md:hidden">
          <SearchBox />
        </div>

        {/* категории */}
        <nav className="scroll-x border-t border-line/70">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-2 md:px-4">
            {CATEGORIES.map(c => (
              <NavLink
                key={c.id}
                to={`/c/${c.id}`}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                    isActive ? 'border-volt text-volt' : 'border-transparent text-muted hover:text-ink'
                  }`
                }
              >
                <CatIcon cat={c.id} className="h-4 w-4" />
                {c.short}
              </NavLink>
            ))}
            <Link to="/c/gift" className="ml-auto hidden shrink-0 items-center gap-1 py-2.5 pl-3 text-[13px] font-medium text-volt lg:flex">
              Весь каталог <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
