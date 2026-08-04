import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { useStore } from '../../lib/store'
import { getProduct } from '../../data/products'
import type { CategoryId } from '../../data/products'
import { fmtDateTime, rub } from '../../lib/format'
import { CatIcon, CopyBtn } from '../../components/ui'

function CodeCell({ code }: { code: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex items-center gap-2">
      <code className="max-w-[230px] truncate rounded-lg bg-paper px-2.5 py-1.5 font-mono text-[12px]">
        {show ? code : code.replace(/[A-Z0-9a-z]/g, '•').slice(0, 22)}
      </code>
      <button onClick={() => setShow(s => !s)} className="cursor-pointer text-muted transition-colors hover:text-ink">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <CopyBtn text={code} />
    </div>
  )
}

export default function Orders() {
  const { orders } = useStore()
  const [cat, setCat] = useState<string>('all')

  const cats = useMemo(() => ['all', ...Array.from(new Set(orders.map(o => o.cat)))], [orders])
  const list = cat === 'all' ? orders : orders.filter(o => o.cat === cat)
  const catName: Record<string, string> = { all: 'Все', gift: 'Gift', games: 'Игры', topup: 'Донат', esim: 'eSIM', vpn: 'VPN', proxy: 'Прокси', cards: 'Карты' }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[26px] font-bold">Мои заказы</h1>
        {orders.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  cat === c ? 'bg-ink text-white' : 'border border-line bg-surface text-muted hover:text-ink'
                }`}>
                {catName[c] ?? c}
              </button>
            ))}
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <div className="panel mt-5 p-10 text-center">
          <p className="text-[14.5px] text-muted">Здесь появятся все покупки с кодами — они хранятся навсегда.</p>
          <Link to="/" className="btn-primary mt-5 inline-flex px-6 py-3 text-[14px]">Сделать первый заказ</Link>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {list.map(o => {
            const p = getProduct(o.productId)
            return (
              <div key={o.id} className="panel p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-volt-tint text-volt">
                    <CatIcon cat={o.cat as CategoryId} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold">{o.title} <span className="text-muted">· {o.variantLabel}</span></div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[11.5px] text-muted">
                      <span>{o.id}</span><span>{fmtDateTime(o.ts)}</span>
                      {o.target && <span>→ {o.target}</span>}
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    o.status === 'done' ? 'bg-ok-tint text-ok' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <Check className="h-3.5 w-3.5" />
                    {o.status === 'done'
                      ? `Выдан${o.deliverMs ? ` за ${(o.deliverMs / 1000).toFixed(1).replace('.', ',')} с` : ''}`
                      : 'Выдаётся…'}
                  </span>
                  <span className="num text-[16px] font-bold">{rub(o.price)}</span>
                </div>
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5">
                  <CodeCell code={o.code} />
                  {p && (
                    <Link to={`/p/${p.id}`} className="flex items-center gap-1.5 text-[12.5px] font-medium text-volt">
                      <RotateCcw className="h-3.5 w-3.5" /> Купить ещё раз
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
