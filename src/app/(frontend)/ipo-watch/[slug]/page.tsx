import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload, IPO_STATUS_LABELS, type IPODoc } from '@/lib/payload'
import { formatDate, formatDateRange, siteUrl } from '@/lib/utils'
import { RichTextRenderer } from '@/components/RichTextRenderer'

export const revalidate = 60
type Props = { params: { slug: string } }

async function getIPO(slug: string): Promise<IPODoc | null> {
  const payload = await getPayload()
  const result = await payload.find({ collection: 'ipo-watch', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  return (result.docs[0] as unknown as IPODoc) ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const result = await payload.find({ collection: 'ipo-watch', limit: 1000, depth: 0 })
  return result.docs.map((doc: any) => ({ slug: doc.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ipo = await getIPO(params.slug)
  if (!ipo) return {}
  const title = ipo.seoTitle || `${ipo.companyName} IPO — Ticker Tales`
  const description = ipo.seoDescription || `${ipo.companyName} IPO: ${ipo.priceBand} · ${ipo.verdict}`
  return { title, description, openGraph: { title, description, images: ipo.coverImage?.url ? [{ url: ipo.coverImage.url, width: 1200, height: 630 }] : [] }, alternates: { canonical: `${siteUrl()}/ipo-watch/${ipo.slug}` } }
}

const STATUS_STYLES: Record<string, string> = { upcoming: 'bg-blue-100 text-blue-700', open: 'bg-green-100 text-green-700', closed: 'bg-slate-100 text-slate-500', listed: 'bg-amber/10 text-amber-dark' }

export default async function IPOPage({ params }: Props) {
  const ipo = await getIPO(params.slug)
  if (!ipo) notFound()
  const shareUrl = `${siteUrl()}/ipo-watch/${ipo.slug}`
  const shareText = encodeURIComponent(`${ipo.companyName} IPO — ${ipo.verdict}`)

  return (
    <>
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className={`font-semibold px-3 py-0.5 rounded-full text-xs ${STATUS_STYLES[ipo.status] ?? 'bg-slate-100 text-slate-500'}`}>{IPO_STATUS_LABELS[ipo.status] ?? ipo.status}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3 mt-5">{ipo.companyName} IPO</h1>
          {ipo.verdict && <p className="text-amber text-lg font-semibold mb-4">{ipo.verdict}</p>}
          <p className="text-slate-400 text-sm">{formatDateRange(ipo.ipoOpenDate, ipo.ipoCloseDate)}</p>
        </div>
      </section>
      {ipo.coverImage?.url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 mb-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
            <Image src={ipo.coverImage.url} alt={ipo.coverImage.alt ?? ipo.companyName} fill priority className="object-cover" sizes="(max-width: 1200px) 100vw, 896px" />
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-slate-50 rounded-2xl p-6 mb-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div><p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Open Date</p><p className="text-navy font-bold">{formatDate(ipo.ipoOpenDate)}</p></div>
          <div><p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Close Date</p><p className="text-navy font-bold">{formatDate(ipo.ipoCloseDate)}</p></div>
          <div><p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Price Band</p><p className="text-navy font-bold">{ipo.priceBand}</p></div>
          <div><p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Issue Size</p><p className="text-navy font-bold">{ipo.issueSize}</p></div>
        </div>
        {ipo.verdict && <div className="border-l-4 border-amber bg-amber/5 rounded-r-xl px-6 py-4 mb-10"><p className="text-xs text-amber-dark uppercase tracking-wide font-bold mb-1">Our Verdict</p><p className="text-navy font-semibold text-lg">{ipo.verdict}</p></div>}
        <RichTextRenderer content={ipo.summary} />
        <div className="border-t border-slate-100 pt-8 mt-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Share this IPO breakdown</p>
          <div className="flex flex-wrap gap-3">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#0077B5] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">LinkedIn</a>
            <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Twitter / X</a>
            <a href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  )
}
