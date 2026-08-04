import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { FEED_POOL } from '../data/products'
import { CatIcon, CountUp } from './ui'
import type { CategoryId } from '../data/products'

interface Row { key: number; time: string; title: string; icon: string; sec: number }

const timeAt = (msAgo: number) =>
  new Date(Date.now() - msAgo).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const now = () => timeAt(0)

/** Живой терминал выдач: canned-заказы «прилетают» каждые пару секунд */
export default function LiveFeed({ rows = 6, interval = 2400, className = '' }: { rows?: number; interval?: number; className?: string }) {
  const [list, setList] = useState<Row[]>(() =>
    FEED_POOL.slice(0, rows).map((f, i) => ({ key: i, time: timeAt((i + 1) * (interval + 2600)), ...f })),
  )
  const idx = useRef(rows)
  const key = useRef(rows)
  const [todayCount, setTodayCount] = useState(1847)

  useEffect(() => {
    const t = setInterval(() => {
      const f = FEED_POOL[idx.current % FEED_POOL.length]
      idx.current += 1
      key.current += 1
      setList(l => [{ key: key.current, time: now(), ...f }, ...l].slice(0, rows))
      setTodayCount(c => c + 1)
    }, interval)
    return () => clearInterval(t)
  }, [rows, interval])

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-night/95 shadow-lift ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
          Лента выдач · сегодня <span className="text-pulse"><CountUp value={todayCount} duration={500} /></span>
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-ok">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-2 w-2 rounded-full bg-ok" style={{ animation: 'ping-dot 1.6s cubic-bezier(0,0,0.2,1) infinite' }} />
            <span className="h-2 w-2 rounded-full bg-ok" />
          </span>
          online
        </span>
      </div>
      <div className="p-2">
        {list.map((r, i) => (
          <div
            key={r.key}
            className="flex items-center gap-3 rounded-xl px-2.5 py-2"
            style={i === 0 ? { animation: 'feed-in 420ms cubic-bezier(0.2,0,0,1)' } : undefined}
          >
            <span className="font-mono text-[11px] text-white/35">{r.time}</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/8 text-pulse">
              <CatIcon cat={r.icon as CategoryId} className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-white/85">{r.title}</span>
            <span className="flex shrink-0 items-center gap-1 font-mono text-[11.5px] text-ok">
              <Check className="h-3.5 w-3.5" />
              {r.sec < 60 ? `${String(r.sec).replace('.', ',')} с` : `${Math.round(r.sec / 60)} мин`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
