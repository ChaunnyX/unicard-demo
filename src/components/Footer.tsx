import { Link } from 'react-router-dom'
import { Zap, Send } from 'lucide-react'
import { CATEGORIES } from '../data/products'

const PAY = ['МИР', 'СБП', 'VISA', 'Mastercard', 'USDT']

export default function Footer() {
  return (
    <footer className="grad-night mt-20 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] grid-cols-1">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grad-volt flex h-9 w-9 items-center justify-center rounded-xl">
                <Zap className="h-5 w-5 text-white" fill="currentColor" strokeWidth={0} />
              </span>
              <span className="font-display text-[20px] font-bold">Unicard</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/60">
              Маркетплейс цифровых товаров с выдачей за секунды. Единый баланс — пополнил
              один раз, покупаешь всё без повторного ввода карты.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {PAY.map(p => (
                <span key={p} className="rounded-lg border border-white/15 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-white/70">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-4 !text-white/45">Каталог</div>
            <ul className="space-y-2.5 text-[14px]">
              {CATEGORIES.map(c => (
                <li key={c.id}>
                  <Link to={`/c/${c.id}`} className="text-white/75 transition-colors hover:text-white">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4 !text-white/45">Покупателям</div>
            <ul className="space-y-2.5 text-[14px] text-white/75">
              <li><Link to="/account" className="transition-colors hover:text-white">Личный кабинет</Link></li>
              <li><Link to="/account/topup" className="transition-colors hover:text-white">Пополнение баланса</Link></li>
              <li><Link to="/#how" className="transition-colors hover:text-white">Как работает выдача</Link></li>
              <li><Link to="/#faq" className="transition-colors hover:text-white">Частые вопросы</Link></li>
              <li><span className="cursor-pointer transition-colors hover:text-white">Оферта и конфиденциальность</span></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4 !text-white/45">Поддержка</div>
            <p className="text-[14px] leading-relaxed text-white/75">
              Отвечаем в Telegram круглосуточно — среднее время ответа 4 минуты.
            </p>
            <a className="btn mt-4 gap-2 rounded-full bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/20">
              <Send className="h-4 w-4" /> @unicard_support
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-white/40">
          <span>© 2026 Unicard · Цифровые товары и сервисы</span>
          <span className="font-mono">Демо-версия витрины · данные условные</span>
        </div>
      </div>
    </footer>
  )
}
