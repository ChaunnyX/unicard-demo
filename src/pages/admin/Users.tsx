import { useState } from 'react'
import { Plus, Undo2, PackagePlus } from 'lucide-react'
import { ADMIN_USERS } from '../../data/admin'
import { rub } from '../../lib/format'

/** Пользователи + ручные операции поддержки */
export default function AdminUsers() {
  const [flash, setFlash] = useState<string | null>(null)
  const act = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(null), 2200) }

  return (
    <div>
      <h1 className="font-display text-[22px] font-bold">Пользователи</h1>
      <p className="mt-1 text-[13.5px] text-muted">
        Ручные операции — для поддержки: начислить баланс, вернуть деньги, выдать товар вручную.
      </p>

      <div className="panel mt-4 overflow-hidden">
        <div className="scroll-x">
          <table className="w-full min-w-[720px] text-[13px]">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-muted">
                <th className="px-5 py-2.5 font-medium">ID</th>
                <th className="px-2 py-2.5 font-medium">Имя</th>
                <th className="px-2 py-2.5 font-medium">Telegram</th>
                <th className="px-2 py-2.5 text-right font-medium">Баланс</th>
                <th className="px-2 py-2.5 text-right font-medium">Заказов</th>
                <th className="px-2 py-2.5 text-right font-medium">Потратил</th>
                <th className="px-5 py-2.5 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_USERS.map(u => (
                <tr key={u.id} className="border-b border-line/60 last:border-0 hover:bg-paper/40">
                  <td className="px-5 py-2.5 font-mono text-[11.5px] text-muted">#{u.id}</td>
                  <td className="px-2 py-2.5 font-medium">{u.name}</td>
                  <td className="px-2 py-2.5 font-mono text-[12px] text-volt">{u.tg}</td>
                  <td className="num px-2 py-2.5 text-right font-semibold">{rub(u.balance)}</td>
                  <td className="num px-2 py-2.5 text-right text-muted">{u.orders}</td>
                  <td className="num px-2 py-2.5 text-right text-muted">{rub(u.spent)}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => act(`Баланс ${u.tg} пополнен вручную`)} title="Начислить баланс"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-ok hover:text-ok">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => act(`Возврат для ${u.tg} проведён`)} title="Вернуть деньги"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-hot hover:text-hot">
                        <Undo2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => act(`Товар выдан ${u.tg} вручную`)} title="Выдать товар вручную"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-volt hover:text-volt">
                        <PackagePlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {flash && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white shadow-lift"
          style={{ animation: 'rise 250ms cubic-bezier(0.2,0,0,1)' }}>
          {flash} · демо
        </div>
      )}
    </div>
  )
}
