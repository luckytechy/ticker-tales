import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { StoryCard } from '@/components/StoryCard'
import { IPOCard } from '@/components/IPOCard'
import { calculateReadTime } from '@/lib/utils'
import type { StoryDoc, IPODoc } from '@/lib/payload'

export const revalidate = 60

async function getFeaturedStory(): Promise<StoryDoc | null> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'stories',
    where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
    sort: '-publishDate', limit: 1, depth: 1,
  })
  return (result.docs[0] as unknown as StoryDoc) ?? null
}

async function getLatestStories(): Promise<StoryDoc[]> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    sort: '-publishDate', limit: 3, depth: 1,
  })
  return result.docs as unknown as StoryDoc[]
}

async function getActiveIPOs(): Promise<IPODoc[]> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'ipo-watch',
    where: { status: { in: ['open', 'upcoming'] } },
    sort: 'ipoOpenDate', limit: 6, depth: 1,
  })
  return result.docs as unknown as IPODoc[]
}

export default async function HomePage() {
  const [featured, latestStories, ipos] = await Promise.all([getFeaturedStory(), getLatestStories(), getActiveIPOs()])

  return (
    <>
      {featured ? (
        <section className="bg-navy text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-amber/10 text-amber text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5">Featured Story</span>
                <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">{featured.title}</h1>
                <p className="text-slate-300 text-lg leading-relaxed mb-3">{featured.excerpt}</p>
                <p className="text-slate-400 text-sm mb-6">{featured.companyName} · {featured.companyTicker} · {calculateReadTime(featured.content)} min read</p>
                <Link href={`/stories/${featured.slug}`} className="inline-flex items-center gap-2 bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition-colors">
                  Read Story
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
              {featured.coverImage?.url && (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={featured.coverImage.sizes?.hero?.url ?? featured.coverImage.url} alt={featured.coverImage.alt ?? featured.title} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-navy text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4">Indian Markets, <span className="text-amber">Plain English.</span></h1>
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">Stories about the companies and founders behind India&apos;s stock market. No jargon. Just context.</p>
            <Link href="/stories" className="inline-flex items-center gap-2 bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition-colors">Browse Stories</Link>
          </div>
        </section>
      )}

      {latestStories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">Latest Stories</h2>
            <Link href="/stories" className="text-amber text-sm font-semibold hover:text-amber-dark">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestStories.map((story, i) => <StoryCard key={story.id} story={story} priority={i === 0} />)}
          </div>
        </section>
      )}

      {ipos.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-navy">IPO Watch</h2>
                <p className="text-slate-500 text-sm mt-1">Open and upcoming IPOs, explained simply.</p>
              </div>
              <Link href="/ipo-watch" className="text-amber text-sm font-semibold hover:text-amber-dark">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ipos.map((ipo) => <IPOCard key={ipo.id} ipo={ipo} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
