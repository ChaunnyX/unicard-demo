import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Variant } from '../data/products'
import { genCode, genOrderId } from './format'

export interface Order {
  id: string
  ts: number
  productId: string
  title: string
  variantLabel: string
  cat: string
  price: number
  code: string
  status: 'processing' | 'done'
  deliverMs?: number
  target?: string // логин/ID/номер, если вводили
}

export interface Sub {
  id: string
  type: 'vpn' | 'proxy'
  title: string
  plan: string
  devices?: number
  startedTs: number
  expiresTs: number
  key: string
}

export interface IssuedCard {
  id: string
  last4: string
  exp: string
  holder: string
  ts: number
}

export interface TransferReq {
  id: string
  ts: number
  country: string
  amountRub: number
  amountOut: number
  cur: string
  status: 'review' | 'done'
}

interface User { name: string; username: string }

interface State {
  user: User | null
  balance: number
  orders: Order[]
  subs: Sub[]
  cards: IssuedCard[]
  transfers: TransferReq[]
}

interface Toast { id: number; text: string; kind: 'ok' | 'info' }

interface Ctx extends State {
  authOpen: boolean
  setAuthOpen: (v: boolean) => void
  signIn: () => void
  signOut: () => void
  topUp: (amount: number) => void
  buy: (p: Product, v: Variant, target?: string) => Order | 'no-auth' | 'no-funds'
  markDelivered: (orderId: string, ms: number) => void
  renewSub: (subId: string, months: number, price: number) => boolean
  issueCard: () => IssuedCard | 'no-funds'
  createTransfer: (country: string, amountRub: number, amountOut: number, cur: string) => TransferReq
  toasts: Toast[]
  toast: (text: string, kind?: 'ok' | 'info') => void
}

const KEY = 'unicard-demo-v1'
const day = 86400000

const seedState = (): State => {
  const now = Date.now()
  return {
    user: { name: 'Владимир', username: '@vladimir' },
    balance: 1250,
    orders: [
      {
        id: 'UC-482913', ts: now - 2 * day, productId: 'gift-steam-ru', title: 'Steam Gift Card',
        variantLabel: '1 000 ₽', cat: 'gift', price: 1090, code: genCode(), status: 'done', deliverMs: 1800,
      },
      {
        id: 'UC-473301', ts: now - 9 * day, productId: 'esim-tr', title: 'eSIM Турция',
        variantLabel: '5 ГБ · 30 дней', cat: 'esim', price: 1090, code: 'LPA:1$rsp.unicard.app$TR-8F2K1', status: 'done', deliverMs: 3200,
      },
    ],
    subs: [
      {
        id: 'sub-vpn-1', type: 'vpn', title: 'Unicard VPN Базовый', plan: '1 месяц', devices: 3,
        startedTs: now - 7 * day, expiresTs: now + 23 * day,
        key: 'vless://a3f9c2e1-demo@ru1.unicard.app:443?security=reality#Unicard',
      },
    ],
    cards: [],
    transfers: [],
  }
}

const emptyState: State = { user: null, balance: 0, orders: [], subs: [], cards: [], transfers: [] }

const load = (): State => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as State
  } catch { /* повреждённый стейт — начнём с чистого */ }
  return emptyState
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)
  const [authOpen, setAuthOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const toast = useCallback((text: string, kind: 'ok' | 'info' = 'ok') => {
    const id = ++toastId.current
    setToasts(t => [...t, { id, text, kind }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600)
  }, [])

  const signIn = useCallback(() => {
    setState(s => (s.user ? s : seedState()))
    setAuthOpen(false)
    toast('Вы вошли через Telegram')
  }, [toast])

  const signOut = useCallback(() => {
    setState(emptyState)
    localStorage.removeItem(KEY)
  }, [])

  const topUp = useCallback((amount: number) => {
    setState(s => ({ ...s, balance: s.balance + amount }))
  }, [])

  const buy = useCallback((p: Product, v: Variant, target?: string): Order | 'no-auth' | 'no-funds' => {
    if (!state.user) return 'no-auth'
    if (state.balance < v.price) return 'no-funds'
    const order: Order = {
      id: genOrderId(), ts: Date.now(), productId: p.id, title: p.title,
      variantLabel: v.label, cat: p.cat, price: v.price,
      code: p.cat === 'esim' ? `LPA:1$rsp.unicard.app$${(p.mapKey ?? 'XX').toUpperCase()}-${genCode(1, 5)}` : genCode(),
      status: 'processing', target,
    }
    setState(s => {
      const next: State = { ...s, balance: s.balance - v.price, orders: [order, ...s.orders] }
      if (p.cat === 'vpn') {
        const months = v.id === '12m' ? 12 : v.id === '6m' ? 6 : 1
        next.subs = [{
          id: 'sub-' + order.id, type: 'vpn', title: p.title, plan: v.label,
          devices: p.id === 'vpn-family' ? 7 : 3,
          startedTs: Date.now(), expiresTs: Date.now() + months * 30 * day,
          key: `vless://${genCode(1, 8).toLowerCase()}-demo@ru1.unicard.app:443?security=reality#Unicard`,
        }, ...s.subs]
      }
      if (p.cat === 'proxy' && (v.id === '1w' || v.id === '1m')) {
        const days = v.id === '1w' ? 7 : 30
        next.subs = [{
          id: 'sub-' + order.id, type: 'proxy', title: p.title, plan: v.label,
          startedTs: Date.now(), expiresTs: Date.now() + days * day,
          key: `http://uc${genCode(1, 4).toLowerCase()}:${genCode(1, 6).toLowerCase()}@proxy.unicard.app:8000`,
        }, ...s.subs]
      }
      return next
    })
    return order
  }, [state.user, state.balance])

  const markDelivered = useCallback((orderId: string, ms: number) => {
    setState(s => ({
      ...s,
      orders: s.orders.map(o => (o.id === orderId && o.status !== 'done' ? { ...o, status: 'done' as const, deliverMs: ms } : o)),
    }))
  }, [])

  const renewSub = useCallback((subId: string, months: number, price: number): boolean => {
    if (state.balance < price) return false
    setState(s => ({
      ...s,
      balance: s.balance - price,
      subs: s.subs.map(x => (x.id === subId ? { ...x, expiresTs: Math.max(x.expiresTs, Date.now()) + months * 30 * day } : x)),
    }))
    toast('Подписка продлена')
    return true
  }, [state.balance, toast])

  const issueCard = useCallback((): IssuedCard | 'no-funds' => {
    if (state.balance < 990) return 'no-funds'
    const card: IssuedCard = {
      id: 'card-' + Date.now(),
      last4: String(Math.floor(1000 + Math.random() * 9000)),
      exp: '08/29',
      holder: 'UNICARD MEMBER',
      ts: Date.now(),
    }
    setState(s => ({ ...s, balance: s.balance - 990, cards: [card, ...s.cards] }))
    return card
  }, [state.balance])

  const createTransfer = useCallback((country: string, amountRub: number, amountOut: number, cur: string): TransferReq => {
    const req: TransferReq = { id: 'TR-' + Math.floor(10000 + Math.random() * 90000), ts: Date.now(), country, amountRub, amountOut, cur, status: 'review' }
    setState(s => ({ ...s, transfers: [req, ...s.transfers] }))
    return req
  }, [])

  const value = useMemo<Ctx>(() => ({
    ...state, authOpen, setAuthOpen, signIn, signOut, topUp, buy, markDelivered,
    renewSub, issueCard, createTransfer, toasts, toast,
  }), [state, authOpen, signIn, signOut, topUp, buy, markDelivered, renewSub, issueCard, createTransfer, toasts, toast])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore(): Ctx {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}
