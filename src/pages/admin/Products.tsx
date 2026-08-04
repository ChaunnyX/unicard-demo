import { useState } from 'react'
import { Percent, Check, Search } from 'lucide-react'
import { CATEGORY_MARKUP } from '../../data/admin'
import { PRODUCTS, minPrice } from '../../data/products'
import { rub } from '../../lib/format'

/** Товары и наценки: процент по категории + переопределение на товаре */
export default function AdminProducts() {
  const [markup, setMarkup] = useState<Record<string, number>>(
    Object.fromEntries(CATEGORY_MARKUP.map(c => [c.id, c.markup])),
  )
  const [saved, setSaved] = useState<string | null>(null)
  const [q, setQ] = useState('')

  const list = PRODUCTS.filter(p =>
    !q || p.title.toLowerCase().includes(q.toLowerCase()),
  ).slice(0, 40)

  return (
    <div>
      <h1 className="font-display text-[22px] font-bold">Товары и наценки</h1>
      <p className="mt-1 text-[13.5px] text-muted">
        Цены тянутся от поставщиков автоматически, наценка применяется поверх. Изменение — мгновенно на витрине.
      </p>

      {/* наценка по категориям */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {CATEGORY_MARKUP.map(c => (
          <div key={c.id} className="panel p-3.5">
            <div className="text-[12px] font-semibold leading-tight">{c.cat}</div>
            <div className="mt-0.5 text-[10.5px] text-muted">{c.products} товаров</div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="relative flex-1">
                <input
                  type="number" min={0} max={99}
                  value={markup[c.id]}
                  onChange={e => setMarkup(m => ({ ...m, [c.id]: +e.target.value }))}
                  className="num w-full rounded-lg border border-line px-2 py-1.5 pr-6 text-[13px] font-bold outline-none focus:border-volt"
                />
                <Percent className="absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" />
              </div>
              <button
                onClick={() => { setSaved(c.id); setTimeout(() => setSaved(s => (s === c.id ? null : s)), 1500) }}
                className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                  saved === c.id ? 'bg-ok text-white' : 'bg-ink text-white hover:bg-volt'
                }`}>
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* таблица товаров */}
      <div className="panel mt-5 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="text-[15px] font-semibold">Каталог · {PRODUCTS.length} позиций</h2>
          <div className="relative w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input className="w-full rounded-lg border border-line py-1.5 pl-8 pr-3 text-[12.5px] outline-none focus:border-volt"
              placeholder="Поиск товара…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>
        <div className="scroll-x">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-muted">
                <th className="px-5 py-2.5 font-medium">Товар</th>
                <th className="px-2 py-2.5 font-medium">Категория</th>
                <th className="px-2 py-2.5 text-right font-medium">Закупка ≈</th>
                <th className="px-2 py-2.5 text-right font-medium">Наценка</th>
                <th className="px-2 py-2.5 text-right font-medium">Витрина</th>
                <th className="px-5 py-2.5 text-right font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {list.map(p => {
                const price = minPrice(p)
                const mk = markup[p.cat] ?? 15
                const cost = Math.round(price / (1 + mk / 100))
                return (
                  <tr key={p.id} className="border-b border-line/60 last:border-0 hover:bg-paper/40">
                    <td className="max-w-[240px] truncate px-5 py-2.5 font-medium">{p.title} {p.subtitle && <span className="text-muted">· {p.subtitle}</span>}</td>
                    <td className="px-2 py-2.5 text-muted">{p.cat}</td>
                    <td className="num px-2 py-2.5 text-right text-muted">{rub(cost)}</td>
                    <td className="num px-2 py-2.5 text-right">{mk}%</td>
                    <td className="num px-2 py-2.5 text-right font-bold">{p.variants.length > 1 ? 'от ' : ''}{rub(price)}</td>
                    <td className="px-5 py-2.5 text-right">
                      <span className="rounded-full bg-ok-tint px-2 py-0.5 text-[11px] font-semibold text-ok">активен</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
