import { useMemo, useState } from 'react'
import { Network, Server, Smartphone, Building2, Check, Zap } from 'lucide-react'
import { productsByCat } from '../../data/products'
import { rub } from '../../lib/format'
import { useBuy } from '../../lib/useBuy'
import { Crumbs, Rating, Reveal, Tile } from '../ui'

const TYPE_ICON = { 'proxy-resi': Network, 'proxy-mobile': Smartphone, 'proxy-dc': Server, 'proxy-isp': Building2 } as const

/** Прокси: калькулятор объёма → живая цена, ниже — карточки типов */
export default function ProxyCatalog() {
  const all = useMemo(() => productsByCat('proxy'), [])
  const [typeIdx, setTypeIdx] = useState(0)
  const [varIdx, setVarIdx] = useState(0)
  const buyNow = useBuy()

  const p = all[typeIdx]
  const v = p.variants[Math.min(varIdx, p.variants.length - 1)]
  const unit = p.id === 'proxy-resi' ? 'ГБ' : p.id === 'proxy-mobile' ? '' : 'IP'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Crumbs items={[{ label: 'Прокси' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold tracking-tight md:text-[40px]">Прокси под задачу</h1>
          <p className="mt-2 max-w-xl text-[15px] text-muted">
            Резидентные, мобильные, датацентр и ISP. Доступы приходят в кабинет за минуту, панель и API — в комплекте.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-ok-tint px-4 py-2 font-mono text-[12px] font-medium text-ok">
          <Zap className="h-3.5 w-3.5" /> выдача до минуты
        </span>
      </div>

      {/* калькулятор */}
      <Reveal className="mt-8">
        <div className="panel overflow-hidden">
          <div className="border-b border-line px-6 py-4">
            <h2 className="font-display text-[18px] font-semibold">Соберите свой пакет</h2>
          </div>
          <div className="grid gap-0 lg:grid-cols-[1fr_320px] grid-cols-1">
            <div className="p-6">
              <div className="eyebrow mb-3">Тип прокси</div>
              <div className="grid gap-2 sm:grid-cols-2 grid-cols-1">
                {all.map((t, i) => {
                  const Icon = TYPE_ICON[t.id as keyof typeof TYPE_ICON] ?? Network
                  return (
                    <button key={t.id} onClick={() => { setTypeIdx(i); setVarIdx(0) }}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                        i === typeIdx ? 'border-volt bg-volt-tint' : 'border-line hover:border-volt/40'
                      }`}>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${i === typeIdx ? 'bg-volt text-white' : 'bg-paper text-muted'}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span>
                        <span className="block text-[14px] font-semibold">{t.title}</span>
                        <span className="block text-[12px] text-muted">{t.subtitle}</span>
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="eyebrow mb-3 mt-6">Объём</div>
              <div className="flex flex-wrap gap-2">
                {p.variants.map((vv, i) => (
                  <button key={vv.id} onClick={() => setVarIdx(i)}
                    className={`num cursor-pointer rounded-xl border px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                      i === Math.min(varIdx, p.variants.length - 1) ? 'border-volt bg-volt text-white shadow-volt' : 'border-line hover:border-volt/40'
                    }`}>
                    {vv.label}{vv.sub && <span className={`ml-1.5 text-[11px] font-medium ${i === varIdx ? 'text-white/75' : 'text-muted'}`}>{vv.sub}</span>}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[13px] text-muted">{p.region}. {p.desc}</p>
            </div>

            <div className="flex flex-col justify-between border-t border-line bg-paper/60 p-6 lg:border-l lg:border-t-0">
              <div>
                <div className="eyebrow">Итого</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-[36px] font-bold num">{rub(v.price)}</span>
                  {unit && <span className="text-[13px] text-muted">за {v.label}{unit === 'ГБ' ? '' : ''}</span>}
                </div>
                <ul className="mt-4 space-y-2">
                  {(p.bullets ?? ['Доступы в кабинете за минуту', 'Панель управления и API']).map(b => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => buyNow(p, v)} className="btn-primary mt-6 w-full py-3.5 text-[15px]">
                <Zap className="h-4 w-4" /> Купить — доступы сразу
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* карточки типов */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1">
        {all.map((t, i) => (
          <Reveal key={t.id} delay={i * 60}>
            <button onClick={() => { setTypeIdx(i); setVarIdx(0); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="panel panel-hover block w-full cursor-pointer overflow-hidden text-left">
              {t.tile && <Tile {...t.tile} className="h-24 w-full" markClass="text-[20px]" />}
              <div className="p-4">
                <div className="text-[15px] font-semibold">{t.title}</div>
                <div className="mt-0.5 text-[12.5px] text-muted">{t.region}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="num text-[15px] font-bold">от {rub(Math.min(...t.variants.map(x => x.price)))}</span>
                  <Rating value={t.rating} reviews={t.reviews} className="text-muted" />
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10">
        <div className="panel flex flex-wrap items-center gap-4 p-6 text-[14px] text-muted">
          <Network className="h-5 w-5 shrink-0 text-volt" />
          <span className="flex-1">
            Не уверены, какой тип нужен? Для парсинга и мультиаккаунтов — резидентные, для соцсетей —
            мобильные, для скорости — датацентр. Напишите в поддержку, подберём под задачу за 5 минут.
          </span>
          <span className="btn-ghost cursor-pointer px-5 py-2.5 text-[13.5px]">Спросить в Telegram</span>
        </div>
      </Reveal>
    </div>
  )
}
