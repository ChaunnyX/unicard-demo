import { Link } from 'react-router-dom'
import { Send, Zap, ShieldCheck, Wallet } from 'lucide-react'
import { useStore } from '../lib/store'
import { Modal } from './ui'

export default function AuthModal() {
  const { authOpen, setAuthOpen, signIn } = useStore()
  return (
    <Modal open={authOpen} onClose={() => setAuthOpen(false)}>
      <div className="grad-volt mx-auto flex h-12 w-12 items-center justify-center rounded-2xl shadow-volt">
        <Zap className="h-6 w-6 text-white" fill="currentColor" strokeWidth={0} />
      </div>
      <h3 className="mt-4 text-center font-display text-[22px] font-semibold">Вход в Unicard</h3>
      <p className="mt-1.5 text-center text-[14px] text-muted">
        Без паролей и анкет — аккаунтом становится ваш Telegram.
      </p>

      <button onClick={signIn} className="btn mt-6 w-full gap-2.5 bg-[#2AABEE] py-3.5 text-[15px] font-semibold text-white hover:brightness-105">
        <Send className="h-5 w-5" /> Войти через Telegram
      </button>
      <button onClick={signIn} className="btn-ghost mt-2.5 w-full py-3 text-[14px] text-muted">
        Войти по e-mail
      </button>

      <p className="mt-3 text-center text-[11.5px] leading-relaxed text-muted">
        Входя, вы принимаете{' '}
        <Link to="/legal/offer" onClick={() => setAuthOpen(false)} className="text-volt hover:underline">пользовательское соглашение</Link>
        {' '}и{' '}
        <Link to="/legal/privacy" onClick={() => setAuthOpen(false)} className="text-volt hover:underline">политику конфиденциальности</Link>
      </p>

      <div className="mt-5 space-y-2.5 border-t border-line pt-5">
        {[
          { icon: Wallet, text: 'Единый баланс: пополнил один раз — покупаешь всё' },
          { icon: Zap, text: 'Заказы и коды хранятся в кабинете' },
          { icon: ShieldCheck, text: 'Уведомления о выдаче — прямо в Telegram' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-[13px] text-muted">
            <Icon className="h-4 w-4 shrink-0 text-volt" /> {text}
          </div>
        ))}
      </div>
    </Modal>
  )
}
