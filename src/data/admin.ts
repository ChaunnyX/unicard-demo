// Canned-данные админки (детерминированные — без Math.random)

let seed = 42
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }

// выручка по дням за 30 дней, ₽
export const REVENUE_DAYS: number[] = Array.from({ length: 30 }, (_, i) => {
  const trend = 14000 + i * 620            // рост
  const weekly = i % 7 >= 5 ? 1.35 : 1     // выходные выше
  return Math.round((trend * weekly + rnd() * 6000) / 100) * 100
})

export const KPI = {
  revenue30: REVENUE_DAYS.reduce((a, b) => a + b, 0),
  profit30: Math.round(REVENUE_DAYS.reduce((a, b) => a + b, 0) * 0.31),
  orders30: 1847,
  users30: 412,
  avgCheck: Math.round(REVENUE_DAYS.reduce((a, b) => a + b, 0) / 1847),
  deliveryAvgSec: 2.4,
}

export const CAT_SHARE = [
  { cat: 'VPN', pct: 27, margin: '70%' },
  { cat: 'Gift-карты', pct: 22, margin: '18%' },
  { cat: 'Игры', pct: 17, margin: '21%' },
  { cat: 'eSIM', pct: 14, margin: '38%' },
  { cat: 'Донат', pct: 11, margin: '15%' },
  { cat: 'Прокси', pct: 6, margin: '42%' },
  { cat: 'Карты', pct: 3, margin: 'дог.' },
]

export const DEPOSITS = [
  { name: 'MobiMatter', cur: '$', value: 212, start: 250, note: 'eSIM' },
  { name: 'Kinguin', cur: '$', value: 148, start: 300, note: 'gift и ключи' },
  { name: 'Proxy-Seller', cur: '$', value: 37, start: 50, note: 'прокси', warn: true },
  { name: 'Reloadly', cur: '$', value: 96, start: 120, note: 'пополнения' },
  { name: 'CodesWholesale', cur: '€', value: 71, start: 100, note: 'резерв gift' },
]

const NAMES = ['Александр К.', 'Мария П.', 'Иван С.', 'Дарья Л.', 'Никита В.', 'Полина Р.', 'Артём Ж.', 'Софья М.', 'Егор Т.', 'Алиса Б.', 'Максим Д.', 'Вера Н.']
const ITEMS = [
  ['Steam Gift Card · 1 000 ₽', 1090, 'gift'], ['ELDEN RING · ключ', 3299, 'games'],
  ['eSIM Турция · 5 ГБ', 1090, 'esim'], ['Unicard VPN · 1 мес', 299, 'vpn'],
  ['Telegram Premium · 3 мес', 1190, 'topup'], ['PUBG Mobile · 325 UC', 490, 'topup'],
  ['Резидентные прокси · 5 ГБ', 745, 'proxy'], ['PlayStation Store · 500 TL', 1690, 'gift'],
  ['Пополнение Steam · 500 ₽', 550, 'topup'], ['Cyberpunk 2077 Ultimate', 2490, 'games'],
  ['Виртуальная карта MC', 990, 'cards'], ['eSIM Грузия · 5 ГБ', 990, 'esim'],
] as [string, number, string][]

export interface AdminOrder {
  id: string; user: string; item: string; cat: string; price: number
  cost: number; ts: number; status: 'done' | 'processing' | 'refund'; ms: number
}

export const ADMIN_ORDERS: AdminOrder[] = Array.from({ length: 28 }, (_, i) => {
  const [item, price, cat] = ITEMS[Math.floor(rnd() * ITEMS.length)]
  const status = rnd() > 0.94 ? 'refund' : rnd() > 0.9 ? 'processing' : 'done'
  return {
    id: 'UC-' + (492100 - i * 7 - Math.floor(rnd() * 5)),
    user: NAMES[Math.floor(rnd() * NAMES.length)],
    item, cat, price,
    cost: Math.round(price * (0.55 + rnd() * 0.3)),
    ts: Date.now() - i * 47 * 60000 - rnd() * 3000000,
    status, ms: Math.round(900 + rnd() * 3400),
  }
})

export interface AdminUser {
  id: number; name: string; tg: string; balance: number; orders: number; spent: number; ts: number
}

export const ADMIN_USERS: AdminUser[] = NAMES.map((n, i) => ({
  id: 1000 + i * 17,
  name: n,
  tg: '@' + n.split(' ')[0].toLowerCase() + (i * 13 % 89),
  balance: Math.round(rnd() * 4000 / 10) * 10,
  orders: Math.floor(rnd() * 40) + 1,
  spent: Math.round(rnd() * 60000 / 100) * 100,
  ts: Date.now() - Math.floor(rnd() * 120) * 86400000,
}))

export const CATEGORY_MARKUP: { cat: string; id: string; markup: number; products: number }[] = [
  { cat: 'Gift-карты', id: 'gift', markup: 10, products: 8 },
  { cat: 'Игры и ключи', id: 'games', markup: 12, products: 16 },
  { cat: 'Донат и пополнения', id: 'topup', markup: 8, products: 9 },
  { cat: 'eSIM', id: 'esim', markup: 35, products: 17 },
  { cat: 'VPN', id: 'vpn', markup: 70, products: 2 },
  { cat: 'Прокси', id: 'proxy', markup: 40, products: 4 },
  { cat: 'Карты', id: 'cards', markup: 0, products: 1 },
]
