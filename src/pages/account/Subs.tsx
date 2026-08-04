import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Network, QrCode, ChevronDown, Zap } from 'lucide-react'
import { useStore } from '../../lib/store'
import { PRODUCTS } from '../../data/products'
import { daysLeft, plural, rub } from '../../lib/format'
import { CopyBtn, Qr } from '../../components/ui'

export default function Subs() {
  const { subs, renewSub, balance } = useStore()
  const [renewOpen, setRenewOpen] = useState<string | null>(null)
  const nav = useNavigate()

  const renewOptions = (title: string): { months: number; label: string; price: number }[] => {
    const p = PRODUCTS.find(x => x.title === title)
    if (p?.cat === 'vpn') {
      return p.variants.map(v => ({
        months: v.id === '12m' ? 12 : v.id === '6m' ? 6 : 1,
        label: v.label, price: v.price,
      }))
    }
    if (p?.cat === 'proxy') {
      return p.variants.filter(v => v.id === '1m' || v.id === '1w').map(v => ({
        months: v.id === '1m' ? 1 : 0.25, label: v.label, price: v.price,
      }))
    }
    return [{ months: 1, label: '1 месяц', price: 299 }]
  }

  if (subs.length === 0) {
    return (
      <div>
        <h1 className="font-display text-[26px] font-bold">Подписки</h1>
        <div className="panel mt-5 p-10 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-volt" />
          <p className="mt-3 text-[14.5px] text-muted">
            Здесь живут VPN и прокси: сроки, QR-коды, продление в один клик.
          </p>
          <Link to="/c/vpn" className="btn-primary mt-5 inline-flex px-6 py-3 text-[14px]">Подключить VPN за 299 ₽</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-[26px] font-bold">Подписки</h1>
      <div className="mt-5 space-y-4">
        {subs.map(s => {
          const dl = daysLeft(s.expiresTs)
          const total = Math.max(1, Math.round((s.expiresTs - s.startedTs) / 86400000))
          const pct = Math.min(100, Math.max(3, (dl / total) * 100))
          const opts = renewOptions(s.title)
          return (
            <div key={s.id} className="panel overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 p-5 md:p-6">
                <Qr seed={s.key} size={92} className="border border-line max-sm:hidden" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[16px] font-semibold">
                    {s.type === 'vpn' ? <ShieldCheck className="h-5 w-5 text-volt" /> : <Network className="h-5 w-5 text-volt" />}
                    {s.title}
                  </div>
                  <div className="mt-1 text-[13px] text-muted">
                    {s.plan}{s.devices ? ` · до ${s.devices} устройств` : ''} · до {new Date(s.expiresTs).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper">
                      <div className={`h-full rounded-full ${dl <= 5 ? 'bg-hot' : 'grad-volt'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`shrink-0 text-[12.5px] font-bold ${dl <= 5 ? 'text-hot' : 'text-ok'}`}>
                      {dl} {plural(dl, 'день', 'дня', 'дней')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {s.type === 'vpn' && (
                    <button onClick={() => nav(`/account/vpn/${s.id}`)} className="btn-primary px-5 py-2.5 text-[13.5px]">
                      <QrCode className="h-4 w-4" /> Подключение
                    </button>
                  )}
                  <button onClick={() => setRenewOpen(renewOpen === s.id ? null : s.id)} className="btn-ghost px-5 py-2.5 text-[13.5px]">
                    Продлить <ChevronDown className={`h-4 w-4 transition-transform ${renewOpen === s.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {renewOpen === s.id && (
                <div className="border-t border-line bg-paper/60 p-5" style={{ animation: 'feed-in 200ms ease-out' }}>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {opts.map(o => (
                      <button key={o.label}
                        onClick={() => { if (renewSub(s.id, o.months, o.price)) setRenewOpen(null); else nav(`/account/topup?need=${o.price}&back=/account/subs`) }}
                        className="num cursor-pointer rounded-xl border border-line bg-surface px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:border-volt hover:text-volt">
                        {o.label} · {rub(o.price)}
                      </button>
                    ))}
                    <span className="ml-auto flex items-center gap-1.5 text-[12.5px] text-muted">
                      <Zap className="h-3.5 w-3.5 text-ok" /> продлевается мгновенно · на балансе {rub(balance)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3.5">
                <code className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-muted">{s.key}</code>
                <CopyBtn text={s.key} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
