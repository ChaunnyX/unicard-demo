export const fmt = (n: number) => n.toLocaleString('ru-RU')
export const rub = (n: number) => `${fmt(Math.round(n))} ₽`

export const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export const fmtDateTime = (ts: number) =>
  new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ', ' +
  new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

export const daysLeft = (ts: number) => Math.max(0, Math.ceil((ts - Date.now()) / 86400000))

// генератор «кодов» для демо-выдачи
const AB = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const genCode = (groups = 3, len = 5) =>
  Array.from({ length: groups }, () =>
    Array.from({ length: len }, () => AB[Math.floor(Math.random() * AB.length)]).join('')
  ).join('-')

export const genOrderId = () => 'UC-' + Math.floor(100000 + Math.random() * 900000)
