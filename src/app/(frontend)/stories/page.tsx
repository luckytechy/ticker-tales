import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { StoryCard } from '@/components/StoryCard'
import type { StoryDoc } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Long-form stories about Indian companies, founders, and the markets.',
}

const PAGE_SIZE = 6
type Props = { searchParams: { page?: string } }

export default async function StoriesPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    sort: '-publishDate', limit: PAGE_SIZE, page, depth: 1,
  })
  const stories = result.docs as unknown as StoryDoc[]
  const totalPages = result.totalPages

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-navy mb-3">Stories</h1>
        <p className="text-slate-500 text-lg">The companies and founders shaping India&apos;s markets — explained for curious investors.</p>
      </div>
      {stories.length === 0 ? (
        <p className="text-slate-400 text-center py-24">No stories yet. Check back soon.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {stories.map((story, i) => <StoryCard key={story.id} story={story} priority={i < 3} />)}
          </div>
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2">
              {page > 1 && <Link href={`/stories?page=${page - 1}`} className="px-4 py-2 text-sm font-medium text-navy border border-slate-200 rounded-lg hover:border-amber hover:text-amber transition-colors">← Previous</Link>}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/stories?page=${p}`} className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${p === page ? 'bg-amber text-navy' : 'border border-slate-200 text-slate-600 hover:border-amber hover:text-amber'}`}>{p}</Link>
              ))}
              {page < totalPages && <Link href={`/stories?page=${page + 1}`} className="px-4 py-2 text-sm font-medium text-navy border border-slate-200 rounded-lg hover:border-amber hover:text-amber transition-colors">Next →</Link>}
            </nav>
          )}
        </>
      )}
    </div>
  )
}
