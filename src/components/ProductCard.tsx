import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { minPrice } from '../data/products'
import { rub } from '../lib/format'
import { DeliveryBadge, Rating, Tile } from './ui'

export default function ProductCard({ p, dealIndex }: { p: Product; dealIndex?: number }) {
  const price = minPrice(p)
  const firstOld = p.variants.find(v => v.price === price)?.old
  return (
    <Link
      to={`/p/${p.id}`}
      className="panel panel-hover group relative block overflow-hidden"
      style={dealIndex !== undefined ? { animation: `deal-in 560ms cubic-bezier(0.2,0,0,1) both`, animationDelay: `${dealIndex * 60}ms`, ['--deal-rot' as string]: `${(dealIndex % 2 ? 1 : -1) * 3}deg` } : undefined}
    >
      {/* градиент-кант при наведении */}
      <span className="grad-volt pointer-events-none absolute inset-x-0 top-0 z-10 h-[2.5px] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="relative aspect-[2.15/1] overflow-hidden">
        {p.img ? (
          <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
        ) : p.flag ? (
          <div className="relative h-full w-full bg-gradient-to-br from-[#eef2ff] to-[#dcf3ff]">
            <img src={p.flag} alt="" className="absolute left-1/2 top-1/2 h-14 w-20 -translate-x-1/2 -translate-y-1/2 rounded-md object-cover shadow-soft transition-transform duration-300 group-hover:scale-110" />
          </div>
        ) : p.tile ? (
          <Tile {...p.tile} className="h-full w-full" markClass="text-[24px]" />
        ) : null}
        {p.badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${p.discount ? 'bg-hot' : 'bg-ink/80 backdrop-blur'}`}>
            {p.badge}
          </span>
        )}
        <DeliveryBadge sec={p.deliverySec} className="absolute right-3 top-3 bg-white/90 backdrop-blur" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold leading-snug">{p.title}</div>
            {p.subtitle && <div className="mt-0.5 truncate text-[12.5px] text-muted">{p.subtitle}</div>}
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="num text-[17px] font-bold">{p.variants.length > 1 ? 'от ' : ''}{rub(price)}</span>
              {firstOld && <span className="num text-[13px] text-muted line-through">{rub(firstOld)}</span>}
            </div>
            <Rating value={p.rating} reviews={p.reviews} className="mt-1 text-muted" />
          </div>
          <span className="btn-primary px-4 py-2 text-[13px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-lg:opacity-100">
            Купить
          </span>
        </div>
      </div>
    </Link>
  )
}
