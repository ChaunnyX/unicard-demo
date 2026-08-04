import { Link } from 'react-router-dom'
import { Plus, Clock3, Check, Send } from 'lucide-react'
import { useStore } from '../../lib/store'
import { fmtDateTime, rub } from '../../lib/format'

export default function Transfers() {
  const { transfers } = useStore()

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[26px] font-bold">Переводы</h1>
        <Link to="/c/transfers" className="btn-primary px-5 py-2.5 text-[13.5px]"><Plus className="h-4 w-4" /> Новый перевод</Link>
      </div>

      {transfers.length === 0 ? (
        <div className="panel mt-5 p-10 text-center">
          <Send className="mx-auto h-10 w-10 text-volt" />
          <p className="mt-3 text-[14.5px] text-muted">
            Переводы в 60+ стран с комиссией от 1,5%. Заявка обрабатывается оператором за 15 минут — 2 часа.
          </p>
          <Link to="/c/transfers" className="btn-primary mt-5 inline-flex px-6 py-3 text-[14px]">Рассчитать перевод</Link>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {transfers.map(t => (
            <div key={t.id} className="panel flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold">
                  {rub(t.amountRub)} → {t.amountOut.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} {t.cur}
                  <span className="ml-2 font-normal text-muted">· {t.country}</span>
                </div>
                <div className="mt-0.5 font-mono text-[11.5px] text-muted">{t.id} · {fmtDateTime(t.ts)}</div>
              </div>
              {t.status === 'review' ? (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-amber-600">
                  <Clock3 className="h-3.5 w-3.5" /> Оператор проверяет
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full bg-ok-tint px-3.5 py-1.5 text-[12.5px] font-semibold text-ok">
                  <Check className="h-3.5 w-3.5" /> Выполнен
                </span>
              )}
            </div>
          ))}
          <p className="pt-2 text-center text-[13px] text-muted">
            Оператор напишет в Telegram, уточнит реквизиты получателя и подтвердит курс.
          </p>
        </div>
      )}
    </div>
  )
}
