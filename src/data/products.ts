import { asset } from '../lib/asset'

// Каталог Unicard — canned-данные демо. Цены ориентированы на рынок 08.2026
// (Kinguin/Airalo-уровень закупки + наценка категории из аудита поставщиков).

export type CategoryId =
  | 'gift' | 'games' | 'topup' | 'esim' | 'vpn' | 'proxy' | 'cards' | 'transfers'

export interface Variant {
  id: string
  label: string
  sub?: string
  price: number
  old?: number
}

export interface Product {
  id: string
  cat: CategoryId
  title: string
  subtitle?: string
  img?: string
  tile?: { from: string; to: string; mark: string }
  flag?: string
  mapKey?: string
  rating: number
  reviews: number
  variants: Variant[]
  badge?: string
  discount?: number
  deliverySec: number
  region?: string
  bullets?: string[]
  desc?: string
  popular?: boolean
}

export interface CategoryMeta {
  id: CategoryId
  name: string
  short: string
  from: number
  blurb: string
  auto: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'gift', name: 'Gift-карты', short: 'Gift-карты', from: 390, blurb: 'Steam, PlayStation, Xbox, App Store — код за секунды', auto: 'выдача мгновенно' },
  { id: 'games', name: 'Игры и ключи', short: 'Игры', from: 449, blurb: 'Ключи Steam дешевле магазина, активация Россия и СНГ', auto: 'выдача мгновенно' },
  { id: 'topup', name: 'Донат и пополнения', short: 'Донат', from: 109, blurb: 'PUBG, Roblox, Genshin, Telegram Premium, связь', auto: 'выдача до минуты' },
  { id: 'esim', name: 'eSIM для поездок', short: 'eSIM', from: 169, blurb: 'Интернет в 200+ странах без роуминга, QR сразу', auto: 'QR за минуту' },
  { id: 'vpn', name: 'Unicard VPN', short: 'VPN', from: 199, blurb: 'Свои серверы до 1 Гбит/с, работает при белых списках', auto: 'подписка мгновенно' },
  { id: 'proxy', name: 'Прокси', short: 'Прокси', from: 77, blurb: 'Резидентные, мобильные и датацентр — доступы сразу', auto: 'доступы до минуты' },
  { id: 'cards', name: 'Карты MC / VISA', short: 'Карты', from: 990, blurb: 'Виртуальная карта для зарубежных оплат за 2 минуты', auto: 'выпуск ~2 мин' },
  { id: 'transfers', name: 'Переводы за рубеж', short: 'Переводы', from: 0, blurb: '60+ стран, комиссия от 1,5%, курс фиксируется сразу', auto: 'обработка до 2 ч' },
]

const g = (from: string, to: string, mark: string) => ({ from, to, mark })

export const PRODUCTS: Product[] = [
  // ---------------- GIFT ----------------
  {
    id: 'gift-steam-ru', cat: 'gift', title: 'Steam Gift Card', subtitle: 'Россия · КЗ',
    tile: g('#12233f', '#1b3358', 'STEAM'), rating: 4.9, reviews: 3214, popular: true,
    badge: 'Хит', deliverySec: 2, region: 'Аккаунты: Россия, Казахстан',
    variants: [
      { id: '500', label: '500 ₽', price: 549 },
      { id: '1000', label: '1 000 ₽', price: 1090 },
      { id: '2500', label: '2 500 ₽', price: 2690 },
      { id: '5000', label: '5 000 ₽', price: 5390 },
    ],
    bullets: ['Код активируется в кошелёк Steam', 'Подходит для покупок и DLC', 'Возврат на баланс, если код не сработал'],
    desc: 'Пополнение кошелька Steam подарочной картой. Код приходит в кабинет и на почту сразу после оплаты — вводите его на steampowered.com и сумма зачисляется на аккаунт.',
  },
  {
    id: 'gift-psn-tr', cat: 'gift', title: 'PlayStation Store', subtitle: 'Турция',
    tile: g('#00306b', '#0058c7', 'PS'), rating: 4.8, reviews: 1467, popular: true,
    deliverySec: 3, region: 'Аккаунты: Турция',
    variants: [
      { id: '500tl', label: '500 TL', sub: '≈ подписки и инди', price: 1690 },
      { id: '1000tl', label: '1 000 TL', price: 3290 },
      { id: '2000tl', label: '2 000 TL', sub: 'хватает на AAA', price: 6390 },
    ],
    bullets: ['Для турецкого региона PSN', 'Инструкция по смене региона в комплекте', 'PS Plus оплачивается этой картой'],
    desc: 'Пополнение турецкого кошелька PlayStation Store. Если аккаунт ещё российский — приложим пошаговую инструкцию по созданию турецкого.',
  },
  {
    id: 'gift-xbox-tr', cat: 'gift', title: 'Xbox Gift Card', subtitle: 'Турция',
    tile: g('#0e4a21', '#107C10', 'XBOX'), rating: 4.8, reviews: 812,
    deliverySec: 3, region: 'Аккаунты: Турция',
    variants: [
      { id: '250tl', label: '250 TL', price: 990 },
      { id: '500tl', label: '500 TL', price: 1790 },
      { id: '1000tl', label: '1 000 TL', price: 3490 },
    ],
    bullets: ['Game Pass оплачивается картой', 'Код — сразу в кабинет'],
    desc: 'Пополнение кошелька Microsoft / Xbox турецкого региона.',
  },
  {
    id: 'gift-appstore-ru', cat: 'gift', title: 'App Store & iTunes', subtitle: 'Россия',
    tile: g('#3a3f4d', '#20242e', 'iTUNES'), rating: 4.9, reviews: 2058, popular: true,
    deliverySec: 2, region: 'Аккаунты: Россия',
    variants: [
      { id: '500', label: '500 ₽', price: 540 },
      { id: '1000', label: '1 000 ₽', price: 1060 },
      { id: '2500', label: '2 500 ₽', price: 2590 },
    ],
    bullets: ['Зачисляется на Apple ID', 'Оплата приложений, iCloud и подписок'],
    desc: 'Официальный код пополнения российского Apple ID.',
  },
  {
    id: 'gift-gplay-tr', cat: 'gift', title: 'Google Play', subtitle: 'Турция',
    tile: g('#0f4f3d', '#12805c', 'GP'), rating: 4.7, reviews: 634,
    deliverySec: 3, region: 'Аккаунты: Турция',
    variants: [
      { id: '100tl', label: '100 TL', price: 390 },
      { id: '250tl', label: '250 TL', price: 890 },
      { id: '500tl', label: '500 TL', price: 1690 },
    ],
    desc: 'Пополнение кошелька Google Play турецкого региона.',
  },
  {
    id: 'gift-nintendo-us', cat: 'gift', title: 'Nintendo eShop', subtitle: 'США',
    tile: g('#7a1010', '#e60012', 'NIN'), rating: 4.8, reviews: 341,
    deliverySec: 4, region: 'Аккаунты: США',
    variants: [
      { id: '10', label: '$10', price: 890 },
      { id: '20', label: '$20', price: 1690 },
      { id: '35', label: '$35', price: 2890 },
    ],
    desc: 'Код пополнения Nintendo eShop региона США.',
  },
  {
    id: 'gift-blizzard-eu', cat: 'gift', title: 'Battle.net', subtitle: 'Европа',
    tile: g('#132a4d', '#00aeff', 'BLZ'), rating: 4.7, reviews: 218,
    deliverySec: 4, region: 'Аккаунты: EU',
    variants: [
      { id: '20', label: '€20', price: 2190 },
      { id: '50', label: '€50', price: 5290 },
    ],
    desc: 'Подарочная карта Battle.net европейского региона.',
  },
  {
    id: 'gift-discord', cat: 'gift', title: 'Discord Nitro', subtitle: 'подарочная подписка',
    tile: g('#2b3ba5', '#5865F2', 'DSC'), rating: 4.8, reviews: 507,
    deliverySec: 3, region: 'Любой регион',
    variants: [
      { id: '1m', label: '1 месяц', price: 450 },
      { id: '12m', label: '12 месяцев', price: 4290, old: 5400 },
    ],
    desc: 'Гифт-ссылка Discord Nitro — активируется на любом аккаунте.',
  },

  // ---------------- GAMES ----------------
  {
    id: 'game-helldivers2', cat: 'games', title: 'HELLDIVERS 2', img: asset('/img/games/helldivers2.jpg'),
    rating: 4.8, reviews: 921, discount: 25, badge: '−25%', popular: true, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Standard', price: 2699, old: 3599 }],
    bullets: ['Ключ Steam, активация в РФ', 'Кооператив до 4 игроков'],
    desc: 'Ключ активации HELLDIVERS 2 для Steam. Приходит мгновенно после оплаты.',
  },
  {
    id: 'game-eldenring', cat: 'games', title: 'ELDEN RING', img: asset('/img/games/eldenring.jpg'),
    rating: 4.9, reviews: 1544, popular: true, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [
      { id: 'std', label: 'Standard', price: 3299 },
      { id: 'sote', label: 'Shadow of the Erdtree Edition', price: 4990 },
    ],
    desc: 'Ключ Steam. Издание с дополнением Shadow of the Erdtree — полное.',
  },
  {
    id: 'game-gtav', cat: 'games', title: 'GTA V Enhanced', img: asset('/img/games/gtav.jpg'),
    rating: 4.7, reviews: 2860, popular: true, deliverySec: 2, discount: 30, badge: '−30%',
    region: 'Активация: Россия и СНГ · Rockstar',
    variants: [{ id: 'std', label: 'Standard', price: 1049, old: 1499 }],
    desc: 'Ключ GTA V Enhanced для Rockstar Games Launcher.',
  },
  {
    id: 'game-bg3', cat: 'games', title: "Baldur's Gate 3", img: asset('/img/games/bg3.jpg'),
    rating: 4.9, reviews: 1755, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Standard', price: 1899 }, { id: 'dlx', label: 'Digital Deluxe', price: 2390 }],
    desc: 'Ключ Steam, полностью на русском.',
  },
  {
    id: 'game-cyberpunk', cat: 'games', title: 'Cyberpunk 2077', img: asset('/img/games/cyberpunk.jpg'),
    rating: 4.8, reviews: 1930, discount: 50, badge: '−50%', deliverySec: 2,
    region: 'Активация: Россия и СНГ · GOG / Steam',
    variants: [
      { id: 'std', label: 'Standard', price: 1499, old: 2999 },
      { id: 'ult', label: 'Ultimate (+ Phantom Liberty)', price: 2490, old: 4200 },
    ],
    desc: 'Ключ Cyberpunk 2077. Ultimate включает дополнение Phantom Liberty.',
  },
  {
    id: 'game-rdr2', cat: 'games', title: 'Red Dead Redemption 2', img: asset('/img/games/rdr2.jpg'),
    rating: 4.9, reviews: 2412, discount: 67, badge: '−67%', popular: true, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Rockstar',
    variants: [{ id: 'std', label: 'Standard', price: 1299, old: 3999 }],
    desc: 'Ключ Red Dead Redemption 2 для Rockstar Games Launcher.',
  },
  {
    id: 'game-witcher3', cat: 'games', title: 'The Witcher 3: GOTY', img: asset('/img/games/witcher3.jpg'),
    rating: 4.9, reviews: 3105, discount: 80, badge: '−80%', deliverySec: 2,
    region: 'Активация: Россия и СНГ · GOG',
    variants: [{ id: 'goty', label: 'Game of the Year', price: 449, old: 2249 }],
    desc: 'Полное издание со всеми дополнениями. Ключ GOG — без привязки к Steam.',
  },
  {
    id: 'game-hogwarts', cat: 'games', title: 'Hogwarts Legacy', img: asset('/img/games/hogwarts.jpg'),
    rating: 4.7, reviews: 1177, discount: 40, badge: '−40%', deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Standard', price: 1799, old: 2999 }],
    desc: 'Ключ Steam с активацией в России и СНГ.',
  },
  {
    id: 'game-fc25', cat: 'games', title: 'EA SPORTS FC 25', img: asset('/img/games/fc25.jpg'),
    rating: 4.5, reviews: 866, discount: 55, badge: '−55%', deliverySec: 3,
    region: 'Активация: EA App · инструкция в комплекте',
    variants: [{ id: 'std', label: 'Standard', price: 2999, old: 6599 }],
    desc: 'Ключ EA App. К заказу прикладываем инструкцию по активации из РФ.',
  },
  {
    id: 'game-forza5', cat: 'games', title: 'Forza Horizon 5', img: asset('/img/games/forza5.jpg'),
    rating: 4.8, reviews: 1489, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Standard', price: 2099 }, { id: 'prem', label: 'Premium', price: 3390 }],
    desc: 'Ключ Steam. Premium — все дополнения и ранний доступ к сезонам.',
  },
  {
    id: 'game-silksong', cat: 'games', title: 'Hollow Knight: Silksong', img: asset('/img/games/silksong.jpg'),
    rating: 4.9, reviews: 1204, badge: 'Новинка', popular: true, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Standard', price: 869 }],
    desc: 'Ключ Steam долгожданного продолжения Hollow Knight.',
  },
  {
    id: 'game-doomtda', cat: 'games', title: 'DOOM: The Dark Ages', img: asset('/img/games/doomtda.jpg'),
    rating: 4.7, reviews: 693, badge: 'Новинка', deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Standard', price: 4290 }],
    desc: 'Ключ Steam новой части DOOM.',
  },
  {
    id: 'game-stalker2', cat: 'games', title: 'S.T.A.L.K.E.R. 2', img: asset('/img/games/stalker2.jpg'),
    rating: 4.5, reviews: 731, discount: 35, badge: '−35%', deliverySec: 2,
    region: 'Активация: Steam · через гифт',
    variants: [{ id: 'std', label: 'Standard', price: 2590, old: 3990 }],
    desc: 'Выдаётся гифтом на аккаунт Steam — понадобится ссылка на профиль.',
  },
  {
    id: 'game-sekiro', cat: 'games', title: 'Sekiro: Shadows Die Twice', img: asset('/img/games/sekiro.jpg'),
    rating: 4.8, reviews: 1002, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'goty', label: 'GOTY Edition', price: 2790 }],
    desc: 'Ключ Steam, издание GOTY.',
  },
  {
    id: 'game-dyinglight2', cat: 'games', title: 'Dying Light 2', img: asset('/img/games/dyinglight2.jpg'),
    rating: 4.6, reviews: 588, discount: 60, badge: '−60%', deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Reloaded Edition', price: 1190, old: 2999 }],
    desc: 'Ключ Steam, издание Reloaded.',
  },
  {
    id: 'game-reveil', cat: 'games', title: 'REVEIL', img: asset('/img/games/reveil.jpg'),
    rating: 4.4, reviews: 143, deliverySec: 2,
    region: 'Активация: Россия и СНГ · Steam',
    variants: [{ id: 'std', label: 'Standard', price: 690, old: 1100 }],
    desc: 'Психологический триллер, ключ Steam.',
  },

  // ---------------- TOPUP / ДОНАТ ----------------
  {
    id: 'topup-steam', cat: 'topup', title: 'Пополнение Steam', subtitle: 'на любой логин',
    tile: g('#12233f', '#1b3358', 'STEAM'), rating: 4.9, reviews: 5121, popular: true, badge: 'Хит',
    deliverySec: 45, region: 'Аккаунты: Россия и СНГ',
    variants: [
      { id: '100', label: '100 ₽', sub: 'комиссия 10%', price: 110 },
      { id: '250', label: '250 ₽', price: 275 },
      { id: '500', label: '500 ₽', price: 550 },
      { id: '1000', label: '1 000 ₽', price: 1100 },
      { id: '2000', label: '2 000 ₽', price: 2190 },
    ],
    bullets: ['Нужен только логин Steam', 'Зачисление до минуты', 'Комиссия уже в цене'],
    desc: 'Прямое пополнение кошелька Steam по логину — без входа в чужой аккаунт.',
  },
  {
    id: 'topup-tgpremium', cat: 'topup', title: 'Telegram Premium', subtitle: 'по @username',
    tile: g('#0d5c8c', '#2AABEE', 'TG'), rating: 4.9, reviews: 2280, popular: true,
    deliverySec: 60, region: 'Любой аккаунт Telegram',
    variants: [
      { id: '3m', label: '3 месяца', price: 1190 },
      { id: '6m', label: '6 месяцев', price: 1690 },
      { id: '12m', label: '12 месяцев', sub: 'выгоднее ×2', price: 2890 },
    ],
    bullets: ['Активация через Fragment', 'Нужен только @username'],
    desc: 'Подписка Telegram Premium на ваш аккаунт. Указываете @username — активируем через официальную площадку Fragment.',
  },
  {
    id: 'topup-tgstars', cat: 'topup', title: 'Telegram Stars', subtitle: 'звёзды по @username',
    tile: g('#8c6a0d', '#f2b30a', '★'), rating: 4.8, reviews: 1450,
    deliverySec: 40, region: 'Любой аккаунт Telegram',
    variants: [
      { id: '100', label: '100 звёзд', price: 189 },
      { id: '250', label: '250 звёзд', price: 459 },
      { id: '500', label: '500 звёзд', price: 899 },
      { id: '1000', label: '1 000 звёзд', price: 1790 },
    ],
    desc: 'Звёзды Telegram для подарков, подписок на каналы и покупок в ботах.',
  },
  {
    id: 'topup-pubg', cat: 'topup', title: 'PUBG Mobile UC', subtitle: 'по ID игрока',
    tile: g('#5c4a0d', '#c9a227', 'UC'), rating: 4.8, reviews: 3390, popular: true,
    deliverySec: 90, region: 'Глобальная версия',
    variants: [
      { id: '60', label: '60 UC', price: 109 },
      { id: '325', label: '325 UC', price: 490 },
      { id: '660', label: '660 UC', price: 990 },
      { id: '1800', label: '1 800 UC', price: 2590 },
    ],
    desc: 'Пополнение UC по ID игрока — без входа в аккаунт.',
  },
  {
    id: 'topup-roblox', cat: 'topup', title: 'Roblox Robux', subtitle: 'по нику',
    tile: g('#3d3d3d', '#171717', 'RBX'), rating: 4.7, reviews: 2874,
    deliverySec: 120, region: 'Любой аккаунт',
    variants: [
      { id: '80', label: '80 Robux', price: 149 },
      { id: '400', label: '400 Robux', price: 690 },
      { id: '800', label: '800 Robux', price: 1290 },
      { id: '1700', label: '1 700 Robux', price: 2690 },
    ],
    desc: 'Робуксы на аккаунт по нику — через геймпасс или напрямую.',
  },
  {
    id: 'topup-genshin', cat: 'topup', title: 'Genshin Impact', subtitle: 'кристаллы по UID',
    tile: g('#4a3d75', '#7b68c9', 'GI'), rating: 4.8, reviews: 1517,
    deliverySec: 120, region: 'Сервер Europe / Asia',
    variants: [
      { id: '60', label: '60 кристаллов', price: 119 },
      { id: '330', label: '330 кристаллов', price: 490 },
      { id: '1090', label: '1 090 кристаллов', price: 1590 },
    ],
    desc: 'Кристаллы сотворения по UID игрока.',
  },
  {
    id: 'topup-brawl', cat: 'topup', title: 'Brawl Stars', subtitle: 'гемы по тегу',
    tile: g('#7a2d0d', '#f28c0a', 'BS'), rating: 4.7, reviews: 1926,
    deliverySec: 90, region: 'Supercell ID',
    variants: [
      { id: '30', label: '30 гемов', price: 259 },
      { id: '170', label: '170 гемов', price: 1290 },
      { id: '360', label: '360 гемов', price: 2590 },
    ],
    desc: 'Гемы Brawl Stars через Supercell ID.',
  },
  {
    id: 'topup-mlbb', cat: 'topup', title: 'Mobile Legends', subtitle: 'алмазы по ID',
    tile: g('#0d3d5c', '#1b7bb5', 'ML'), rating: 4.7, reviews: 1108,
    deliverySec: 60, region: 'Любой сервер',
    variants: [
      { id: '86', label: '86 алмазов', price: 179 },
      { id: '172', label: '172 алмаза', price: 349 },
      { id: '706', label: '706 алмазов', price: 1390 },
    ],
    desc: 'Алмазы Mobile Legends: Bang Bang по ID и серверу.',
  },
  {
    id: 'topup-phone', cat: 'topup', title: 'Пополнение телефона', subtitle: 'МТС · МегаФон · билайн · t2',
    tile: g('#0d4a2a', '#12805c', 'ТЕЛ'), rating: 4.9, reviews: 4230,
    deliverySec: 20, region: 'Российские операторы',
    variants: [
      { id: '100', label: '100 ₽', sub: 'комиссия 3%', price: 103 },
      { id: '300', label: '300 ₽', price: 309 },
      { id: '500', label: '500 ₽', price: 515 },
      { id: '1000', label: '1 000 ₽', price: 1030 },
    ],
    desc: 'Мгновенное пополнение мобильного по номеру телефона.',
  },

  // ---------------- eSIM ----------------
  ...([
    ['tr', 'Турция', [['1 ГБ · 7 дней', 399], ['3 ГБ · 30 дней', 790], ['5 ГБ · 30 дней', 1090], ['10 ГБ · 30 дней', 1790], ['20 ГБ · 30 дней', 2990]], 4.9, 1830, true],
    ['th', 'Таиланд', [['1 ГБ · 7 дней', 169], ['3 ГБ · 15 дней', 490], ['10 ГБ · 30 дней', 1290], ['Безлимит · 15 дней', 2190]], 4.9, 1512, true],
    ['ae', 'ОАЭ', [['1 ГБ · 7 дней', 590], ['3 ГБ · 30 дней', 1290], ['10 ГБ · 30 дней', 2890]], 4.8, 934, false],
    ['eg', 'Египет', [['1 ГБ · 7 дней', 490], ['3 ГБ · 30 дней', 1090], ['10 ГБ · 30 дней', 2590]], 4.7, 811, false],
    ['ge', 'Грузия', [['1 ГБ · 7 дней', 290], ['5 ГБ · 30 дней', 990], ['10 ГБ · 30 дней', 1690]], 4.9, 720, true],
    ['am', 'Армения', [['1 ГБ · 7 дней', 290], ['5 ГБ · 30 дней', 990]], 4.8, 415, false],
    ['kz', 'Казахстан', [['1 ГБ · 7 дней', 249], ['5 ГБ · 30 дней', 890]], 4.8, 508, false],
    ['uz', 'Узбекистан', [['1 ГБ · 7 дней', 390], ['5 ГБ · 30 дней', 1290]], 4.7, 274, false],
    ['eu', 'Европа · 30 стран', [['1 ГБ · 7 дней', 490], ['5 ГБ · 30 дней', 1590], ['10 ГБ · 30 дней', 2690], ['20 ГБ · 30 дней', 4290]], 4.8, 1104, true],
    ['us', 'США', [['1 ГБ · 7 дней', 490], ['5 ГБ · 30 дней', 1690], ['10 ГБ · 30 дней', 2790]], 4.8, 655, false],
    ['id', 'Индонезия · Бали', [['1 ГБ · 7 дней', 349], ['5 ГБ · 30 дней', 1190], ['10 ГБ · 30 дней', 1990]], 4.8, 689, false],
    ['vn', 'Вьетнам', [['1 ГБ · 7 дней', 249], ['5 ГБ · 30 дней', 890]], 4.7, 384, false],
    ['cn', 'Китай', [['1 ГБ · 7 дней', 449], ['5 ГБ · 30 дней', 1490]], 4.6, 402, false],
    ['il', 'Израиль', [['1 ГБ · 7 дней', 490], ['5 ГБ · 30 дней', 1590]], 4.7, 296, false],
    ['jp', 'Япония', [['1 ГБ · 7 дней', 449], ['10 ГБ · 30 дней', 2490]], 4.8, 353, false],
    ['rs', 'Сербия', [['1 ГБ · 7 дней', 390], ['5 ГБ · 30 дней', 1290]], 4.7, 208, false],
    ['un', 'Global · 130 стран', [['1 ГБ · 14 дней', 790], ['5 ГБ · 30 дней', 2690], ['10 ГБ · 60 дней', 4590]], 4.7, 517, false],
  ] as [string, string, [string, number][], number, number, boolean][]).map(([code, name, packs, rating, reviews, popular]) => ({
    id: `esim-${code}`,
    cat: 'esim' as CategoryId,
    title: `eSIM ${name.split(' · ')[0]}`,
    subtitle: name.includes('·') ? name.split(' · ')[1] : 'интернет-пакет',
    flag: asset(`/img/flags/${code}.svg`),
    mapKey: code,
    rating, reviews, popular,
    deliverySec: 50,
    region: 'Телефон с поддержкой eSIM',
    variants: packs.map(([label, price], i) => ({ id: `p${i}`, label, price })),
    bullets: ['QR-код сразу после оплаты', 'Установка за 2 минуты, инструкция в комплекте', 'Только интернет, номер не выдаётся'],
    desc: `Туристический eSIM-пакет: ${name}. QR-код приходит в кабинет и на почту в течение минуты — сканируете, включаете передачу данных в роуминге, интернет работает.`,
  })),

  // ---------------- VPN ----------------
  {
    id: 'vpn-basic', cat: 'vpn', title: 'Unicard VPN Базовый', subtitle: '3 устройства',
    tile: g('#0d2a5c', '#2E5BFF', 'VPN'), rating: 4.9, reviews: 1245, popular: true, badge: 'Хит',
    deliverySec: 1, region: 'iOS · Android · Windows · macOS · TV',
    variants: [
      { id: '1m', label: '1 месяц', price: 299 },
      { id: '6m', label: '6 месяцев', sub: '248 ₽/мес', price: 1490, old: 1794 },
      { id: '12m', label: '12 месяцев', sub: '199 ₽/мес', price: 2390, old: 3588 },
    ],
    bullets: ['Работает при «белых списках» мобильных операторов', 'Свои серверы с портом до 1 Гбит/с', '4 протокола — если один заблокируют, остальные работают', '3 устройства одновременно'],
    desc: 'Собственная VPN-инфраструктура Unicard: российский вход + европейский выход. Подписка выдаётся мгновенно — QR и ссылка появляются в кабинете сразу после оплаты.',
  },
  {
    id: 'vpn-family', cat: 'vpn', title: 'Unicard VPN Семейный', subtitle: '7 устройств',
    tile: g('#0d2a5c', '#00a5ff', 'VPN'), rating: 4.9, reviews: 486,
    deliverySec: 1, region: 'iOS · Android · Windows · macOS · TV',
    variants: [
      { id: '1m', label: '1 месяц', price: 499 },
      { id: '6m', label: '6 месяцев', sub: '415 ₽/мес', price: 2490, old: 2994 },
      { id: '12m', label: '12 месяцев', sub: '333 ₽/мес', price: 3990, old: 5988 },
    ],
    bullets: ['7 устройств: вся семья + телевизор', 'Те же серверы и скорость', 'Один QR на все устройства'],
    desc: 'Семейный тариф той же инфраструктуры — на 7 устройств одновременно.',
  },

  // ---------------- PROXY ----------------
  {
    id: 'proxy-resi', cat: 'proxy', title: 'Резидентные прокси', subtitle: 'оплата за трафик',
    tile: g('#123f3a', '#0fb871', 'RES'), rating: 4.8, reviews: 612, popular: true,
    deliverySec: 30, region: '190+ стран, ротация или sticky',
    variants: [
      { id: '1gb', label: '1 ГБ', price: 159 },
      { id: '5gb', label: '5 ГБ', sub: '149 ₽/ГБ', price: 745 },
      { id: '25gb', label: '25 ГБ', sub: '139 ₽/ГБ', price: 3475 },
      { id: '100gb', label: '100 ГБ', sub: '125 ₽/ГБ', price: 12500 },
    ],
    bullets: ['Реальные домашние IP', 'Трафик не сгорает по сроку', 'API и панель управления'],
    desc: 'Резидентные прокси с оплатой за трафик. Доступы приходят в кабинет сразу.',
  },
  {
    id: 'proxy-mobile', cat: 'proxy', title: 'Мобильные прокси', subtitle: 'LTE, смена IP',
    tile: g('#3f1239', '#b50f8c', 'LTE'), rating: 4.8, reviews: 340,
    deliverySec: 40, region: 'РФ и Европа, приватный порт',
    variants: [
      { id: '1w', label: '7 дней', price: 590 },
      { id: '1m', label: '30 дней', sub: 'выгоднее на 28%', price: 1690 },
    ],
    bullets: ['Смена IP по ссылке или таймеру', 'Порт только ваш, без соседей'],
    desc: 'Приватные мобильные прокси на LTE-модемах со сменой IP.',
  },
  {
    id: 'proxy-dc', cat: 'proxy', title: 'Датацентр IPv4', subtitle: 'от 77 ₽ за IP',
    tile: g('#2a2f4d', '#5b6cff', 'DC'), rating: 4.7, reviews: 505,
    deliverySec: 20, region: '25 стран, выделенные IP',
    variants: [
      { id: '1', label: '1 IP · месяц', price: 99 },
      { id: '10', label: '10 IP · месяц', sub: '77 ₽/IP', price: 770 },
      { id: '50', label: '50 IP · месяц', sub: '69 ₽/IP', price: 3450 },
    ],
    desc: 'Быстрые серверные прокси с выделенными IP.',
  },
  {
    id: 'proxy-isp', cat: 'proxy', title: 'ISP-прокси', subtitle: 'статичные резидентные',
    tile: g('#4d3a12', '#c98f27', 'ISP'), rating: 4.7, reviews: 217,
    deliverySec: 30, region: 'США и Европа',
    variants: [
      { id: '1', label: '1 IP · месяц', price: 240 },
      { id: '10', label: '10 IP · месяц', sub: '219 ₽/IP', price: 2190 },
    ],
    desc: 'Статичные IP от интернет-провайдеров — скорость датацентра, доверие резидентных.',
  },

  // ---------------- CARDS ----------------
  {
    id: 'card-virtual', cat: 'cards', title: 'Виртуальная карта Mastercard', subtitle: 'для зарубежных оплат',
    tile: g('#1c2336', '#0e1220', 'MC'), rating: 4.8, reviews: 1360, popular: true, badge: 'Выпуск ~2 мин',
    deliverySec: 120, region: 'Иностранный BIN · Apple Pay / Google Pay',
    variants: [{ id: 'issue', label: 'Выпуск карты', sub: 'обслуживание 450 ₽/мес', price: 990 }],
    bullets: [
      'Оплата зарубежных сервисов: подписки, реклама, магазины',
      'Пополнение с баланса Unicard, комиссия 3,5%',
      'Лимит операции до $50 000',
      'Реквизиты сразу в кабинете, карта в Apple Pay / Google Pay',
    ],
    desc: 'Виртуальная карта Mastercard с иностранным BIN — выпускается партнёрской платформой под брендом Unicard за пару минут. Пополняется с единого баланса.',
  },
]

export const productsByCat = (cat: CategoryId) => PRODUCTS.filter(p => p.cat === cat)
export const getProduct = (id: string) => PRODUCTS.find(p => p.id === id)
export const minPrice = (p: Product) => Math.min(...p.variants.map(v => v.price))

// ---------- живой фид выдач (canned) ----------
export const FEED_POOL: { title: string; icon: string; sec: number }[] = [
  { title: 'Steam Gift Card 1 000 ₽', icon: 'gift', sec: 1.8 },
  { title: 'eSIM Турция · 5 ГБ', icon: 'esim', sec: 3.2 },
  { title: 'Ключ ELDEN RING', icon: 'games', sec: 1.4 },
  { title: 'Unicard VPN · 6 мес', icon: 'vpn', sec: 0.9 },
  { title: 'Telegram Premium · 3 мес', icon: 'topup', sec: 5.1 },
  { title: 'PUBG Mobile · 325 UC', icon: 'topup', sec: 2.7 },
  { title: 'Резидентные прокси · 5 ГБ', icon: 'proxy', sec: 2.2 },
  { title: 'PlayStation Store 500 TL', icon: 'gift', sec: 2.9 },
  { title: 'eSIM Таиланд · 10 ГБ', icon: 'esim', sec: 3.8 },
  { title: 'Ключ Hollow Knight: Silksong', icon: 'games', sec: 1.6 },
  { title: 'Пополнение Steam · 500 ₽', icon: 'topup', sec: 4.4 },
  { title: 'Виртуальная карта Mastercard', icon: 'cards', sec: 94 },
  { title: 'Xbox Gift Card 500 TL', icon: 'gift', sec: 2.4 },
  { title: 'eSIM Грузия · 5 ГБ', icon: 'esim', sec: 2.8 },
  { title: 'Ключ Cyberpunk 2077 Ultimate', icon: 'games', sec: 1.7 },
  { title: 'Мобильные прокси · 30 дней', icon: 'proxy', sec: 3.5 },
]

// ---------- курсы для переводов (ЦБ + запас) ----------
export const TRANSFER_COUNTRIES: { code: string; name: string; cur: string; rate: number; fee: number }[] = [
  { code: 'ge', name: 'Грузия', cur: 'GEL', rate: 30.1, fee: 1.5 },
  { code: 'am', name: 'Армения', cur: 'AMD', rate: 0.207, fee: 1.5 },
  { code: 'kz', name: 'Казахстан', cur: 'KZT', rate: 0.156, fee: 1.5 },
  { code: 'kg', name: 'Кыргызстан', cur: 'KGS', rate: 0.93, fee: 1.5 },
  { code: 'uz', name: 'Узбекистан', cur: 'UZS', rate: 0.0064, fee: 1.5 },
  { code: 'tj', name: 'Таджикистан', cur: 'TJS', rate: 7.6, fee: 2 },
  { code: 'tr', name: 'Турция', cur: 'TRY', rate: 2.41, fee: 2 },
  { code: 'ae', name: 'ОАЭ', cur: 'AED', rate: 22.1, fee: 2 },
  { code: 'rs', name: 'Сербия', cur: 'RSD', rate: 0.86, fee: 2.5 },
  { code: 'me', name: 'Черногория', cur: 'EUR', rate: 93.4, fee: 2.5 },
  { code: 'de', name: 'Германия', cur: 'EUR', rate: 93.4, fee: 3 },
  { code: 'es', name: 'Испания', cur: 'EUR', rate: 93.4, fee: 3 },
  { code: 'it', name: 'Италия', cur: 'EUR', rate: 93.4, fee: 3 },
  { code: 'fr', name: 'Франция', cur: 'EUR', rate: 93.4, fee: 3 },
  { code: 'gb', name: 'Великобритания', cur: 'GBP', rate: 108.2, fee: 3 },
  { code: 'us', name: 'США', cur: 'USD', rate: 81.3, fee: 3 },
  { code: 'il', name: 'Израиль', cur: 'ILS', rate: 24.3, fee: 2.5 },
  { code: 'th', name: 'Таиланд', cur: 'THB', rate: 2.49, fee: 2 },
  { code: 'vn', name: 'Вьетнам', cur: 'VND', rate: 0.0033, fee: 2.5 },
  { code: 'in', name: 'Индия', cur: 'INR', rate: 0.97, fee: 2.5 },
  { code: 'cn', name: 'Китай', cur: 'CNY', rate: 11.4, fee: 2 },
  { code: 'md', name: 'Молдова', cur: 'MDL', rate: 4.6, fee: 2 },
  { code: 'by', name: 'Беларусь', cur: 'BYN', rate: 24.9, fee: 1.5 },
  { code: 'az', name: 'Азербайджан', cur: 'AZN', rate: 47.8, fee: 1.5 },
]
