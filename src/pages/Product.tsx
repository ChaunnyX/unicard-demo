import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Zap, ShieldCheck, RefreshCcw, Wallet, Eye, Check, Plus } from 'lucide-react'
import { CATEGORIES, PRODUCTS, getProduct, minPrice } from '../data/products'
import type { Product } from '../data/products'
import { rub } from '../lib/format'
import { useBuy } from '../lib/useBuy'
import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'
import { Crumbs, DeliveryBadge, Rating, Reveal, Tile } from '../components/ui'

const TARGET_LABEL: Record<string, string> = {
  'topup-steam': 'Логин Steam',
  'topup-tgpremium': '@username в Telegram',
  'topup-tgstars': '@username в Telegram',
  'topup-pubg': 'ID игрока',
  'topup-roblox': 'Ник в Roblox',
  'topup-genshin': 'UID и сервер',
  'topup-brawl': 'Тег игрока',
  'topup-mlbb': 'ID и сервер',
  'topup-phone': 'Номер телефона',
  'game-stalker2': 'Ссылка на профиль Steam',
}

/** «С этим покупают» — кросс-сейл с причиной */
function crossSell(p: Product): { prod: Product; reason: string }[] {
  const pick = (id: string, reason: string) => {
    const prod = PRODUCTS.find(x => x.id === id)
    return prod && prod.id !== p.id ? [{ prod, reason }] : []
  }
  switch (p.cat) {
    case 'games':
      return [...pick('gift-steam-ru', 'Пополнить кошелёк на DLC и внутриигровые покупки'), ...pick('vpn-basic', 'Стабильный пинг и доступ к игровым сервисам')]
    case 'gift':
      return [...pick('topup-steam', 'Точная сумма без остатка — пополнение по логину'), ...pick('card-virtual', 'Платить в зарубежных магазинах напрямую')]
    case 'esim':
      return [...pick('vpn-basic', 'Привычные сервисы работают в любой стране'), ...pick('card-virtual', 'Оплата отелей и такси за границей')]
    case 'vpn':
      return [...pick('esim-tr', 'Интернет в поездке — тот же кабинет'), ...pick('proxy-resi', 'Для рабочих задач и мультиаккаунтов')]
    case 'proxy':
      return [...pick('vpn-basic', 'Личный трафик — через VPN, рабочий — через прокси'), ...pick('card-virtual', 'Оплачивать зарубежные сервисы для работы')]
    case 'topup':
      return [...pick('gift-steam-ru', 'Подарочная карта — если нужен именно код'), ...pick('vpn-basic', 'Доступ к игровым сервисам без блокировок')]
    default:
      return [...pick('gift-steam-ru', 'Самый популярный товар сервиса'), ...pick('vpn-basic', 'Подписка выдаётся мгновенно')]
  }
}

export default function ProductPage() {
  const { id } = useParams()
  const p = getProduct(id ?? '')
  const [varIdx, setVarIdx] = useState(0)
  const [target, setTarget] = useState('')
  const buyNow = useBuy()
  const { user, balance } = useStore()

  const similar = useMemo(() =>
    p ? PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id)
      .sort((a, b) => Math.abs(minPrice(a) - minPrice(p)) - Math.abs(minPrice(b) - minPrice(p)))
      .slice(0, 4) : [],
  [p])

  const watching = useMemo(() => 3 + ((id ?? '').length * 7) % 14, [id])

  if (!p) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <h1 className="font-display text-[28px] font-bold">Товар не найден</h1>
        <Link to="/" className="btn-primary mt-6 inline-flex px-6 py-3">На главную</Link>
      </div>
    )
  }

  const cat = CATEGORIES.find(c => c.id === p.cat)!
  const v = p.variants[Math.min(varIdx, p.variants.length - 1)]
  const targetLabel = TARGET_LABEL[p.id]
  const cross = crossSell(p)
  const lacking = user && balance < v.price ? v.price - balance : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Crumbs items={[{ label: cat.name, to: `/c/${cat.id}` }, { label: p.title }]} />

      <div className="grid gap-8 lg:grid-cols-[1fr_420px] grid-cols-1">
        {/* медиа + описание */}
        <div className="min-w-0">
          <div className="panel overflow-hidden">
            <div className="relative aspect-[2.15/1]">
              {p.img ? (
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
              ) : p.flag ? (
                <div className="relative h-full w-full bg-gradient-to-br from-[#eef2ff] to-[#dcf3ff]">
                  <img src={p.flag} alt="" className="absolute left-1/2 top-1/2 h-24 w-36 -translate-x-1/2 -translate-y-1/2 rounded-xl object-cover shadow-lift" />
                </div>
              ) : p.tile ? (
                <Tile {...p.tile} className="h-full w-full" markClass="text-[44px]" />
              ) : null}
              {p.badge && (
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white ${p.discount ? 'bg-hot' : 'bg-ink/80 backdrop-blur'}`}>
                  {p.badge}
                </span>
              )}
            </div>
          </div>

          {p.bullets && (
            <div className="panel mt-4 p-6">
              <h2 className="font-display text-[18px] font-semibold">Что важно знать</h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 grid-cols-1">
                {p.bullets.map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.desc && (
            <div className="panel mt-4 p-6">
              <h2 className="font-display text-[18px] font-semibold">Описание</h2>
              <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-muted">{p.desc}</p>
              {p.region && <p className="mt-3 font-mono text-[12px] text-muted">{p.region}</p>}
            </div>
          )}

          {/* с этим покупают */}
          {cross.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-[20px] font-semibold">С этим покупают</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 grid-cols-1">
                {cross.map(({ prod, reason }) => (
                  <Link key={prod.id} to={`/p/${prod.id}`} className="panel panel-hover flex items-center gap-4 p-4">
                    {prod.img
                      ? <img src={prod.img} alt="" className="h-12 w-20 shrink-0 rounded-lg object-cover" />
                      : prod.flag
                        ? <img src={prod.flag} alt="" className="h-9 w-13 shrink-0 rounded-lg object-cover shadow-soft" />
                        : prod.tile ? <Tile {...prod.tile} className="h-12 w-20 shrink-0 rounded-lg" markClass="text-[13px]" /> : null}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{prod.title}</div>
                      <div className="mt-0.5 flex items-start gap-1.5 text-[12px] leading-snug text-ok">
                        <Check className="mt-0.5 h-3 w-3 shrink-0" /> {reason}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="num text-[14px] font-bold">от {rub(minPrice(prod))}</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-volt-tint text-volt"><Plus className="h-4 w-4" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* панель покупки */}
        <div>
          <div className="panel sticky top-32 p-6">
            <div className="flex items-center gap-2">
              <DeliveryBadge sec={p.deliverySec} />
              <span className="flex items-center gap-1 text-[12px] text-muted"><Eye className="h-3.5 w-3.5" /> {watching} смотрят сейчас</span>
            </div>
            <h1 className="mt-3 font-display text-[26px] font-bold leading-tight">{p.title}</h1>
            {p.subtitle && <div className="mt-1 text-[14px] text-muted">{p.subtitle}</div>}
            <Rating value={p.rating} reviews={p.reviews} className="mt-2" />

            {p.variants.length > 1 && (
              <>
                <div className="eyebrow mb-2 mt-5">{p.cat === 'esim' ? 'Пакет' : p.cat === 'vpn' ? 'Период' : 'Номинал'}</div>
                <div className="flex flex-wrap gap-2">
                  {p.variants.map((vv, i) => (
                    <button key={vv.id} onClick={() => setVarIdx(i)}
                      className={`num cursor-pointer rounded-xl border px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                        i === varIdx ? 'border-volt bg-volt text-white shadow-volt' : 'border-line hover:border-volt/40'
                      }`}>
                      {vv.label}
                      {vv.sub && <span className={`ml-1.5 text-[11px] font-medium ${i === varIdx ? 'text-white/75' : 'text-muted'}`}>{vv.sub}</span>}
                    </button>
                  ))}
                </div>
              </>
            )}

            {targetLabel && (
              <>
                <div className="eyebrow mb-2 mt-5">{targetLabel}</div>
                <input className="input" placeholder={targetLabel} value={target} onChange={e => setTarget(e.target.value)} />
              </>
            )}

            <div className="mt-6 flex items-baseline gap-2.5">
              <span className="font-display text-[34px] font-bold num">{rub(v.price)}</span>
              {v.old && (
                <>
                  <span className="num text-[16px] text-muted line-through">{rub(v.old)}</span>
                  <span className="rounded-full bg-hot/10 px-2 py-0.5 text-[12px] font-bold text-hot num">−{Math.round((1 - v.price / v.old) * 100)}%</span>
                </>
              )}
            </div>

            <button onClick={() => buyNow(p, v, target || undefined)} className="btn-primary mt-4 w-full py-4 text-[16px]">
              <Zap className="h-5 w-5" /> Купить — спишется с баланса
            </button>
            {user ? (
              lacking > 0 ? (
                <p className="mt-2.5 text-center text-[12.5px] text-muted">
                  На балансе {rub(balance)} — не хватает {rub(lacking)}, предложим пополнить
                </p>
              ) : (
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[12.5px] text-muted">
                  <Wallet className="h-3.5 w-3.5 text-ok" /> На балансе {rub(balance)} — хватает
                </p>
              )
            ) : (
              <p className="mt-2.5 text-center text-[12.5px] text-muted">Вход через Telegram — 5 секунд, без пароля</p>
            )}

            <div className="mt-5 space-y-2.5 border-t border-line pt-4">
              {[
                { icon: Zap, text: cat.auto[0].toUpperCase() + cat.auto.slice(1) + ' — код в кабинете и на почте' },
                { icon: RefreshCcw, text: 'Задержка выдачи — сработает резервный канал' },
                { icon: ShieldCheck, text: 'Любой сбой — деньги вернутся на баланс сами' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-[12.5px] leading-snug text-muted">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-volt" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* похожие */}
      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-[22px] font-semibold">Похожие товары</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1">
            {similar.map((s, i) => (
              <Reveal key={s.id} delay={i * 50}><ProductCard p={s} /></Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
