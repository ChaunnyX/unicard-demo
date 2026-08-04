import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'

/** Уведомление об обработке cookie (152-ФЗ): фиксирует согласие на аналитику. */
export default function CookieNotice() {
  const [hidden, setHidden] = useState(() => localStorage.getItem('uc-cookie-ok') === '1')
  if (hidden) return null
  return (
    <div
      className="panel fixed bottom-4 left-4 z-[55] flex max-w-sm items-start gap-3 p-4 max-sm:right-4"
      style={{ animation: 'rise 400ms cubic-bezier(0.2,0,0,1) both', animationDelay: '1.2s' }}
    >
      <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-volt" />
      <div className="min-w-0">
        <p className="text-[12.5px] leading-relaxed text-muted">
          Используем cookie для работы сервиса и обезличенной аналитики. Продолжая, вы
          соглашаетесь с{' '}
          <Link to="/legal/privacy" className="text-volt hover:underline">политикой конфиденциальности</Link>.
        </p>
        <button
          onClick={() => { localStorage.setItem('uc-cookie-ok', '1'); setHidden(true) }}
          className="btn-dark mt-2.5 px-4 py-1.5 text-[12.5px]"
        >
          Понятно
        </button>
      </div>
    </div>
  )
}
