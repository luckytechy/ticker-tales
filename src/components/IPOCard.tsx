import Link from 'next/link'
import { formatDateRange } from '@/lib/utils'
import { IPO_STATUS_LABELS, type IPODoc } from '@/lib/payload'

const STATUS_STYLES: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700', open: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-500', listed: 'bg-amber/10 text-amber-dark',
}

export function IPOCard({ ipo }: { ipo: IPODoc }) {
  return (
    <Link href={`/ipo-watch/${ipo.slug}`} className="group flex flex-col bg-white rounded-xl border border-slate-100 hover:border-amber/40 hover:shadow-lg p-5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-navy font-bold text-lg leading-snug group-hover:text-amber-dark transition-colors">{ipo.companyName}</h3>
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[ipo.status] ?? 'bg-slate-100 text-slate-500'}`}>{IPO_STATUS_LABELS[ipo.status] ?? ipo.status}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        <div><dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">Dates</dt><dd className="text-navy-700 font-medium mt-0.5">{formatDateRange(ipo.ipoOpenDate, ipo.ipoCloseDate)}</dd></div>
        <div><dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">Price Band</dt><dd className="text-navy-700 font-medium mt-0.5">{ipo.priceBand}</dd></div>
        <div><dt className="text-xs text-slate-400 uppercase tracking-wide font-medium">Issue Size</dt><dd className="text-navy-700 font-medium mt-0.5">{ipo.issueSize}</dd></div>
      </dl>
      {ipo.verdict && (
        <div className="mt-auto pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Verdict</p>
          <p className="text-sm font-medium text-amber-dark">{ipo.verdict}</p>
        </div>
      )}
    </Link>
  )
}
