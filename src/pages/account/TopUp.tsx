import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CreditCard, Landmark, Bitcoin, Wallet, Check, Zap, ArrowRight } from 'lucide-react'
import { useStore } from '../../lib/store'
import { fmt, rub } from '../../lib/format'
import { CountUp } from '../../components/ui'

const METHODS = [
  { id: 'card', icon: CreditCard, label: 'Карта РФ', sub: 'МИР, Visa, MC · мгновенно' },
  { id: 'sbp', icon: Landmark, label: 'СБП', sub: 'по QR из банка · мгновенно' },
  { id: 'crypto', icon: Bitcoin, label: 'Криптовалюта', sub: 'USDT TRC-20 · ~2 мин' },
]

const AMOUNTS = [300, 500, 1000, 2000, 5000]

export default function TopUp() {
  const { balance, topUp, toast } = useStore()
  const [params] = useSearchParams()
  const need = Number(params.get('need') ?? 0)
  const back = params.get('back')
  const lacking = need > balance ? need - balance : 0
  const suggested = lacking > 0 ? Math.ceil(lacking / 50) * 50 : 0

  const [amount, setAmount] = useState<number>(suggested >= 300 ? suggested : 500)
  const [method, setMethod] = useState('card')
  const [phase, setPhase] = useState<'form' | 'processing' | 'done'>('form')
  const [added, setAdded] = useState(0)

  const valid = amount >= 300

  const pay = () => {
    if (!valid) { toast('Минимальное пополнение — 300 ₽', 'info'); return }
    setPhase('processing')
    setTimeout(() => {
      topUp(amount)
      setAdded(amount)
      setPhase('done')
    }, 1400)
  }

  const methodMeta = useMemo(() => METHODS.find(m => m.id === method)!, [method])

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-[26px] font-bold">Пополнение баланса</h1>
      <p className="mt-1.5 text-[14px] text-muted">
        Сейчас на балансе <b className="num text-ink"><CountUp value={balance} /> ₽</b>. Минимум — 300 ₽: ниже невыгодно из-за комиссий платёжных систем.
      </p>

      {lacking > 0 && phase === 'form' && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-volt/30 bg-volt-tint p-4 text-[13.5px]">
          <Zap className="h-5 w-5 shrink-0 text-volt" />
          <span>Для покупки не хватает <b className="num">{rub(lacking)}</b> — мы подставили сумму с запасом, после оплаты вернётесь к заказу.</span>
        </div>
      )}

      {phase !== 'done' ? (
        <div className="panel mt-5 p-6">
          <div className="eyebrow mb-2.5">Сумма</div>
          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(a)}
                className={`num cursor-pointer rounded-xl border px-4 py-2.5 text-[14px] font-semibold transition-colors ${
                  amount === a ? 'border-volt bg-volt text-white shadow-volt' : 'border-line hover:border-volt/40'
                }`}>
                {fmt(a)} ₽
              </button>
            ))}
          </div>
          <div className="relative mt-3">
            <input type="number" min={300} step={100} value={amount || ''}
              onChange={e => setAmount(Math.max(0, +e.target.value))}
              className="input num pr-10 text-[16px] font-semibold" placeholder="Своя сумма" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-muted">₽</span>
          </div>
          {!valid && amount > 0 && <p className="mt-1.5 text-[12.5px] text-hot">Минимум 300 ₽</p>}

          <div className="eyebrow mb-2.5 mt-6">Способ оплаты</div>
          <div className="grid gap-2 sm:grid-cols-3 grid-cols-1">
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-colors ${
                  method === m.id ? 'border-volt bg-volt-tint' : 'border-line hover:border-volt/40'
                }`}>
                <m.icon className={`h-5 w-5 ${method === m.id ? 'text-volt' : 'text-muted'}`} />
                <span className="text-[13.5px] font-semibold">{m.label}</span>
                <span className="text-[11.5px] leading-snug text-muted">{m.sub}</span>
              </button>
            ))}
          </div>

          <button onClick={pay} disabled={phase === 'processing'}
            className="btn-primary mt-6 w-full py-4 text-[15.5px] disabled:opacity-70">
            {phase === 'processing'
              ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Ждём подтверждение банка…</span>
              : <><Wallet className="h-5 w-5" /> Пополнить на {valid ? rub(amount) : '…'}</>}
          </button>
          <p className="mt-3 text-center text-[12px] text-muted">
            {methodMeta.id === 'crypto' ? 'Курс фиксируется на 15 минут, зачисление после 1 подтверждения сети.' : 'Демо: оплата имитируется, деньги никуда не уходят.'}
          </p>
        </div>
      ) : (
        <div className="panel mt-5 p-8 text-center" style={{ animation: 'rise 350ms cubic-bezier(0.2,0,0,1)' }}>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ok-tint">
            <Check className="h-7 w-7 text-ok" />
          </span>
          <h2 className="mt-4 font-display text-[24px] font-bold">
            +<CountUp value={added} /> ₽ на балансе
          </h2>
          <p className="mt-1.5 text-[14px] text-muted">
            Теперь на счету <b className="num text-ink">{rub(balance)}</b> — тратится на любые товары без ввода карты.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {back ? (
              <Link to={back} className="btn-primary px-6 py-3 text-[14.5px]">
                Вернуться к покупке <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to="/" className="btn-primary px-6 py-3 text-[14.5px]">В каталог <ArrowRight className="h-4 w-4" /></Link>
            )}
            <button onClick={() => { setPhase('form') }} className="btn-ghost px-6 py-3 text-[14.5px]">Пополнить ещё</button>
          </div>
        </div>
      )}
    </div>
  )
}
