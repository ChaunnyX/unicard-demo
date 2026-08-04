import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, EyeOff, Smartphone, ArrowUpRight } from 'lucide-react'
import { useStore } from '../../lib/store'
import { rub } from '../../lib/format'
import BankCard from '../../components/BankCard'
import { CopyBtn } from '../../components/ui'

export default function Cards() {
  const { cards, issueCard, toast, balance } = useStore()
  const [reveal, setReveal] = useState<string | null>(null)
  const nav = useNavigate()

  const issue = () => {
    const res = issueCard()
    if (res === 'no-funds') {
      nav(`/account/topup?need=990&back=/account/cards`)
      return
    }
    toast('Карта выпущена — реквизиты ниже')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[26px] font-bold">Мои карты</h1>
        {cards.length > 0 && (
          <button onClick={issue} className="btn-ghost px-5 py-2.5 text-[13.5px]"><Plus className="h-4 w-4" /> Ещё карта · 990 ₽</button>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="panel mt-5 grid items-center gap-8 p-8 md:grid-cols-2 grid-cols-1">
          <div>
            <h2 className="font-display text-[20px] font-semibold">Карта для зарубежных оплат</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Виртуальная Mastercard с иностранным BIN: подписки, реклама, магазины.
              Выпуск ~2 минуты, пополнение с баланса Unicard.
            </p>
            <ul className="mt-4 space-y-2 text-[13.5px] text-muted">
              <li className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-volt" /> Apple Pay / Google Pay</li>
              <li className="flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-volt" /> Лимит операции до $50 000</li>
            </ul>
            <button onClick={issue} className="btn-primary mt-5 px-6 py-3 text-[14.5px]">
              <Plus className="h-4 w-4" /> Выпустить за {rub(990)}
            </button>
            <p className="mt-2 text-[12px] text-muted">Обслуживание 450 ₽/мес · на балансе {rub(balance)}</p>
          </div>
          <BankCard className="justify-self-center" />
        </div>
      ) : (
        <div className="mt-5 grid gap-6 lg:grid-cols-2 grid-cols-1">
          {cards.map(c => (
            <div key={c.id} className="panel p-6">
              <BankCard last4={c.last4} holder={c.holder} exp={c.exp} className="mx-auto" />
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-paper px-4 py-3">
                  <span className="text-[12.5px] font-medium text-muted">Номер</span>
                  <span className="num font-mono text-[13.5px] font-semibold">
                    {reveal === c.id ? `5321 44${c.last4.slice(0, 2)} 90${c.last4.slice(2)} ${c.last4}` : `5321 •••• •••• ${c.last4}`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setReveal(reveal === c.id ? null : c.id)} className="cursor-pointer text-muted hover:text-ink">
                      {reveal === c.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <CopyBtn text={`5321 44${c.last4.slice(0, 2)} 90${c.last4.slice(2)} ${c.last4}`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center justify-between rounded-xl bg-paper px-4 py-3">
                    <span className="text-[12.5px] font-medium text-muted">Срок</span>
                    <span className="num font-mono text-[13.5px] font-semibold">{c.exp}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-paper px-4 py-3">
                    <span className="text-[12.5px] font-medium text-muted">CVC</span>
                    <span className="num font-mono text-[13.5px] font-semibold">{reveal === c.id ? '482' : '•••'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2.5">
                <button onClick={() => toast('Демо: пополнение карты появится с бэкендом', 'info')} className="btn-primary flex-1 py-3 text-[14px]">
                  Пополнить с баланса
                </button>
                <button onClick={() => toast('Демо: карта заморожена', 'info')} className="btn-ghost px-5 py-3 text-[14px]">Заморозить</button>
              </div>
              <p className="mt-3 text-center text-[12px] text-muted">Комиссия пополнения 3,5% · обслуживание 450 ₽/мес</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
