import { useEffect, useRef, useState } from 'react'
import { Check, Wallet, Zap } from 'lucide-react'
import { CatIcon, CountUp, Qr } from './ui'
import type { CategoryId } from '../data/products'

/** Автодемо покупки в hero: товар → клик → списание → код печатается → штамп. Цикл. */

interface DemoItem {
  cat: CategoryId
  title: string
  sub: string
  price: number
  code: string
  qr?: boolean
  sec: string
}

const ITEMS: DemoItem[] = [
  { cat: 'gift', title: 'Steam Gift Card', sub: 'Россия · 1 000 ₽', price: 1090, code: '7XK4F-9B2ND-QW8RT', sec: '1,8' },
  { cat: 'esim', title: 'eSIM Турция', sub: '5 ГБ · 30 дней', price: 1090, code: 'LPA:1$rsp.unicard.app$TR-8F2K1', qr: true, sec: '3,2' },
  { cat: 'vpn', title: 'Unicard VPN', sub: 'Базовый · 1 месяц', price: 299, code: 'vless://a3f9c2e1@ru1.unicard.app:443#Unicard', qr: true, sec: '0,9' },
]

type Phase = 'idle' | 'paying' | 'pipeline' | 'typing' | 'done'

function Type({ text, onDone }: { text: string; onDone: () => void }) {
  const [n, setN] = useState(0)
  const fired = useRef(false)
  useEffect(() => {
    if (n >= text.length) {
      if (!fired.current) { fired.current = true; onDone() }
      return
    }
    const t = setTimeout(() => setN(n + 1), 28)
    return () => clearTimeout(t)
  }, [n, text, onDone])
  return (
    <span className="font-mono">
      {text.slice(0, n)}
      {n < text.length && <span className="inline-block w-[0.6ch] text-pulse" style={{ animation: 'blink 0.7s step-end infinite' }}>▌</span>}
    </span>
  )
}

const STEPS = ['Оплата с баланса', 'Обработка заказа', 'Выдача']

export default function HeroDemo() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [balance, setBalance] = useState(2500)
  const [issued, setIssued] = useState(1847)
  const item = ITEMS[idx % ITEMS.length]

  // хореография цикла
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === 'idle') t = setTimeout(() => setPhase('paying'), 1600)
    if (phase === 'paying') t = setTimeout(() => {
      setBalance(b => b - item.price)
      setPhase('pipeline')
    }, 700)
    if (phase === 'pipeline') t = setTimeout(() => setPhase('typing'), 1300)
    if (phase === 'done') t = setTimeout(() => {
      setIssued(n => n + 1)
      setBalance(b => (b < 1200 ? 2500 : b)) // «пополнился» между циклами
      setIdx(i => i + 1)
      setPhase('idle')
    }, 2600)
    return () => clearTimeout(t)
  }, [phase, item.price])

  const stepState = (i: number) => {
    if (phase === 'idle' || phase === 'paying') return i === 0 && phase === 'paying' ? 'active' : 'wait'
    if (phase === 'pipeline') return i === 0 ? 'done' : i === 1 ? 'active' : 'wait'
    return 'done' // typing / done
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-night/95 shadow-lift">
      {/* шапка терминала */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-2 w-2 rounded-full bg-ok" style={{ animation: 'ping-dot 1.6s cubic-bezier(0,0,0.2,1) infinite' }} />
            <span className="h-2 w-2 rounded-full bg-ok" />
          </span>
          покупка вживую
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[12px] text-white/70">
          <Wallet className="h-3.5 w-3.5 text-pulse" />
          <span className="num font-bold text-white"><CountUp value={balance} duration={600} /> ₽</span>
        </span>
      </div>

      <div className="p-4 md:p-5">
        {/* товар + кнопка */}
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-pulse">
            <CatIcon cat={item.cat} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14.5px] font-semibold text-white">{item.title}</div>
            <div className="truncate text-[12px] text-white/50">{item.sub}</div>
          </div>
          <span
            className={`btn px-4 py-2 text-[13px] font-semibold text-white transition-transform ${
              phase === 'paying' ? 'scale-90' : ''
            }`}
            style={{ backgroundImage: 'linear-gradient(120deg,#2e5bff,#0090ff)', boxShadow: '0 4px 14px rgba(46,91,255,.45)' }}
          >
            {phase === 'idle' || phase === 'paying' ? <>Купить · <span className="num">{item.price.toLocaleString('ru-RU')} ₽</span></> : <><Check className="h-4 w-4" /> Оплачено</>}
          </span>
        </div>

        {/* пайплайн */}
        <div className="mt-4 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const st = stepState(i)
            return (
              <div key={s} className="flex min-w-0 flex-1 items-center gap-2">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300 ${
                  st === 'done' ? 'bg-ok text-white' : st === 'active' ? 'bg-pulse text-night' : 'bg-white/10 text-white/40'
                }`}>
                  {st === 'done' ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={`truncate text-[11px] transition-colors ${st === 'wait' ? 'text-white/35' : 'text-white/80'}`}>{s}</span>
                {i < 2 && <span className={`h-px flex-1 ${st === 'done' ? 'bg-ok/60' : 'bg-white/10'}`} />}
              </div>
            )
          })}
        </div>

        {/* зона выдачи */}
        <div className="relative mt-4 min-h-[108px] rounded-xl bg-black/35 p-3.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            {item.qr ? 'qr и конфиг' : 'ваш код'}
          </div>
          <div className="mt-2 flex items-center gap-3.5">
            {item.qr && (phase === 'typing' || phase === 'done') && (
              <Qr seed={item.code} size={68} className="shrink-0" />
            )}
            <div className="min-w-0 break-all text-[14px] leading-snug text-pulse md:text-[15px]">
              {(phase === 'idle' || phase === 'paying') && (
                <span className="font-mono text-white/30">— · — · —</span>
              )}
              {phase === 'pipeline' && (
                <span className="font-mono text-white/35">
                  формируем выдачу<span className="inline-block w-[0.6ch]" style={{ animation: 'blink 0.7s step-end infinite' }}>▌</span>
                </span>
              )}
              {phase === 'typing' && <Type text={item.code} onDone={() => setPhase('done')} />}
              {phase === 'done' && <span className="font-mono">{item.code}</span>}
            </div>
          </div>
          {phase === 'done' && (
            <div
              className="absolute -right-1.5 -top-3 rotate-[-8deg] rounded-md border-2 border-ok px-2 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-ok"
              style={{ animation: 'stamp-in 450ms cubic-bezier(0.2,0,0,1) both', background: 'rgba(15,184,113,0.14)', backdropFilter: 'blur(2px)' }}
            >
              выдано за {item.sec} с
            </div>
          )}
        </div>
      </div>

      {/* подвал: счётчик */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/45">
        <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-ok" /> сегодня выдано</span>
        <span className="num text-[12px] font-bold text-white/80"><CountUp value={issued} duration={500} /> заказов</span>
      </div>
    </div>
  )
}
