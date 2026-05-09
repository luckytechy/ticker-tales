import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'
import { siteUrl } from '@/lib/utils'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()
  const base = siteUrl()

  const [storiesResult, iposResult] = await Promise.all([
    payload.find({ collection: 'stories', where: { status: { equals: 'published' } }, limit: 1000, depth: 0 }),
    payload.find({ collection: 'ipo-watch', limit: 1000, depth: 0 }),
  ])

  const storyEntries: MetadataRoute.Sitemap = (storiesResult.docs as any[]).map((doc) => ({
    url: `${base}/stories/${doc.slug}`,
    lastModified: new Date(doc.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const ipoEntries: MetadataRoute.Sitemap = (iposResult.docs as any[]).map((doc) => ({
    url: `${base}/ipo-watch/${doc.slug}`,
    lastModified: new Date(doc.updatedAt),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/stories`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/ipo-watch`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...storyEntries,
    ...ipoEntries,
  ]
}
