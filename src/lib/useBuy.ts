import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, Variant } from '../data/products'
import { useStore } from './store'

/** Единый флоу покупки: гейт авторизации → гейт баланса → заказ → экран выдачи */
export function useBuy() {
  const { buy, setAuthOpen } = useStore()
  const nav = useNavigate()

  return useCallback((p: Product, v: Variant, target?: string) => {
    const res = buy(p, v, target)
    if (res === 'no-auth') {
      setAuthOpen(true)
      return
    }
    if (res === 'no-funds') {
      nav(`/account/topup?need=${v.price}&back=/p/${p.id}`)
      return
    }
    nav(`/order/${res.id}`)
  }, [buy, setAuthOpen, nav])
}
