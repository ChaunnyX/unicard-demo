import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, RefreshCcw, Smartphone, Monitor, Apple, Tv } from 'lucide-react'
import { useStore } from '../../lib/store'
import { CopyBtn, Qr } from '../../components/ui'

const APPS = [
  { name: 'Happ', rec: true },
  { name: 'v2rayTun' },
  { name: 'Hiddify' },
  { name: 'Clash Verge' },
]

const PLATFORMS = [
  { id: 'ios', icon: Apple, label: 'iOS', steps: ['Установите Happ из App Store', 'Нажмите «Подключить в Happ» или отсканируйте QR', 'Разрешите добавление VPN-конфигурации', 'Включите переключатель — готово'] },
  { id: 'android', icon: Smartphone, label: 'Android', steps: ['Установите v2rayTun из Google Play или RuStore', 'Нажмите «Подключить» — подписка добавится сама', 'Подтвердите запрос VPN', 'Включите — готово'] },
  { id: 'pc', icon: Monitor, label: 'Windows / macOS', steps: ['Скачайте Hiddify с официального сайта', 'Скопируйте ссылку-конфиг кнопкой ниже', 'Вставьте в приложение: New profile → Add from clipboard', 'Нажмите Connect'] },
  { id: 'tv', icon: Tv, label: 'Android TV', steps: ['Установите v2rayTun на телевизор', 'Откройте на телефоне QR — отсканируйте камерой ТВ', 'Подтвердите добавление', 'Включите — готово'] },
]

export default function VpnConnect() {
  const { id } = useParams()
  const { subs } = useStore()
  const sub = subs.find(s => s.id === id) ?? subs.find(s => s.type === 'vpn')
  const [platform, setPlatform] = useState('ios')

  if (!sub) {
    return (
      <div className="panel p-10 text-center">
        <p className="text-[14.5px] text-muted">Активной VPN-подписки нет.</p>
        <Link to="/c/vpn" className="btn-primary mt-5 inline-flex px-6 py-3 text-[14px]">Подключить</Link>
      </div>
    )
  }

  const plat = PLATFORMS.find(p => p.id === platform)!

  return (
    <div>
      <Link to="/account/subs" className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> К подпискам
      </Link>
      <h1 className="font-display text-[26px] font-bold">Подключение VPN</h1>
      <p className="mt-1.5 text-[14px] text-muted">{sub.title} · {sub.plan} · до {new Date(sub.expiresTs).toLocaleDateString('ru-RU')}</p>

      <div className="mt-6 grid gap-5 md:grid-cols-[280px_1fr] grid-cols-1">
        {/* QR + ключ */}
        <div className="panel flex flex-col items-center p-6 text-center">
          <Qr seed={sub.key} size={190} className="border border-line" />
          <p className="mt-3 text-[12.5px] leading-snug text-muted">
            Один QR — все устройства тарифа. Сканируйте из приложения.
          </p>
          <div className="mt-4 w-full">
            <code className="block truncate rounded-lg bg-paper px-3 py-2 font-mono text-[11px] text-muted">{sub.key}</code>
            <CopyBtn text={sub.key} className="mt-2 w-full justify-center" />
          </div>
          <div className="mt-4 flex w-full flex-wrap justify-center gap-1.5">
            {APPS.map(a => (
              <span key={a.name} className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                a.rec ? 'border-volt bg-volt-tint text-volt' : 'border-line text-muted hover:border-volt/40'
              }`}>
                {a.name}{a.rec && ' · советуем'}
              </span>
            ))}
          </div>
        </div>

        {/* шаги по платформам */}
        <div className="panel p-6">
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  platform === p.id ? 'bg-ink text-white' : 'border border-line text-muted hover:text-ink'
                }`}>
                <p.icon className="h-3.5 w-3.5" /> {p.label}
              </button>
            ))}
          </div>
          <ol className="mt-5 space-y-3.5">
            {plat.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px]">
                <span className="grad-volt flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold text-white num">{i + 1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-paper p-4 text-[13px] leading-relaxed text-muted">
            <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-volt" />
            Если оператор обновит фильтры и адрес перестанет работать — система подставит резервный
            автоматически. Ничего переустанавливать не нужно: подписка обновится сама.
          </div>
        </div>
      </div>
    </div>
  )
}
