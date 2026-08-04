import { memo } from 'react'
import type { ReactNode } from 'react'
import mapData from '../data/mapPins.json'
import { asset } from '../lib/asset'

const { viewBox, pins } = mapData as { viewBox: string; pins: Record<string, { x: number; y: number }> }

export interface MapPin { key: string; color?: string; big?: boolean; label?: string }
export interface MapArc { from: string; to: string; color?: string }

/**
 * Точечная карта мира с пинами и анимированными дугами.
 * Подложка — сгенерированный dotted-map SVG, поверх — свой SVG в тех же координатах.
 */
/* memo: подложка тяжёлая (тысячи точек + SMIL-пульсы) — не должна
   перерисовываться из-за чужих state-изменений на странице */
export default memo(function WowMap({
  mapPins = [], arcs = [], className = '', dark = false, children,
}: { mapPins?: MapPin[]; arcs?: MapArc[]; className?: string; dark?: boolean; children?: ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={asset('/img/maps/world.svg')}
        alt=""
        draggable={false}
        className="h-full w-full select-none object-contain"
        style={dark ? { filter: 'invert(0.82) brightness(0.62) sepia(0.2) hue-rotate(190deg)' } : undefined}
      />
      <svg viewBox={viewBox} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        {arcs.map((a, i) => {
          const f = pins[a.from]; const t = pins[a.to]
          if (!f || !t) return null
          const mx = (f.x + t.x) / 2
          const my = Math.min(f.y, t.y) - Math.abs(t.x - f.x) * 0.22 - 3
          const d = `M ${f.x} ${f.y} Q ${mx} ${my} ${t.x} ${t.y}`
          const col = a.color ?? '#2E5BFF'
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={col} strokeOpacity={0.25} strokeWidth={0.45} />
              <path
                d={d} fill="none" stroke={col} strokeWidth={0.45} strokeLinecap="round"
                strokeDasharray="3 21" style={{ animation: `dash-flow 1.6s linear infinite`, animationDelay: `${i * 0.35}s` }}
              />
            </g>
          )
        })}
        {mapPins.map((p, i) => {
          const c = pins[p.key]
          if (!c) return null
          const col = p.color ?? '#2E5BFF'
          const r = p.big ? 1.1 : 0.75
          return (
            <g key={p.key + i}>
              <circle cx={c.x} cy={c.y} r={r * 2.4} fill={col} opacity={0.35}>
                <animate attributeName="r" values={`${r};${r * 3.2}`} dur="1.8s" begin={`${i * 0.22}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0" dur="1.8s" begin={`${i * 0.22}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={c.x} cy={c.y} r={r} fill={col} stroke={dark ? '#0b1020' : '#fff'} strokeWidth={0.28} />
              {p.label && (
                <text x={c.x} y={c.y - 1.8} textAnchor="middle" fontSize={2.1} fontWeight={700}
                  fill={dark ? '#fff' : '#0e1220'} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {p.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      {children}
    </div>
  )
})

export const hasPin = (key: string) => key in pins
