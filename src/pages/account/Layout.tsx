import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Wallet, ReceiptText, ShieldCheck, CreditCard, Send, LogOut, User } from 'lucide-react'
import { useStore } from '../../lib/store'

const NAV = [
  { to: '/account', end: true, icon: LayoutDashboard, label: 'Обзор' },
  { to: '/account/topup', icon: Wallet, label: 'Пополнение' },
  { to: '/account/orders', icon: ReceiptText, label: 'Заказы' },
  { to: '/account/subs', icon: ShieldCheck, label: 'Подписки' },
  { to: '/account/cards', icon: CreditCard, label: 'Карты' },
  { to: '/account/transfers', icon: Send, label: 'Переводы' },
]

export default function AccountLayout() {
  const { user, setAuthOpen, signOut } = useStore()

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="panel p-8">
          <span className="grad-volt mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-volt">
            <User className="h-6 w-6 text-white" />
          </span>
          <h1 className="mt-4 font-display text-[24px] font-bold">Кабинет Unicard</h1>
          <p className="mt-2 text-[14px] text-muted">
            Баланс, заказы с кодами и подписки — всё здесь. Вход через Telegram, 5 секунд.
          </p>
          <button onClick={() => setAuthOpen(true)} className="btn-primary mt-6 w-full py-3.5 text-[15px]">Войти</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr] grid-cols-1">
        <aside>
          <div className="mb-4 hidden items-center gap-3 lg:flex">
            <span className="grad-volt flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-bold text-white">{user.name[0]}</span>
            <div>
              <div className="text-[14.5px] font-semibold leading-tight">{user.name}</div>
              <div className="font-mono text-[11.5px] text-muted">{user.username}</div>
            </div>
          </div>
          <nav className="scroll-x flex gap-1 lg:flex-col">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                    isActive ? 'bg-volt-tint text-volt' : 'text-muted hover:bg-surface hover:text-ink'
                  }`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </NavLink>
            ))}
            <button onClick={signOut}
              className="mt-0 flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-muted transition-colors hover:text-hot lg:mt-4">
              <LogOut className="h-4 w-4" /> Выйти
            </button>
          </nav>
        </aside>
        <div className="min-w-0"><Outlet /></div>
      </div>
    </div>
  )
}
