import type { Metadata } from 'next'
import { getPayload, IPO_STATUS_LABELS, type IPODoc } from '@/lib/payload'
import { IPOCard } from '@/components/IPOCard'

export const revalidate = 60
export const metadata: Metadata = { title: 'IPO Watch', description: 'Upcoming and open Indian IPOs explained in plain English.' }

const FILTERS = [
  { label: 'All', value: 'all' }, { label: 'Open Now', value: 'open' },
  { label: 'Upcoming', value: 'upcoming' }, { label: 'Closed', value: 'closed' }, { label: 'Listed', value: 'listed' },
] as const

type Props = { searchParams: { status?: string } }

export default async function IPOWatchPage({ searchParams }: Props) {
  const filter = searchParams.status ?? 'all'
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'ipo-watch',
    where: filter !== 'all' ? { status: { equals: filter } } : {},
    sort: 'ipoOpenDate', limit: 50, depth: 1,
  })
  const ipos = result.docs as unknown as IPODoc[]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-navy mb-3">IPO Watch</h1>
        <p className="text-slate-500 text-lg">Every IPO hitting the market — who&apos;s selling, what it&apos;s worth, and whether it&apos;s worth your money.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(({ label, value }) => (
          <a key={value} href={value === 'all' ? '/ipo-watch' : `/ipo-watch?status=${value}`}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${filter === value ? 'bg-navy text-white border-navy' : 'border-slate-200 text-slate-600 hover:border-amber hover:text-amber'}`}>
            {label}
          </a>
        ))}
      </div>
      {ipos.length === 0 ? (
        <p className="text-slate-400 text-center py-24">No {filter !== 'all' ? IPO_STATUS_LABELS[filter]?.toLowerCase() : ''} IPOs right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{ipos.map((ipo) => <IPOCard key={ipo.id} ipo={ipo} />)}</div>
      )}
    </div>
  )
}
