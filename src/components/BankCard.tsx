import { useRef, useState } from 'react'
import { Zap } from 'lucide-react'

/** Виртуальная карта Unicard: градиент + 3D-tilt за курсором + блик */
export default function BankCard({
  last4 = '••••', holder = 'UNICARD MEMBER', exp = '••/••', tilt = true, className = '',
}: { last4?: string; holder?: string; exp?: string; tilt?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ rx: 0, ry: 0 })

  return (
    <div
      ref={ref}
      className={`relative aspect-[1.586/1] w-full max-w-[400px] select-none ${className}`}
      style={{ perspective: '900px' }}
      onMouseMove={e => {
        if (!tilt || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        setT({ rx: -py * 14, ry: px * 16 })
      }}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-2xl p-5 text-white shadow-lift md:p-6"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transition: 'transform 300ms cubic-bezier(0.2,0,0,1)',
          transformStyle: 'preserve-3d',
          backgroundImage: 'linear-gradient(125deg, #16204d 0%, #1e3fd1 45%, #0090ff 80%, #00c6ff 100%)',
        }}
      >
        {/* блик */}
        <div className="pointer-events-none absolute inset-y-0 w-1/3 bg-white/20 blur-xl" style={{ animation: 'shine 4.5s ease-in-out infinite' }} />
        {/* узор */}
        <div className="pointer-events-none absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 85% 15%, #fff 1px, transparent 1.4px)', backgroundSize: '22px 22px' }} />

        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="flex items-center gap-2 font-display text-[17px] font-bold">
              <Zap className="h-4.5 w-4.5" fill="currentColor" strokeWidth={0} /> Unicard
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">virtual</span>
          </div>

          {/* чип */}
          <div className="h-8 w-11 rounded-md border border-white/40 bg-gradient-to-br from-amber-200/80 to-amber-400/70"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)' }} />

          <div>
            <div className="font-mono text-[19px] font-medium tracking-[0.14em] md:text-[21px]">
              5321&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;{last4}
            </div>
            <div className="mt-2.5 flex items-end justify-between">
              <div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/55">card holder</div>
                <div className="font-mono text-[12.5px] tracking-wider">{holder}</div>
              </div>
              <div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/55">exp</div>
                <div className="font-mono text-[12.5px] tracking-wider">{exp}</div>
              </div>
              {/* mastercard */}
              <div className="flex">
                <span className="h-7 w-7 rounded-full bg-[#EB001B]/90" />
                <span className="-ml-3 h-7 w-7 rounded-full bg-[#F79E1B]/90" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
