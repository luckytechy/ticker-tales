import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload, CATEGORY_LABELS, type StoryDoc } from '@/lib/payload'
import { calculateReadTime, formatDate, siteUrl } from '@/lib/utils'
import { StoryCard } from '@/components/StoryCard'
import { RichTextRenderer } from '@/components/RichTextRenderer'

export const revalidate = 60
type Props = { params: { slug: string } }

async function getStory(slug: string): Promise<StoryDoc | null> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'stories',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    limit: 1, depth: 1,
  })
  return (result.docs[0] as unknown as StoryDoc) ?? null
}

async function getRelatedStories(category: string, excludeId: string): Promise<StoryDoc[]> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'stories',
    where: { and: [{ status: { equals: 'published' } }, { category: { equals: category } }, { id: { not_equals: excludeId } }] },
    sort: '-publishDate', limit: 3, depth: 1,
  })
  return result.docs as unknown as StoryDoc[]
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const result = await payload.find({ collection: 'stories', where: { status: { equals: 'published' } }, limit: 1000, depth: 0 })
  return result.docs.map((doc: any) => ({ slug: doc.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await getStory(params.slug)
  if (!story) return {}
  const title = story.seoTitle || story.title
  const description = story.seoDescription || story.excerpt
  const image = story.ogImage?.url ?? story.coverImage?.url
  return {
    title, description,
    openGraph: { title, description, type: 'article', publishedTime: story.publishDate ?? story.createdAt, images: image ? [{ url: image, width: 1200, height: 630 }] : [] },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : [] },
    alternates: { canonical: `${siteUrl()}/stories/${story.slug}` },
  }
}

export default async function StoryPage({ params }: Props) {
  const story = await getStory(params.slug)
  if (!story) notFound()
  const relatedStories = await getRelatedStories(story.category, story.id)
  const readTime = calculateReadTime(story.content)
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: story.title, description: story.excerpt, image: story.coverImage?.url,
    datePublished: story.publishDate ?? story.createdAt, dateModified: story.updatedAt,
    author: { '@type': 'Organization', name: 'Ticker Tales' },
    publisher: { '@type': 'Organization', name: 'Ticker Tales', logo: { '@type': 'ImageObject', url: `${siteUrl()}/logo.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl()}/stories/${story.slug}` },
  }
  const shareUrl = `${siteUrl()}/stories/${story.slug}`
  const shareText = encodeURIComponent(`${story.title} — ${story.excerpt}`)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-navy text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-5 text-sm">
            <span className="bg-amber/10 text-amber font-semibold px-3 py-0.5 rounded-full">{CATEGORY_LABELS[story.category]}</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber font-mono font-bold">{story.companyTicker}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">{readTime} min read</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">{story.title}</h1>
          <p className="text-slate-300 text-xl leading-relaxed mb-6">{story.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="font-medium text-slate-300">{story.companyName}</span>
            {story.publishDate && <><span>·</span><span>{formatDate(story.publishDate)}</span></>}
          </div>
        </div>
      </section>
      {story.coverImage?.url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 mb-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
            <Image src={story.coverImage.sizes?.hero?.url ?? story.coverImage.url} alt={story.coverImage.alt ?? story.title} fill priority className="object-cover" sizes="(max-width: 1200px) 100vw, 896px" />
          </div>
        </div>
      )}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <RichTextRenderer content={story.content} />
      </article>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
        <div className="border-t border-slate-100 pt-8">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Share this story</p>
          <div className="flex flex-wrap gap-3">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#0077B5] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">LinkedIn</a>
            <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Twitter / X</a>
            <a href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">WhatsApp</a>
          </div>
        </div>
      </div>
      {relatedStories.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-navy mb-8">Related Stories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedStories.map((s) => <StoryCard key={s.id} story={s} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
