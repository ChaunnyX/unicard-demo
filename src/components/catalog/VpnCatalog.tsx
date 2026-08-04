import { useState } from 'react'
import { Gauge, ShieldCheck, Smartphone, MonitorSmartphone, Tv, RefreshCcw, Check, Zap } from 'lucide-react'
import { productsByCat } from '../../data/products'
import { rub } from '../../lib/format'
import { useBuy } from '../../lib/useBuy'
import { CountUp, Crumbs, Reveal } from '../ui'
import WowMap from '../WowMap'

/** VPN: тёмный каталог-лендинг со своей инфраструктурой как главным аргументом */
export default function VpnCatalog() {
  const plans = productsByCat('vpn')
  const [period, setPeriod] = useState(1) // индекс варианта: 0=1м 1=6м 2=12м
  const buyNow = useBuy()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Crumbs items={[{ label: 'Unicard VPN' }]} />

      {/* тёмный hero с маршрутом трафика */}
      <Reveal>
        <div className="grad-night relative overflow-hidden rounded-3xl text-white">
          <div className="grid items-center gap-8 p-7 md:grid-cols-2 md:p-12 grid-cols-1">
            <div>
              <div className="eyebrow mb-3 flex items-center gap-2 !text-pulse">
                <ShieldCheck className="h-4 w-4" /> свои серверы · не реселлинг
              </div>
              <h1 className="font-display text-[32px] font-bold leading-tight md:text-[44px]">
                Работает даже при «белых списках»
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Вход через российский сервер, который проходит фильтры мобильных операторов,
                выход — в Европе. Четыре способа подключения дублируют друг друга: если один перестанет проходить, приложение переключится само.
              </p>
              <div className="mt-6 grid max-w-md grid-cols-3 gap-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-[30px] font-bold num">до <CountUp value={1} duration={800} /></span>
                    <span className="text-[12px] text-white/50">Гбит/с</span>
                  </div>
                  <div className="text-[11.5px] leading-snug text-white/45">порт каждого сервера — хватает на десятки 4K-стримов</div>
                </div>
                <div>
                  <div className="font-display text-[30px] font-bold num">99,9%</div>
                  <div className="text-[11.5px] leading-snug text-white/45">аптайм: адреса меняются автоматически</div>
                </div>
                <div>
                  <div className="font-display text-[30px] font-bold num">4</div>
                  <div className="text-[11.5px] leading-snug text-white/45">способа подключения в одной подписке</div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-white/70">
                <RefreshCcw className="h-4 w-4 shrink-0 text-pulse" />
                Какие именно технологии внутри — не публикуем: чем меньше о них знают фильтры, тем дольше всё работает.
              </div>
            </div>
            <div>
              <WowMap
                dark
                mapPins={[
                  { key: 'moscow', color: '#00C6FF', big: true, label: 'ВХОД' },
                  { key: 'amsterdam', color: '#0FB871', big: true, label: 'ВЫХОД' },
                  { key: 'frankfurt', color: '#0FB871' },
                  { key: 'tr', color: '#0FB871' },
                ]}
                arcs={[
                  { from: 'moscow', to: 'amsterdam', color: '#00C6FF' },
                  { from: 'moscow', to: 'frankfurt', color: '#00C6FF' },
                  { from: 'moscow', to: 'tr', color: '#00C6FF' },
                ]}
              />
              <p className="mt-2 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                двухзвенная схема: РФ-вход → европейский выход
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* тарифы */}
      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[26px] font-semibold">Тарифы</h2>
          <div className="flex rounded-full border border-line bg-surface p-1">
            {['1 месяц', '6 месяцев', '12 месяцев'].map((l, i) => (
              <button key={l} onClick={() => setPeriod(i)}
                className={`cursor-pointer rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                  period === i ? 'grad-volt text-white shadow-volt' : 'text-muted hover:text-ink'
                }`}>
                {l}{i === 2 && <span className="ml-1.5 rounded-full bg-ok/15 px-1.5 py-0.5 text-[10px] font-bold text-ok">−33%</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 grid-cols-1">
          {plans.map((p, pi) => {
            const v = p.variants[Math.min(period, p.variants.length - 1)]
            const perMonth = period === 0 ? v.price : Math.round(v.price / (period === 1 ? 6 : 12))
            const featured = pi === 0
            return (
              <Reveal key={p.id} delay={pi * 80}>
                <div className={`panel relative flex h-full flex-col p-6 md:p-7 ${featured ? 'border-volt/50 shadow-lift' : ''}`}>
                  {featured && (
                    <span className="grad-volt absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      Выбирают чаще
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-[20px] font-semibold">{p.title.replace('Unicard VPN ', '')}</div>
                      <div className="mt-1 text-[13.5px] text-muted">{p.subtitle} одновременно</div>
                    </div>
                    <div className="flex gap-1.5 text-muted">
                      <Smartphone className="h-4.5 w-4.5" /><MonitorSmartphone className="h-4.5 w-4.5" /><Tv className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline gap-2.5">
                    <span className="font-display text-[38px] font-bold num">{rub(v.price)}</span>
                    {v.old && <span className="num text-[15px] text-muted line-through">{rub(v.old)}</span>}
                    {period > 0 && <span className="rounded-full bg-ok-tint px-2 py-0.5 text-[12px] font-semibold text-ok num">{rub(perMonth)}/мес</span>}
                  </div>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {(p.bullets ?? []).map(b => (
                      <li key={b} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {b}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => buyNow(p, v)} className={`${featured ? 'btn-primary' : 'btn-dark'} mt-6 w-full py-3.5 text-[15px]`}>
                    <Zap className="h-4 w-4" /> Подключить — подписка сразу
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* как подключиться */}
      <div className="mt-14">
        <h2 className="font-display text-[26px] font-semibold">Подключение за 2 минуты</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3 grid-cols-1">
          {[
            { n: '01', t: 'Оплатите с баланса', d: 'Подписка появляется в кабинете мгновенно — QR-код и ссылка-конфиг уже там.' },
            { n: '02', t: 'Отсканируйте QR', d: 'Приложение на выбор: Happ, v2rayTun, Hiddify, Clash — кнопки-ссылки в кабинете.' },
            { n: '03', t: 'Готово', d: 'Если адрес попадёт под фильтр оператора — система заменит его сама, без простоя.' },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div className="panel h-full p-6">
                <div className="font-mono text-[13px] font-bold text-volt">{s.n}</div>
                <div className="mt-2 text-[16px] font-semibold">{s.t}</div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="panel mt-4 flex flex-wrap items-center gap-3 p-5 text-[13.5px] text-muted">
          <RefreshCcw className="h-4 w-4 shrink-0 text-volt" />
          Продление — в один клик из кабинета: при активном автопродлении сумма списывается с баланса, и связь не пропадает.
          <Gauge className="ml-auto h-4 w-4 shrink-0 text-volt" />
          <span>Скорости хватает на 4K-видео и звонки</span>
        </div>
      </div>
    </div>
  )
}
