import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { CATEGORIES, productsByCat, minPrice } from '../data/products'
import type { CategoryId, Product } from '../data/products'
import ProductCard from '../components/ProductCard'
import { Crumbs, Reveal } from '../components/ui'
import EsimCatalog from '../components/catalog/EsimCatalog'
import VpnCatalog from '../components/catalog/VpnCatalog'
import ProxyCatalog from '../components/catalog/ProxyCatalog'
import CardsCatalog from '../components/catalog/CardsCatalog'
import TransfersCatalog from '../components/catalog/TransfersCatalog'

type Filter = 'all' | 'sale' | 'new' | 'top'
type Sort = 'pop' | 'cheap' | 'exp'

function GenericCatalog({ cat }: { cat: CategoryId }) {
  const meta = CATEGORIES.find(c => c.id === cat)!
  const all = productsByCat(cat)
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('pop')

  const list = useMemo(() => {
    let l: Product[] = [...all]
    if (filter === 'sale') l = l.filter(p => p.discount)
    if (filter === 'new') l = l.filter(p => p.badge === 'Новинка')
    if (filter === 'top') l = l.filter(p => p.popular)
    if (sort === 'cheap') l.sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'exp') l.sort((a, b) => minPrice(b) - minPrice(a))
    return l
  }, [all, filter, sort])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: `Все · ${all.length}` },
    { id: 'top', label: 'Хиты' },
    { id: 'sale', label: 'Скидки' },
    ...(cat === 'games' ? [{ id: 'new' as Filter, label: 'Новинки' }] : []),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Crumbs items={[{ label: meta.name }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] font-bold tracking-tight md:text-[40px]">{meta.name}</h1>
          <p className="mt-2 max-w-xl text-[15px] text-muted">{meta.blurb}.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-ok-tint px-4 py-2 font-mono text-[12px] font-medium text-ok">
          <Zap className="h-3.5 w-3.5" /> {meta.auto}
        </span>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`cursor-pointer rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${
                filter === f.id ? 'bg-ink text-white' : 'bg-surface border border-line text-muted hover:text-ink'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as Sort)}
          className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-[13.5px] font-medium text-muted outline-none">
          <option value="pop">Сначала популярные</option>
          <option value="cheap">Сначала дешевле</option>
          <option value="exp">Сначала дороже</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1">
        {list.map((p, i) => (
          cat === 'games'
            ? <ProductCard key={p.id + filter + sort} p={p} dealIndex={i} />
            : <Reveal key={p.id} delay={(i % 4) * 50}><ProductCard p={p} /></Reveal>
        ))}
      </div>
      {list.length === 0 && (
        <div className="panel mt-6 p-10 text-center text-muted">По этому фильтру пока пусто — загляните в «Все».</div>
      )}
    </div>
  )
}

export default function Catalog() {
  const { cat } = useParams<{ cat: CategoryId }>()
  switch (cat) {
    case 'esim': return <EsimCatalog />
    case 'vpn': return <VpnCatalog />
    case 'proxy': return <ProxyCatalog />
    case 'cards': return <CardsCatalog />
    case 'transfers': return <TransfersCatalog />
    case 'gift':
    case 'games':
    case 'topup':
      return <GenericCatalog cat={cat} />
    default:
      return <GenericCatalog cat="gift" />
  }
}
