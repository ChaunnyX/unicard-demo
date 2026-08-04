import { Link, NavLink, Outlet } from 'react-router-dom'
import { Zap, LayoutDashboard, Package, ReceiptText, Users, ExternalLink } from 'lucide-react'

const NAV = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Статистика' },
  { to: '/admin/products', icon: Package, label: 'Товары и наценки' },
  { to: '/admin/orders', icon: ReceiptText, label: 'Заказы' },
  { to: '/admin/users', icon: Users, label: 'Пользователи' },
]

/** Отдельный каркас админки — компактный, данные-плотный */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 md:px-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
              <Zap className="h-4.5 w-4.5 text-white" fill="currentColor" strokeWidth={0} />
            </span>
            <span className="font-display text-[17px] font-bold">Unicard <span className="text-muted">/ админка</span></span>
          </Link>
          <nav className="scroll-x ml-4 flex flex-1 gap-1">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                    isActive ? 'bg-ink text-white' : 'text-muted hover:bg-paper hover:text-ink'
                  }`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/" className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-volt">
            Витрина <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <Outlet />
      </main>
      <p className="pb-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        роль: владелец · оператор видит заказы, но не финансы
      </p>
    </div>
  )
}
