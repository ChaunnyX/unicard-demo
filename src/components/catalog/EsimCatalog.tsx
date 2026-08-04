import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Zap, Smartphone, QrCode, Wifi } from 'lucide-react'
import { productsByCat, minPrice } from '../../data/products'
import { rub } from '../../lib/format'
import { Crumbs, Rating, Reveal } from '../ui'
import WowMap from '../WowMap'
import mapData from '../../data/mapPins.json'

const { viewBox, pins } = mapData as { viewBox: string; pins: Record<string, { x: number; y: number }> }

/** eSIM: интерактивная карта мира — ткни в страну, увидишь цену */
export default function EsimCatalog() {
  const all = useMemo(() => productsByCat('esim'), [])
  const [q, setQ] = useState('')
  const [hover, setHover] = useState<string | null>(null)
  const nav = useNavigate()

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return all
    return all.filter(p => p.title.toLowerCase().includes(s) || (p.subtitle ?? '').toLowerCase().includes(s))
  }, [all, q])

  const hovered = hover ? all.find(p => p.mapKey === hover) : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Crumbs items={[{ label: 'eSIM для поездок' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold tracking-tight md:text-[40px]">Интернет в 200+ странах</h1>
          <p className="mt-2 max-w-xl text-[15px] text-muted">
            QR-код приходит за минуту. Сканируете — и в поездке сразу есть интернет, роуминг не нужен.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-[13px] text-muted">
          {[
            { icon: QrCode, t: 'QR за минуту' },
            { icon: Smartphone, t: 'установка за 2 мин' },
            { icon: Wifi, t: 'без роуминга' },
          ].map(({ icon: Icon, t }) => (
            <span key={t} className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-volt" />{t}</span>
          ))}
        </div>
      </div>

      {/* интерактивная карта */}
      <Reveal className="mt-8">
        <div className="panel relative overflow-hidden p-4 md:p-6">
          <div className="relative mx-auto max-w-4xl">
            <WowMap mapPins={all.filter(p => p.mapKey && p.mapKey in pins).map(p => ({
              key: p.mapKey!,
              color: hover === p.mapKey ? '#00C6FF' : '#2E5BFF',
              big: hover === p.mapKey,
            }))} />
            {/* невидимые кликабельные зоны поверх пинов */}
            <svg viewBox={viewBox} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
              {all.filter(p => p.mapKey && p.mapKey in pins).map(p => {
                const c = pins[p.mapKey!]
                return (
                  <circle
                    key={p.id} cx={c.x} cy={c.y} r={3.2} fill="transparent" className="cursor-pointer"
                    onMouseEnter={() => setHover(p.mapKey!)} onMouseLeave={() => setHover(null)}
                    onClick={() => nav(`/p/${p.id}`)}
                  />
                )
              })}
            </svg>
            {/* тултип поверх карты */}
            {hovered && (() => {
              const c = pins[hovered.mapKey!]
              const [, , w, h] = viewBox.split(' ').map(Number)
              return (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-ink px-3.5 py-2 text-white shadow-lift"
                  style={{ left: `${(c.x / w) * 100}%`, top: `${(c.y / h) * 100}%`, marginTop: '-8px', animation: 'feed-in 150ms ease-out' }}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold">
                    <img src={hovered.flag} alt="" className="h-3.5 w-5 rounded-[3px] object-cover" />
                    {hovered.title.replace('eSIM ', '')}
                  </div>
                  <div className="num whitespace-nowrap text-[12px] text-pulse">от {rub(minPrice(hovered))} · {hovered.variants.length} пакета</div>
                </div>
              )
            })()}
          </div>
          <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            наведите на точку · клик — к пакетам страны
          </p>
        </div>
      </Reveal>

      {/* поиск и сетка стран */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[22px] font-semibold">Направления</h2>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="input py-2.5 pl-10 text-[14px]" placeholder="Найти страну…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 grid-cols-1">
        {list.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 50}>
            <Link to={`/p/${p.id}`}
              className="panel panel-hover group flex items-center gap-4 p-4"
              onMouseEnter={() => p.mapKey && setHover(p.mapKey)} onMouseLeave={() => setHover(null)}>
              <img src={p.flag} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover shadow-soft" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold">{p.title.replace('eSIM ', '')}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[12.5px] text-muted">
                  <span>{p.variants.length} пакета</span>·<Rating value={p.rating} />
                </div>
              </div>
              <div className="text-right">
                <div className="num text-[15px] font-bold">от {rub(minPrice(p))}</div>
                <div className="flex items-center justify-end gap-1 font-mono text-[10.5px] uppercase tracking-wide text-ok">
                  <Zap className="h-3 w-3" /> QR за минуту
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      {list.length === 0 && (
        <div className="panel mt-5 p-10 text-center text-muted">
          Такой страны в списке пока нет — напишите в поддержку, добавим направление под вас.
        </div>
      )}
    </div>
  )
}
