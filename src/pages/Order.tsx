import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Wallet, Truck, PackageCheck, Check, Zap, ArrowRight, QrCode } from 'lucide-react'
import { useStore } from '../lib/store'
import { getProduct } from '../data/products'
import { fmtDateTime } from '../lib/format'
import { CopyBtn, Qr } from '../components/ui'

/** Печатающийся код выдачи */
function TypeCode({ text, onDone, speed = 34 }: { text: string; onDone?: () => void; speed?: number }) {
  const [n, setN] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (n >= text.length) {
      if (!done.current) { done.current = true; onDone?.() }
      return
    }
    const t = setTimeout(() => setN(n + 1), speed)
    return () => clearTimeout(t)
  }, [n, text, speed, onDone])
  return (
    <span className="font-mono">
      {text.slice(0, n)}
      {n < text.length && <span className="inline-block w-[0.6ch] text-pulse" style={{ animation: 'blink 0.7s step-end infinite' }}>▌</span>}
    </span>
  )
}

type Stage = 0 | 1 | 2 | 3 // 0=оплата 1=закупка 2=печать кода 3=готово

const STAGES = [
  { icon: Wallet, label: 'Оплата с баланса' },
  { icon: Truck, label: 'Закупка у поставщика' },
  { icon: PackageCheck, label: 'Выдача' },
]

export default function OrderPage() {
  const { id } = useParams()
  const { orders, markDelivered } = useStore()
  const order = orders.find(o => o.id === id)
  const product = order ? getProduct(order.productId) : undefined

  const wasProcessing = useRef<boolean | null>(null)
  if (wasProcessing.current === null && order) wasProcessing.current = order.status === 'processing'

  const [stage, setStage] = useState<Stage>(wasProcessing.current ? 0 : 3)
  const t0 = useRef(performance.now())
  const [elapsed, setElapsed] = useState<number | null>(wasProcessing.current ? null : order?.deliverMs ?? null)

  // хореография пайплайна
  useEffect(() => {
    if (!wasProcessing.current || !order) return
    const t1 = setTimeout(() => setStage(1), 800)
    const t2 = setTimeout(() => setStage(2), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finish = () => {
    if (!order || stage === 3) return
    const ms = Math.round(performance.now() - t0.current)
    setElapsed(ms)
    setStage(3)
    markDelivered(order.id, ms)
  }

  const secShown = useMemo(() => {
    const ms = elapsed ?? order?.deliverMs ?? 1800
    return (ms / 1000).toFixed(1).replace('.', ',')
  }, [elapsed, order])

  if (!order || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
        <h1 className="font-display text-[26px] font-bold">Заказ не найден</h1>
        <Link to="/account/orders" className="btn-primary mt-6 inline-flex px-6 py-3">Мои заказы</Link>
      </div>
    )
  }

  const isEsim = order.cat === 'esim'
  const isVpn = order.cat === 'vpn'
  const isProxy = order.cat === 'proxy'
  const isCard = order.cat === 'cards'
  const showQr = isEsim || isVpn

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="text-center">
        <div className="eyebrow">заказ {order.id} · {fmtDateTime(order.ts)}</div>
        <h1 className="mt-2 font-display text-[28px] font-bold md:text-[34px]">
          {stage === 3 ? 'Готово — товар у вас' : 'Выдаём заказ…'}
        </h1>
      </div>

      {/* пайплайн */}
      <div className="panel relative mt-8 overflow-hidden p-6 md:p-8">
        <div className="relative flex items-start justify-between">
          {/* линия */}
          <div className="absolute left-[10%] right-[10%] top-[22px] h-0.5 bg-line" />
          <div
            className="absolute left-[10%] top-[22px] h-0.5 grad-volt transition-[width] duration-700 ease-out"
            style={{ width: stage === 0 ? '0%' : stage === 1 ? '40%' : '80%' }}
          />
          {/* летящий пакет */}
          {stage >= 1 && stage < 3 && (
            <span
              className="absolute top-[13px] z-10 flex h-5 w-5 items-center justify-center rounded-full bg-pulse shadow-volt transition-[left] duration-700 ease-out"
              style={{ left: stage === 1 ? 'calc(50% - 10px)' : 'calc(90% - 10px)' }}
            >
              <Zap className="h-3 w-3 text-white" fill="currentColor" strokeWidth={0} />
            </span>
          )}
          {STAGES.map((s, i) => {
            const active = stage >= i
            const done = stage > i || stage === 3
            return (
              <div key={s.label} className="relative z-10 flex w-1/3 flex-col items-center text-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done ? 'grad-volt border-transparent text-white shadow-volt' : active ? 'border-volt bg-surface text-volt' : 'border-line bg-surface text-muted'
                }`}>
                  {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </span>
                <span className={`mt-2.5 text-[12.5px] font-semibold ${active ? 'text-ink' : 'text-muted'}`}>{s.label}</span>
                <span className="mt-0.5 font-mono text-[10.5px] text-muted">
                  {i === 0 && stage >= 1 && '0,3 с'}
                  {i === 1 && stage >= 2 && '1,1 с'}
                  {i === 2 && stage === 3 && `${secShown} с`}
                </span>
              </div>
            )
          })}
        </div>

        {/* зона кода */}
        <div className="relative mt-8 rounded-2xl bg-night p-6 text-white">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
              {isEsim ? 'ваш esim-профиль' : isVpn ? 'ваша подписка' : isProxy ? 'ваши доступы' : isCard ? 'ваша карта' : 'ваш код'}
            </span>
            {stage === 3 && <CopyBtn text={order.code} className="!border-white/20 !bg-white/10 !text-white/80 hover:!text-white" />}
          </div>

          <div className="mt-3 min-h-[56px] break-all rounded-xl bg-black/30 p-4 text-[16px] leading-relaxed md:text-[19px]">
            {stage < 2 && (
              <span className="font-mono text-white/35">
                {stage === 0 ? '· · · списываем с баланса' : '· · · запрашиваем у поставщика'}
                <span className="inline-block w-[0.6ch]" style={{ animation: 'blink 0.7s step-end infinite' }}>▌</span>
              </span>
            )}
            {stage === 2 && <TypeCode text={order.code} onDone={finish} />}
            {stage === 3 && <span className="font-mono text-pulse">{order.code}</span>}
          </div>

          {/* штамп */}
          {stage === 3 && (
            <div
              className="pointer-events-none absolute -right-2 -top-4 rotate-[-8deg] rounded-lg border-2 border-ok px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-ok md:right-6"
              style={{ animation: 'stamp-in 500ms cubic-bezier(0.2,0,0,1) both', background: 'rgba(15,184,113,0.12)', backdropFilter: 'blur(2px)' }}
            >
              выдано за {secShown} с
            </div>
          )}
        </div>

        {/* пост-выдача */}
        {stage === 3 && (
          <div style={{ animation: 'rise 400ms cubic-bezier(0.2,0,0,1) both', animationDelay: '150ms' }}>
            <div className="mt-6 grid items-center gap-6 md:grid-cols-[auto_1fr] grid-cols-1">
              {showQr && (
                <div className="justify-self-center">
                  <Qr seed={order.code} size={150} className="border border-line" />
                  <div className="mt-1.5 text-center font-mono text-[10.5px] uppercase tracking-wide text-muted">
                    {isEsim ? 'сканируйте в настройках sim' : 'сканируйте в приложении'}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[16px] font-semibold">{order.title} · {order.variantLabel}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  {isEsim && 'Настройки → Сотовая связь → Добавить eSIM → Сканировать QR. В поездке включите этот профиль и роуминг данных.'}
                  {isVpn && 'Установите приложение (Happ, v2rayTun или Hiddify), отсканируйте QR — и всё работает. Подробная инструкция на странице подписки.'}
                  {isProxy && 'Доступы формата host:port:login:password. Панель управления и смена IP — в кабинете.'}
                  {isCard && 'Полные реквизиты карты — в кабинете, в разделе «Мои карты». Добавьте карту в Apple Pay или Google Pay.'}
                  {!isEsim && !isVpn && !isProxy && !isCard && 'Код также отправлен на почту и в Telegram. Он навсегда сохранён в истории заказов.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {isVpn ? (
                    <Link to="/account/subs" className="btn-primary px-5 py-2.5 text-[14px]">
                      К подключению <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : isCard ? (
                    <Link to="/account/cards" className="btn-primary px-5 py-2.5 text-[14px]">
                      <QrCode className="h-4 w-4" /> Мои карты
                    </Link>
                  ) : (
                    <Link to="/account/orders" className="btn-primary px-5 py-2.5 text-[14px]">
                      Мои заказы <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link to="/" className="btn-ghost px-5 py-2.5 text-[14px]">Продолжить покупки</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {stage === 3 && (
        <p className="mt-5 text-center text-[13px] text-muted" style={{ animation: 'rise 400ms both', animationDelay: '350ms' }}>
          Понравилась скорость? Оставьте отзыв — плюс 50 ₽ на баланс.
        </p>
      )}
    </div>
  )
}
