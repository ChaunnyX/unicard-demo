import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, ShieldCheck, Wallet, Timer, ChevronRight, Gauge, Star,
  RefreshCcw, PackageCheck, MousePointerClick, MessageCircleQuestion,
} from 'lucide-react'
import { CATEGORIES, PRODUCTS, minPrice, productsByCat } from '../data/products'
import { rub } from '../lib/format'
import { useBuy } from '../lib/useBuy'
import LiveFeed from '../components/LiveFeed'
import ProductCard from '../components/ProductCard'
import WowMap from '../components/WowMap'
import { CatIcon, CountUp, Reveal, SectionHead } from '../components/ui'

/* ================= HERO ================= */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* живой фон: мягкие вольт-пятна */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[560px] rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(46,91,255,0.16), transparent)' }} />
        <div className="absolute -left-24 top-40 h-[360px] w-[420px] rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(0,198,255,0.14), transparent)' }} />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:pt-16 grid-cols-1">
        <div>
          <div className="eyebrow mb-4 flex items-center gap-2 !text-volt">
            <Zap className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
            маркетплейс цифровых товаров
          </div>
          <h1 className="font-display text-[38px] font-bold leading-[1.05] tracking-tight md:text-[56px]">
            Оплатил — получил.
            <br />
            <span className="grad-text">За секунды.</span>
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted md:text-[17px]">
            Gift-карты, игры, eSIM, VPN и прокси — код приходит в кабинет сразу после
            оплаты. Один баланс на всё: пополнил раз, дальше без ввода карты.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/c/gift" className="btn-primary px-7 py-3.5 text-[15px]">
              В каталог <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="btn-ghost px-6 py-3.5 text-[15px]">Как это работает</a>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <b className="num text-ink">4,9</b> · 12 400+ отзывов
            </span>
            <span className="flex items-center gap-1.5"><PackageCheck className="h-4 w-4 text-ok" /> 200 000+ выдач</span>
            <span className="flex items-center gap-1.5"><RefreshCcw className="h-4 w-4 text-volt" /> возврат на баланс — автоматически</span>
          </div>
        </div>

        <Reveal delay={150}>
          <LiveFeed />
          <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            реальное время выдачи по категориям
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ================= МОМЕНТАЛЬНАЯ ПОКУПКА ================= */
const QUICK_IDS = ['topup-steam', 'topup-tgpremium', 'topup-pubg', 'topup-roblox', 'topup-phone'] as const
const QUICK_PLACEHOLDER: Record<string, string> = {
  'topup-steam': 'Логин Steam',
  'topup-tgpremium': '@username в Telegram',
  'topup-pubg': 'ID игрока PUBG Mobile',
  'topup-roblox': 'Ник в Roblox',
  'topup-phone': 'Номер телефона',
}

function QuickBuy() {
  const items = QUICK_IDS.map(id => PRODUCTS.find(p => p.id === id)!).filter(Boolean)
  const [active, setActive] = useState(0)
  const [variant, setVariant] = useState(0)
  const [target, setTarget] = useState('')
  const buyNow = useBuy()
  const p = items[active]
  const v = p.variants[variant] ?? p.variants[0]

  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6">
      <Reveal>
        <div className="panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 md:px-7">
            <h2 className="flex items-center gap-2 font-display text-[19px] font-semibold">
              <span className="grad-volt flex h-7 w-7 items-center justify-center rounded-lg">
                <Zap className="h-4 w-4 text-white" fill="currentColor" strokeWidth={0} />
              </span>
              Моментальная покупка
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">без корзины · сразу в кабинет</span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[220px_1fr] grid-cols-1">
            <div className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:flex-col lg:border-b-0 lg:border-r">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => { setActive(i); setVariant(0); setTarget('') }}
                  className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
                    i === active ? 'bg-volt-tint text-volt' : 'text-muted hover:bg-paper hover:text-ink'
                  }`}
                >
                  <CatIcon cat={it.cat} className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">{it.title}</span>
                </button>
              ))}
            </div>

            <div className="p-5 md:p-7">
              <div className="flex flex-wrap gap-2">
                {p.variants.map((vv, i) => (
                  <button
                    key={vv.id}
                    onClick={() => setVariant(i)}
                    className={`cursor-pointer rounded-xl border px-4 py-2.5 text-[14px] font-semibold transition-colors num ${
                      i === variant ? 'border-volt bg-volt text-white shadow-volt' : 'border-line bg-surface hover:border-volt/50'
                    }`}
                  >
                    {vv.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] grid-cols-1">
                <input
                  className="input"
                  placeholder={QUICK_PLACEHOLDER[p.id]}
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                />
                <button
                  onClick={() => buyNow(p, v, target || undefined)}
                  className="btn-primary px-7 py-3 text-[15px]"
                >
                  Купить за {rub(v.price)}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-muted">
                <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-ok" /> зачисление {p.deliverySec <= 30 ? 'за секунды' : 'до минуты'}</span>
                <span>комиссия уже в цене</span>
                <span>{p.region}</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ================= КАТЕГОРИИ ================= */
function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-6">
      <SectionHead eyebrow="8 направлений" title="Один баланс — на всё цифровое" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.id} delay={i * 45}>
            <Link to={`/c/${c.id}`} className="panel panel-hover group relative block overflow-hidden p-4 md:p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt-tint text-volt transition-colors group-hover:bg-volt group-hover:text-white">
                  <CatIcon cat={c.id} className="h-5 w-5" />
                </span>
                {c.from > 0 && <span className="num rounded-full bg-paper px-2.5 py-1 text-[12px] font-semibold">от {rub(c.from)}</span>}
              </div>
              <div className="mt-3 text-[15.5px] font-semibold">{c.name}</div>
              <div className="mt-1 line-clamp-2 min-h-[34px] text-[12.5px] leading-snug text-muted">{c.blurb}</div>
              <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ok">
                <Zap className="h-3 w-3" /> {c.auto}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ================= ТОВАРЫ ДНЯ ================= */
function useMidnightCountdown() {
  const [left, setLeft] = useState('')
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      const end = new Date(n); end.setHours(23, 59, 59, 999)
      const ms = end.getTime() - n.getTime()
      const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60
      setLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])
  return left
}

function DayDeals() {
  const left = useMidnightCountdown()
  const deals = useMemo(() => PRODUCTS.filter(p => p.discount).sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0)).slice(0, 4), [])
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-6">
      <SectionHead
        eyebrow="успей сегодня"
        title={<>Товары дня</>}
        right={
          <span className="flex items-center gap-2 rounded-full bg-hot/10 px-4 py-2 font-mono text-[14px] font-bold text-hot num">
            <Timer className="h-4 w-4" /> {left}
          </span>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1">
        {deals.map((p, i) => (
          <Reveal key={p.id} delay={i * 60}><ProductCard p={p} /></Reveal>
        ))}
      </div>
    </section>
  )
}

/* ================= ХИТЫ ================= */
function Hits() {
  const hits = useMemo(() => PRODUCTS.filter(p => p.popular).slice(0, 8), [])
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:px-6">
      <SectionHead
        eyebrow="выбирают чаще всего"
        title="Хиты недели"
        right={<Link to="/c/gift" className="flex items-center gap-1 text-[14px] font-medium text-volt">Весь каталог <ChevronRight className="h-4 w-4" /></Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1">
        {hits.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 60}><ProductCard p={p} /></Reveal>
        ))}
      </div>
    </section>
  )
}

/* ================= КАК РАБОТАЕТ ================= */
const STEPS = [
  { icon: Wallet, t: 'Пополняете баланс', d: 'Карта, СБП или крипта — от 300 ₽. Деньги зачисляются мгновенно.', ts: 'T+0 сек' },
  { icon: MousePointerClick, t: 'Выбираете товар', d: 'Цена уже с комиссией. Никаких корзин — кнопка «Купить» списывает с баланса.', ts: 'T+0,5 сек' },
  { icon: RefreshCcw, t: 'Мы покупаем у поставщика', d: 'Бэкенд сам берёт товар по API. Основной не ответил — заказ уходит резервному.', ts: 'T+1,2 сек' },
  { icon: PackageCheck, t: 'Код у вас', d: 'В кабинете, на почте и в Telegram. Сбой у всех поставщиков — деньги вернутся на баланс сами.', ts: 'T+1,8 сек' },
]

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 md:px-6">
      <SectionHead eyebrow="почему за секунды" title="Склада нет — есть скорость" />
      <div className="relative grid gap-4 md:grid-cols-4 grid-cols-1">
        {/* соединительная линия */}
        <div className="absolute left-0 right-0 top-[38px] hidden h-px md:block"
          style={{ background: 'repeating-linear-gradient(90deg, #c9d3f2 0 8px, transparent 8px 16px)' }} />
        {STEPS.map((s, i) => (
          <Reveal key={s.t} delay={i * 90}>
            <div className="relative">
              <div className="panel relative z-10 flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="grad-volt flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-volt">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[11px] font-medium text-volt num">{s.ts}</span>
                </div>
                <div className="mt-4 text-[15.5px] font-semibold">{s.t}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{s.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ================= VPN-ПОЛОСА ================= */
function VpnBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6">
      <Reveal>
        <div className="grad-night relative overflow-hidden rounded-3xl text-white">
          <div className="relative z-10 grid items-center gap-8 p-7 md:grid-cols-2 md:p-12 grid-cols-1">
            <div>
              <div className="eyebrow mb-3 flex items-center gap-2 !text-pulse">
                <ShieldCheck className="h-4 w-4" /> собственная инфраструктура
              </div>
              <h2 className="font-display text-[30px] font-bold leading-tight md:text-[40px]">
                VPN, который работает, когда другие отвалились
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Свои серверы, а не реселлинг: российский вход + европейский выход.
                Проходит режим «белых списков» мобильных операторов — проверено замерами.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <Gauge className="h-5 w-5 self-center text-pulse" />
                    <span className="font-display text-[34px] font-bold num"><CountUp value={185} duration={1600} /></span>
                    <span className="text-[14px] text-white/60">Мбит/с</span>
                  </div>
                  <div className="text-[12px] text-white/45">замер на мобильной сети</div>
                </div>
                <div>
                  <div className="font-display text-[34px] font-bold num">4</div>
                  <div className="text-[12px] text-white/45">протокола подключения</div>
                </div>
                <div>
                  <div className="font-display text-[34px] font-bold num">299 ₽</div>
                  <div className="text-[12px] text-white/45">в месяц · 3 устройства</div>
                </div>
              </div>
              <Link to="/c/vpn" className="btn mt-7 gap-2 bg-white px-7 py-3.5 text-[15px] font-semibold text-ink hover:bg-white/90">
                Подключить VPN <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <WowMap
              dark
              className="max-md:-mx-2"
              mapPins={[
                { key: 'moscow', color: '#00C6FF', big: true },
                { key: 'amsterdam', color: '#0FB871', big: true },
                { key: 'frankfurt', color: '#0FB871' },
                { key: 'tr', color: '#0FB871' },
              ]}
              arcs={[
                { from: 'moscow', to: 'amsterdam', color: '#00C6FF' },
                { from: 'moscow', to: 'frankfurt', color: '#00C6FF' },
                { from: 'moscow', to: 'tr', color: '#00C6FF' },
              ]}
            />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ================= eSIM-КАРТА ================= */
function EsimTeaser() {
  const top = productsByCat('esim').filter(p => p.popular).slice(0, 5)
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6">
      <SectionHead
        eyebrow="интернет в поездке"
        title="eSIM: ткни в страну — увидишь цену"
        right={<Link to="/c/esim" className="flex items-center gap-1 text-[14px] font-medium text-volt">Все 200+ направлений <ChevronRight className="h-4 w-4" /></Link>}
      />
      <Reveal>
        <div className="panel relative overflow-hidden p-4 md:p-6">
          <WowMap
            mapPins={top.map(p => ({ key: p.mapKey!, color: '#2E5BFF' }))}
            className="mx-auto max-w-4xl"
          />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {top.map(p => (
              <Link key={p.id} to={`/p/${p.id}`}
                className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[13.5px] font-medium transition-colors hover:border-volt hover:text-volt">
                <img src={p.flag} alt="" className="h-4 w-6 rounded-sm object-cover" />
                {p.title.replace('eSIM ', '')}
                <span className="num text-muted">от {rub(minPrice(p))}</span>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ================= ОТЗЫВЫ ================= */
const REVIEWS = [
  { name: 'Дмитрий', city: 'Казань', text: 'Ключ пришёл быстрее, чем открылся Steam. Думал, будет как на серых площадках — ждать продавца. А тут просто мгновенно.', item: 'ELDEN RING', sec: '1,4 с' },
  { name: 'Алина', city: 'Сочи', text: 'Купила eSIM для Турции прямо в аэропорту, отсканировала QR — интернет заработал ещё до посадки. Спасла вся поездка.', item: 'eSIM Турция · 5 ГБ', sec: '3,2 с' },
  { name: 'Сергей', city: 'Екатеринбург', text: 'VPN реально живёт на МегаФоне, когда всё остальное лежит. Баланс пополнил один раз и продлеваю в два клика.', item: 'Unicard VPN · 6 мес', sec: '0,9 с' },
  { name: 'Марат', city: 'Уфа', text: 'Пополнял Steam на 1000 — комиссия видна сразу, без сюрпризов на последнем шаге. Зачислилось за минуту.', item: 'Пополнение Steam', sec: '44 с' },
]

function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6">
      <SectionHead eyebrow="12 400+ отзывов · 4,9" title="Что пишут после первой покупки" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 grid-cols-1">
        {REVIEWS.map((r, i) => (
          <Reveal key={r.name} delay={i * 60}>
            <figure className="panel flex h-full flex-col p-5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <blockquote className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink/85">{r.text}</blockquote>
              <figcaption className="mt-4 border-t border-line pt-3">
                <div className="text-[13.5px] font-semibold">{r.name} · <span className="font-normal text-muted">{r.city}</span></div>
                <div className="mt-1 flex items-center justify-between gap-2 font-mono text-[11px] text-muted">
                  <span className="truncate">{r.item}</span>
                  <span className="flex shrink-0 items-center gap-1 text-ok"><Zap className="h-3 w-3" />{r.sec}</span>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ================= FAQ ================= */
const FAQ = [
  { q: 'Что будет, если код не сработает?', a: 'Каждое направление подключено минимум к двум поставщикам. Если основной выдал нерабочий код или не ответил — заказ автоматически уходит резервному. При полном сбое деньги мгновенно возвращаются на баланс, без переписки с поддержкой.' },
  { q: 'Почему дешевле, чем в официальном магазине?', a: 'Мы покупаем оптом по API у проверенных поставщиков в момент вашего заказа. Склада и заморозки денег нет, поэтому наценка минимальная — вы видите её сразу в цене.' },
  { q: 'Зачем нужен баланс, можно платить сразу картой?', a: 'Баланс — это скорость: покупка списывается мгновенно, без 3-DS и форм оплаты. Пополняется от 300 ₽ картой, СБП или криптой. Всё, что на балансе, тратится на любые товары сервиса.' },
  { q: 'Можно ли вернуть деньги с баланса на карту?', a: 'Нет — средства тратятся внутри сервиса, так работает большинство площадок цифровых товаров. Зато отменённые заказы возвращаются на баланс мгновенно и без комиссии.' },
  { q: 'VPN правда работает при «белых списках»?', a: 'Да. Инфраструктура своя: вход через российский сервер, который проходит фильтры операторов, выход — в Европе. Замер на мобильной сети — 185 Мбит/с. Если адрес попадёт под фильтр, система заменит его автоматически, вы этого не заметите.' },
  { q: 'Как быстро отвечает поддержка?', a: 'Telegram-чат, круглосуточно. Среднее время первого ответа — 4 минуты. Но в 98% заказов поддержка не нужна: всё приходит само.' },
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-28 px-4 pt-20 md:px-6">
      <SectionHead eyebrow="перед первым заказом" title="Частые вопросы" />
      <div className="space-y-2.5">
        {FAQ.map((f, i) => (
          <Reveal key={i} delay={i * 40}>
            <div className={`panel overflow-hidden transition-colors ${open === i ? 'border-volt/40' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="flex items-center gap-3 text-[15px] font-semibold">
                  <MessageCircleQuestion className={`h-5 w-5 shrink-0 ${open === i ? 'text-volt' : 'text-muted'}`} />
                  {f.q}
                </span>
                <ChevronRight className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${open === i ? 'rotate-90' : ''}`} />
              </button>
              <div className="grid transition-[grid-template-rows] duration-300" style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 pl-[52px] text-[14px] leading-relaxed text-muted">{f.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ================= ФИНАЛЬНЫЙ CTA ================= */
function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6">
      <Reveal>
        <div className="grad-volt relative overflow-hidden rounded-3xl p-8 text-center text-white md:p-14">
          <div className="pointer-events-none absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1.5px), radial-gradient(circle at 80% 60%, #fff 1px, transparent 1.5px)', backgroundSize: '46px 46px' }} />
          <h2 className="relative font-display text-[28px] font-bold leading-tight md:text-[40px]">
            Пополни баланс — дальше всё за секунды
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-[15px] text-white/85">
            От 300 ₽. Карта, СБП или крипта. Первый заказ — со скидкой 10% по промокоду WELCOME10.
          </p>
          <Link to="/account/topup" className="btn relative mt-7 gap-2 bg-white px-8 py-4 text-[16px] font-bold text-volt hover:bg-white/90">
            <Wallet className="h-5 w-5" /> Пополнить баланс
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickBuy />
      <CategoryTiles />
      <DayDeals />
      <Hits />
      <HowItWorks />
      <VpnBand />
      <EsimTeaser />
      <Reviews />
      <Faq />
      <FinalCta />
    </main>
  )
}
