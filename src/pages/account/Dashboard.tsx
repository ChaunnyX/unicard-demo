import { Link } from 'react-router-dom'
import { Wallet, Plus, Globe, ShieldCheck, Zap, CreditCard, ChevronRight, Check } from 'lucide-react'
import { useStore } from '../../lib/store'
import { rub, fmtDateTime, daysLeft, plural } from '../../lib/format'
import { CatIcon, CountUp, CopyBtn, DeliveryBadge } from '../../components/ui'
import { getProduct } from '../../data/products'
import type { CategoryId } from '../../data/products'

const QUICK = [
  { to: '/c/esim', icon: Globe, label: 'eSIM в поездку', sub: 'от 169 ₽' },
  { to: '/c/vpn', icon: ShieldCheck, label: 'Подключить VPN', sub: '299 ₽/мес' },
  { to: '/p/topup-steam', icon: Zap, label: 'Пополнить Steam', sub: 'за минуту' },
  { to: '/c/cards', icon: CreditCard, label: 'Выпустить карту', sub: '~2 минуты' },
]

export default function Dashboard() {
  const { user, balance, orders, subs } = useStore()

  return (
    <div>
      {/* баланс */}
      <div className="grad-volt relative overflow-hidden rounded-3xl p-6 text-white md:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, #fff 1px, transparent 1.4px)', backgroundSize: '24px 24px' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
              <Wallet className="h-3.5 w-3.5" /> единый баланс
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-[44px] font-bold leading-none md:text-[54px]"><CountUp value={balance} /></span>
              <span className="text-[20px] font-semibold text-white/80">₽</span>
            </div>
            <div className="mt-1.5 text-[13px] text-white/65">Хватает на {balance >= 299 ? 'месяц VPN и ещё останется' : balance > 0 ? 'мелкие пополнения' : '… пока ни на что — пополните'}</div>
          </div>
          <div className="flex gap-2.5">
            <Link to="/account/topup" className="btn gap-2 bg-white px-6 py-3 text-[14.5px] font-bold text-volt hover:bg-white/90">
              <Plus className="h-4 w-4" /> Пополнить
            </Link>
            <Link to="/account/orders" className="btn border border-white/30 px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-white/10">
              История
            </Link>
          </div>
        </div>
      </div>

      {/* быстрые действия */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {QUICK.map(q => (
          <Link key={q.to} to={q.to} className="panel panel-hover flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-volt-tint text-volt">
              <q.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-semibold">{q.label}</span>
              <span className="block text-[12px] text-muted">{q.sub}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* подписки */}
      {subs.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[20px] font-semibold">Активные подписки</h2>
            <Link to="/account/subs" className="flex items-center gap-1 text-[13.5px] font-medium text-volt">Все <ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 grid-cols-1">
            {subs.slice(0, 2).map(s => {
              const dl = daysLeft(s.expiresTs)
              const total = Math.max(1, Math.round((s.expiresTs - s.startedTs) / 86400000))
              const pct = Math.min(100, Math.max(3, (dl / total) * 100))
              return (
                <Link key={s.id} to="/account/subs" className="panel panel-hover block p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                      <ShieldCheck className="h-4.5 w-4.5 text-volt" /> {s.title}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${dl <= 5 ? 'bg-hot/10 text-hot' : 'bg-ok-tint text-ok'}`}>
                      {dl} {plural(dl, 'день', 'дня', 'дней')}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div className={`h-full rounded-full ${dl <= 5 ? 'bg-hot' : 'grad-volt'}`} style={{ width: `${pct}%`, transition: 'width 1s ease-out' }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[12px] text-muted">
                    <span>{s.plan}{s.devices ? ` · ${s.devices} устройств` : ''}</span>
                    <span className="font-mono">до {new Date(s.expiresTs).toLocaleDateString('ru-RU')}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* последние заказы */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-[20px] font-semibold">Последние заказы</h2>
          <Link to="/account/orders" className="flex items-center gap-1 text-[13.5px] font-medium text-volt">Все <ChevronRight className="h-4 w-4" /></Link>
        </div>
        {orders.length === 0 ? (
          <div className="panel p-8 text-center">
            <p className="text-[14px] text-muted">Заказов пока нет. Первый придёт за секунды — проверьте сами.</p>
            <Link to="/" className="btn-primary mt-4 inline-flex px-6 py-2.5 text-[14px]">В каталог</Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {orders.slice(0, 3).map(o => {
              const p = getProduct(o.productId)
              return (
                <div key={o.id} className="panel flex flex-wrap items-center gap-3 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-volt-tint text-volt">
                    <CatIcon cat={o.cat as CategoryId} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[14px] font-semibold">{o.title} · {o.variantLabel}</span>
                      {o.deliverMs && (
                        <span className="flex items-center gap-1 font-mono text-[10.5px] text-ok">
                          <Check className="h-3 w-3" /> за {(o.deliverMs / 1000).toFixed(1).replace('.', ',')} с
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 font-mono text-[11.5px] text-muted">{o.id} · {fmtDateTime(o.ts)}</div>
                  </div>
                  {p && <DeliveryBadge sec={p.deliverySec} className="max-sm:hidden" />}
                  <span className="num text-[14.5px] font-bold">{rub(o.price)}</span>
                  <CopyBtn text={o.code} />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {user?.username} · уведомления о выдаче приходят в telegram
      </p>
    </div>
  )
}
