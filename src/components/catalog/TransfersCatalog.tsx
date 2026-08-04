import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Clock3, ShieldCheck, ArrowDown } from 'lucide-react'
import { TRANSFER_COUNTRIES } from '../../data/products'
import { fmt, rub } from '../../lib/format'
import { useStore } from '../../lib/store'
import { Crumbs, Reveal } from '../ui'
import WowMap, { hasPin } from '../WowMap'
import { asset } from '../../lib/asset'

/** Переводы: калькулятор с живым курсом + карта маршрута + заявка оператору */
export default function TransfersCatalog() {
  const [countryIdx, setCountryIdx] = useState(0)
  const [amount, setAmount] = useState(10000)
  const { user, setAuthOpen, createTransfer, toast } = useStore()
  const nav = useNavigate()

  const c = TRANSFER_COUNTRIES[countryIdx]
  const fee = Math.round(amount * c.fee / 100)
  const out = useMemo(() => (amount - fee) / c.rate, [amount, fee, c])

  const submit = () => {
    if (!user) { setAuthOpen(true); return }
    if (amount < 1000) { toast('Минимальная сумма перевода — 1 000 ₽', 'info'); return }
    createTransfer(c.name, amount, out, c.cur)
    toast('Заявка создана — оператор напишет в Telegram')
    nav('/account/transfers')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Crumbs items={[{ label: 'Переводы за рубеж' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold tracking-tight md:text-[40px]">Переводы в 60+ стран</h1>
          <p className="mt-2 max-w-xl text-[15px] text-muted">
            Комиссия от 1,5%, курс фиксируется в момент заявки. Обрабатывает оператор — обычно за 15 минут, максимум 2 часа.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-[13px] text-muted">
          <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-volt" /> 15 мин — 2 ч</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-volt" /> курс фиксируется сразу</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr] grid-cols-1">
        {/* калькулятор */}
        <Reveal>
          <div className="panel p-6">
            <div className="eyebrow mb-2">Куда переводим</div>
            <div className="relative">
              <img src={asset(`/img/flags/${c.code}.svg`)} alt="" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-7 -translate-y-1/2 rounded-sm object-cover" />
              <select
                value={countryIdx}
                onChange={e => setCountryIdx(+e.target.value)}
                className="input cursor-pointer appearance-none pl-13"
                style={{ paddingLeft: '3.25rem' }}
              >
                {TRANSFER_COUNTRIES.map((cc, i) => (
                  <option key={cc.code} value={i}>{cc.name} · {cc.cur}</option>
                ))}
              </select>
            </div>

            <div className="eyebrow mb-2 mt-5">Отправляете</div>
            <div className="relative">
              <input
                type="number" min={1000} step={500} value={amount}
                onChange={e => setAmount(Math.max(0, +e.target.value))}
                className="input num pr-10 text-[17px] font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-muted">₽</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[5000, 10000, 25000, 50000].map(a => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`num cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                    amount === a ? 'border-volt bg-volt-tint text-volt' : 'border-line text-muted hover:border-volt/40'
                  }`}>
                  {fmt(a)} ₽
                </button>
              ))}
            </div>

            <div className="my-4 flex items-center gap-3 text-muted">
              <div className="h-px flex-1 bg-line" />
              <ArrowDown className="h-4 w-4" />
              <div className="h-px flex-1 bg-line" />
            </div>

            <div className="eyebrow mb-2">Получат</div>
            <div className="rounded-xl bg-paper px-4 py-3.5">
              <span className="num font-display text-[26px] font-bold">
                {out.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
              </span>
              <span className="ml-2 font-semibold text-muted">{c.cur}</span>
            </div>
            <div className="mt-3 space-y-1.5 font-mono text-[12px] text-muted">
              <div className="flex justify-between"><span>Курс</span><span className="num">1 {c.cur} = {c.rate.toLocaleString('ru-RU')} ₽</span></div>
              <div className="flex justify-between"><span>Комиссия {c.fee}%</span><span className="num">{rub(fee)}</span></div>
              <div className="flex justify-between text-ink"><span>Итого со счёта</span><span className="num font-bold">{rub(amount)}</span></div>
            </div>

            <button onClick={submit} className="btn-primary mt-5 w-full py-3.5 text-[15px]">
              <Send className="h-4 w-4" /> Оставить заявку
            </button>
            <p className="mt-3 text-center text-[12px] leading-relaxed text-muted">
              Оператор свяжется в Telegram, уточнит реквизиты получателя и проведёт перевод.
            </p>
          </div>
        </Reveal>

        {/* карта */}
        <Reveal delay={100}>
          <div className="panel flex h-full flex-col justify-center overflow-hidden p-6">
            <WowMap
              mapPins={[
                { key: 'moscow', color: '#0e1220', big: true },
                ...(hasPin(c.code) ? [{ key: c.code, color: '#2E5BFF', big: true }] : []),
              ]}
              arcs={hasPin(c.code) ? [{ from: 'moscow', to: c.code }] : []}
            />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {TRANSFER_COUNTRIES.slice(0, 10).map((cc, i) => (
                <button key={cc.code} onClick={() => setCountryIdx(i)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                    i === countryIdx ? 'border-volt bg-volt-tint text-volt' : 'border-line text-muted hover:border-volt/40'
                  }`}>
                  <img src={asset(`/img/flags/${cc.code}.svg`)} alt="" className="h-3 w-4.5 rounded-[2px] object-cover" />
                  {cc.name}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* как проходит */}
      <div className="mt-10 grid gap-4 md:grid-cols-4 grid-cols-1">
        {[
          { n: '01', t: 'Заявка с курсом', d: 'Курс и комиссия фиксируются в момент отправки заявки.' },
          { n: '02', t: 'Оператор в Telegram', d: 'Уточняет реквизиты получателя: карта, счёт или наличные.' },
          { n: '03', t: 'Перевод', d: 'Деньги уходят по крипто-рельсам — быстрее и дешевле SWIFT.' },
          { n: '04', t: 'Подтверждение', d: 'Чек и статус — в кабинете. Обычно всё занимает 15 минут.' },
        ].map((s, i) => (
          <Reveal key={s.n} delay={i * 60}>
            <div className="panel h-full p-5">
              <div className="font-mono text-[13px] font-bold text-volt">{s.n}</div>
              <div className="mt-2 text-[15px] font-semibold">{s.t}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
