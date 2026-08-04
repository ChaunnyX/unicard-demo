import { TrendingUp, Wallet, ReceiptText, Users, Zap, AlertTriangle } from 'lucide-react'
import { KPI, REVENUE_DAYS, CAT_SHARE, DEPOSITS, ADMIN_ORDERS } from '../../data/admin'
import { rub, fmtDateTime } from '../../lib/format'
import { CountUp } from '../../components/ui'

/** SVG-график выручки за 30 дней */
function RevenueChart() {
  const w = 600, h = 160, pad = 6
  const max = Math.max(...REVENUE_DAYS)
  const pts = REVENUE_DAYS.map((v, i) => [
    pad + (i / (REVENUE_DAYS.length - 1)) * (w - pad * 2),
    h - pad - (v / max) * (h - pad * 2),
  ])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full">
      <defs>
        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E5BFF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2E5BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#rev)" />
      <path d={line} fill="none" stroke="#2E5BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="#2E5BFF" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

export default function AdminDashboard() {
  const kpis = [
    { icon: TrendingUp, label: 'Выручка · 30 дней', value: KPI.revenue30, suffix: ' ₽', accent: true },
    { icon: Wallet, label: 'Прибыль · 30 дней', value: KPI.profit30, suffix: ' ₽' },
    { icon: ReceiptText, label: 'Заказов', value: KPI.orders30, suffix: '' },
    { icon: Users, label: 'Новых клиентов', value: KPI.users30, suffix: '' },
  ]
  return (
    <div>
      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(k => (
          <div key={k.label} className={`panel p-4 ${k.accent ? 'border-volt/40' : ''}`}>
            <div className="flex items-center gap-2 text-[12px] font-medium text-muted">
              <k.icon className="h-4 w-4 text-volt" /> {k.label}
            </div>
            <div className="num mt-2 font-display text-[24px] font-bold leading-none md:text-[28px]">
              <CountUp value={k.value} duration={1100} />{k.suffix}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr] grid-cols-1">
        {/* график */}
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Выручка по дням</h2>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-ok">
              <Zap className="h-3.5 w-3.5" /> сред. выдача {KPI.deliveryAvgSec.toLocaleString('ru-RU')} с
            </span>
          </div>
          <RevenueChart />
          <div className="mt-1 flex justify-between font-mono text-[10.5px] text-muted">
            <span>−30 дней</span><span>средний чек {rub(KPI.avgCheck)}</span><span>сегодня</span>
          </div>
        </div>

        {/* категории */}
        <div className="panel p-5">
          <h2 className="text-[15px] font-semibold">Доля категорий · маржа</h2>
          <div className="mt-4 space-y-3">
            {CAT_SHARE.map(c => (
              <div key={c.cat}>
                <div className="flex justify-between text-[12.5px]">
                  <span className="font-medium">{c.cat}</span>
                  <span className="num text-muted">{c.pct}% · маржа {c.margin}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper">
                  <div className="grad-volt h-full rounded-full" style={{ width: `${c.pct * 3.3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.6fr] grid-cols-1">
        {/* депозиты */}
        <div className="panel p-5">
          <h2 className="text-[15px] font-semibold">Депозиты у поставщиков</h2>
          <div className="mt-3 space-y-2.5">
            {DEPOSITS.map(d => (
              <div key={d.name} className={`flex items-center gap-3 rounded-xl border p-3 ${d.warn ? 'border-hot/40 bg-hot/5' : 'border-line'}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[13.5px] font-semibold">
                    {d.name}
                    {d.warn && <AlertTriangle className="h-3.5 w-3.5 text-hot" />}
                  </div>
                  <div className="text-[11.5px] text-muted">{d.note}</div>
                </div>
                <div className="text-right">
                  <div className={`num text-[14.5px] font-bold ${d.warn ? 'text-hot' : ''}`}>{d.cur}{d.value}</div>
                  <div className="num text-[11px] text-muted">из {d.cur}{d.start}</div>
                </div>
              </div>
            ))}
            <p className="pt-1 text-[11.5px] leading-snug text-muted">
              Ниже 25% остатка — уведомление в Telegram владельцу: пополнить, чтобы выдача не остановилась.
            </p>
          </div>
        </div>

        {/* последние заказы */}
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-[15px] font-semibold">Последние заказы</h2>
          </div>
          <div className="scroll-x">
            <table className="w-full min-w-[560px] text-[13px]">
              <tbody>
                {ADMIN_ORDERS.slice(0, 8).map(o => (
                  <tr key={o.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-2.5 font-mono text-[11.5px] text-muted">{o.id}</td>
                    <td className="max-w-[190px] truncate px-2 py-2.5 font-medium">{o.item}</td>
                    <td className="px-2 py-2.5 text-muted">{o.user}</td>
                    <td className="num px-2 py-2.5 text-right font-semibold">{rub(o.price)}</td>
                    <td className="num px-2 py-2.5 text-right text-[11.5px] text-ok">+{rub(o.price - o.cost)}</td>
                    <td className="px-5 py-2.5 text-right font-mono text-[10.5px] text-muted">{fmtDateTime(o.ts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
