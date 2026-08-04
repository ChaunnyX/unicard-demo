import { useState } from 'react'
import { ADMIN_ORDERS } from '../../data/admin'
import { rub, fmtDateTime } from '../../lib/format'

const STATUS: Record<string, { label: string; cls: string }> = {
  done: { label: 'выдан', cls: 'bg-ok-tint text-ok' },
  processing: { label: 'выдаётся', cls: 'bg-amber-50 text-amber-600' },
  refund: { label: 'возврат на баланс', cls: 'bg-hot/10 text-hot' },
}

export default function AdminOrders() {
  const [status, setStatus] = useState('all')
  const list = status === 'all' ? ADMIN_ORDERS : ADMIN_ORDERS.filter(o => o.status === status)
  const profit = list.reduce((a, o) => a + (o.status === 'refund' ? 0 : o.price - o.cost), 0)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[22px] font-bold">Заказы</h1>
        <div className="flex gap-1.5">
          {[['all', 'Все'], ['done', 'Выданы'], ['processing', 'Выдаются'], ['refund', 'Возвраты']].map(([id, label]) => (
            <button key={id} onClick={() => setStatus(id)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                status === id ? 'bg-ink text-white' : 'border border-line bg-surface text-muted hover:text-ink'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel mt-4 overflow-hidden">
        <div className="scroll-x">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-muted">
                <th className="px-5 py-2.5 font-medium">Заказ</th>
                <th className="px-2 py-2.5 font-medium">Клиент</th>
                <th className="px-2 py-2.5 font-medium">Товар</th>
                <th className="px-2 py-2.5 text-right font-medium">Цена</th>
                <th className="px-2 py-2.5 text-right font-medium">Прибыль</th>
                <th className="px-2 py-2.5 text-right font-medium">Выдача</th>
                <th className="px-2 py-2.5 text-right font-medium">Когда</th>
                <th className="px-5 py-2.5 text-right font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {list.map(o => (
                <tr key={o.id} className="border-b border-line/60 last:border-0 hover:bg-paper/40">
                  <td className="px-5 py-2.5 font-mono text-[11.5px] text-muted">{o.id}</td>
                  <td className="px-2 py-2.5">{o.user}</td>
                  <td className="max-w-[220px] truncate px-2 py-2.5 font-medium">{o.item}</td>
                  <td className="num px-2 py-2.5 text-right font-semibold">{rub(o.price)}</td>
                  <td className={`num px-2 py-2.5 text-right ${o.status === 'refund' ? 'text-muted line-through' : 'text-ok'}`}>+{rub(o.price - o.cost)}</td>
                  <td className="num px-2 py-2.5 text-right font-mono text-[11.5px] text-muted">{(o.ms / 1000).toFixed(1)} с</td>
                  <td className="px-2 py-2.5 text-right font-mono text-[10.5px] text-muted">{fmtDateTime(o.ts)}</td>
                  <td className="px-5 py-2.5 text-right">
                    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between border-t border-line px-5 py-3 text-[12.5px] text-muted">
          <span>{list.length} заказов</span>
          <span>Прибыль по выборке: <b className="num text-ok">+{rub(profit)}</b></span>
        </div>
      </div>
    </div>
  )
}
