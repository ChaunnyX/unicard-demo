import { CreditCard, Zap, ShieldCheck, Smartphone, Globe2, Check } from 'lucide-react'
import { getProduct } from '../../data/products'
import { rub } from '../../lib/format'
import { useBuy } from '../../lib/useBuy'
import { Crumbs, Reveal } from '../ui'
import BankCard from '../BankCard'

const FEES = [
  ['Выпуск карты', '990 ₽', 'разово, списывается с баланса'],
  ['Обслуживание', '450 ₽/мес', 'только за активную карту'],
  ['Пополнение', '3,5%', 'с баланса Unicard, мгновенно'],
  ['Операция', '$0,5–1', 'зависит от суммы'],
  ['Лимит операции', 'до $50 000', 'хватает на любую подписку и рекламу'],
]

const USES = ['Подписки: ChatGPT, Netflix, Spotify', 'Реклама: Google Ads, Meta', 'Магазины: Amazon, AliExpress', 'Хостинги и SaaS-сервисы', 'App Store / Google Play других стран', 'Бронирования отелей и авиабилетов']

/** Карты MC/VISA: продуктовый лендинг с живой 3D-картой */
export default function CardsCatalog() {
  const p = getProduct('card-virtual')!
  const v = p.variants[0]
  const buyNow = useBuy()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Crumbs items={[{ label: 'Карты MC / VISA' }]} />

      <div className="grid items-center gap-10 md:grid-cols-2 grid-cols-1">
        <div>
          <div className="eyebrow mb-3 flex items-center gap-2 !text-volt">
            <CreditCard className="h-4 w-4" /> white-label партнёрской платформы
          </div>
          <h1 className="font-display text-[32px] font-bold leading-tight tracking-tight md:text-[44px]">
            Карта для зарубежных оплат — <span className="grad-text">за 2 минуты</span>
          </h1>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-muted">
            Виртуальная Mastercard с иностранным BIN. Пополняется с баланса Unicard,
            работает в Apple Pay и Google Pay. Реквизиты появляются в кабинете сразу после выпуска.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={() => buyNow(p, v)} className="btn-primary px-7 py-3.5 text-[15px]">
              <Zap className="h-4 w-4" /> Выпустить за {rub(v.price)}
            </button>
            <span className="text-[13px] text-muted">обслуживание 450 ₽/мес<br />списывается с баланса</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
            <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-volt" /> Apple Pay / Google Pay</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-volt" /> 3-DS подтверждение</span>
            <span className="flex items-center gap-1.5"><Globe2 className="h-4 w-4 text-volt" /> работает по всему миру</span>
          </div>
        </div>
        <Reveal delay={120} className="flex justify-center">
          <BankCard />
        </Reveal>
      </div>

      {/* на что тратят */}
      <div className="mt-14 grid gap-4 md:grid-cols-2 grid-cols-1">
        <Reveal>
          <div className="panel h-full p-6 md:p-7">
            <h2 className="font-display text-[20px] font-semibold">Что ей оплачивают</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 grid-cols-1">
              {USES.map(u => (
                <li key={u} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {u}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-paper p-4 text-[13px] leading-relaxed text-muted">
              Российские карты за рубежом не работают с 2022 года. Виртуальная карта с иностранным
              BIN решает это без поездок и посредников — выпуск полностью онлайн.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="panel h-full overflow-hidden">
            <div className="border-b border-line px-6 py-4">
              <h2 className="font-display text-[20px] font-semibold">Тарифы — без сюрпризов</h2>
            </div>
            <table className="w-full text-[14px]">
              <tbody>
                {FEES.map(([k, val, note], i) => (
                  <tr key={k} className={i % 2 ? 'bg-paper/50' : ''}>
                    <td className="px-6 py-3 font-medium">{k}</td>
                    <td className="num px-3 py-3 text-right font-bold">{val}</td>
                    <td className="px-6 py-3 text-right text-[12.5px] text-muted">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>

      {/* шаги */}
      <div className="mt-10 grid gap-4 md:grid-cols-3 grid-cols-1">
        {[
          { n: '01', t: 'Нажмите «Выпустить»', d: '990 ₽ спишутся с баланса. Если баланса не хватает — сначала пополнение.' },
          { n: '02', t: 'Карта готова через ~2 минуты', d: 'Номер, срок и CVC появятся в кабинете. Добавьте в Apple Pay или Google Pay.' },
          { n: '03', t: 'Пополняйте и платите', d: 'Перевод с баланса на карту — мгновенный. Комиссия 3,5% видна до подтверждения.' },
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
    </div>
  )
}
